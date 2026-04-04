'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Title = { id:number; name:string; type:string; cover_url:string|null; year:number|null; total_seasons:number|null; total_episodes:number|null; description:string|null; featured?:boolean|null }
type Tab = 'titles' | 'add'

export default function AdminPage() {
  const [titles, setTitles] = useState<Title[]>([])
  const [tab, setTab] = useState<Tab>('titles')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all'|'series'|'movie'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<number|null>(null)
  const [editingId, setEditingId] = useState<number|null>(null)
  const [toast, setToast] = useState<{msg:string;type:'ok'|'err'}|null>(null)
  const [form, setForm] = useState({ name:'',type:'series',cover_url:'',year:'',total_seasons:'',total_episodes:'',description:'' })

  function showToast(msg:string,type:'ok'|'err'='ok') { setToast({msg,type}); setTimeout(()=>setToast(null),3000) }

  async function loadTitles() {
    setLoading(true)
    const { data } = await supabase.from('titles').select('*').order('id',{ascending:false})
    setTitles((data??[]) as Title[])
    setLoading(false)
  }

  async function saveTitle() {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = { name:form.name.trim(), type:form.type, cover_url:form.cover_url.trim()||null, year:form.year?parseInt(form.year):null, total_seasons:form.total_seasons?parseInt(form.total_seasons):null, total_episodes:form.total_episodes?parseInt(form.total_episodes):null, description:form.description.trim()||null }
    if (editingId) {
      const { error } = await supabase.from('titles').update(payload).eq('id',editingId)
      if (error) showToast('Erro ao salvar','err'); else showToast('Título atualizado!')
      setEditingId(null)
    } else {
      const { error } = await supabase.from('titles').insert([payload])
      if (error) showToast('Erro ao adicionar','err'); else showToast('Título adicionado!')
    }
    setForm({name:'',type:'series',cover_url:'',year:'',total_seasons:'',total_episodes:'',description:''})
    setSaving(false); setTab('titles'); loadTitles()
  }

  function startEdit(t:Title) {
    setForm({name:t.name,type:t.type,cover_url:t.cover_url??'',year:t.year?.toString()??'',total_seasons:t.total_seasons?.toString()??'',total_episodes:t.total_episodes?.toString()??'',description:t.description??''})
    setEditingId(t.id); setTab('add'); window.scrollTo(0,0)
  }

  async function deleteTitle(id:number) {
    const { error } = await supabase.from('titles').delete().eq('id',id)
    if (error) showToast('Erro ao excluir','err'); else showToast('Título excluído')
    setDeleteConfirm(null); loadTitles()
  }

  async function toggleFeatured(id:number,current:boolean|null) {
    await supabase.from('titles').update({featured:!current}).eq('id',id)
    showToast(!current?'Marcado como destaque':'Destaque removido'); loadTitles()
  }

  useEffect(()=>{ loadTitles() },[])

  const filtered = titles.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) && (filterType==='all'||t.type===filterType))

  const inp = { width:'100%',padding:'10px 14px',background:'var(--surface-input)',border:'1px solid var(--surface-border)',borderRadius:8,color:'var(--text-primary)',fontSize:14,outline:'none',fontFamily:'inherit' } as React.CSSProperties
  const lbl = { display:'block' as const,fontSize:12,fontWeight:600,color:'var(--text-muted)',marginBottom:6,textTransform:'uppercase' as const,letterSpacing:1 }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text-primary)',fontFamily:'inherit'}}>
      {toast && (
        <div style={{position:'fixed',top:24,right:24,zIndex:9999,padding:'12px 20px',borderRadius:10,background:toast.type==='ok'?'#16a34a':'#dc2626',color:'white',fontSize:14,fontWeight:500,boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}}>
          {toast.type==='ok'?'✓ ':'✕ '}{toast.msg}
        </div>
      )}

      <header style={{position:'sticky',top:0,zIndex:30,background:'var(--bg-nav)',backdropFilter:'blur(12px)',borderBottom:'1px solid var(--surface-border)',padding:'0 32px',display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
            <div style={{width:28,height:28,borderRadius:7,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'white'}}>V</div>
            <span style={{fontWeight:600,fontSize:15,color:'var(--text-primary)'}}>Velum</span>
          </Link>
          <span style={{color:'var(--surface-border)'}}>|</span>
          <span style={{fontSize:14,fontWeight:600,color:'#6366f1'}}>Painel Admin</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{padding:'4px 10px',borderRadius:6,background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.2)',fontSize:12,color:'#818cf8',fontWeight:500}}>{titles.length} títulos</span>
          <Link href="/" style={{padding:'6px 14px',borderRadius:8,background:'transparent',border:'1px solid var(--surface-border)',fontSize:13,color:'var(--text-secondary)',textDecoration:'none'}}>← Voltar</Link>
        </div>
      </header>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'32px 24px'}}>
        <div style={{display:'flex',gap:4,marginBottom:28,borderBottom:'1px solid var(--surface-border)'}}>
          {([{key:'titles',label:'Títulos cadastrados'},{key:'add',label:editingId?'✏️ Editar título':'+ Adicionar título'}] as {key:Tab;label:string}[]).map(({key,label})=>(
            <button key={key} onClick={()=>{ if(key==='titles'&&editingId){setEditingId(null);setForm({name:'',type:'series',cover_url:'',year:'',total_seasons:'',total_episodes:'',description:''})} setTab(key) }}
              style={{padding:'10px 20px',background:'none',border:'none',cursor:'pointer',fontSize:14,fontWeight:600,color:tab===key?'var(--text-primary)':'var(--text-muted)',borderBottom:tab===key?'2px solid #6366f1':'2px solid transparent',transition:'all 0.2s',marginBottom:-1,fontFamily:'inherit'}}>
              {label}
            </button>
          ))}
        </div>

        {tab==='titles' && (
          <div>
            <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
              <div style={{position:'relative',flex:1,minWidth:200}}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)'}}>
                  <circle cx="11" cy="11" r="8" strokeWidth={2}/><path d="m21 21-4.35-4.35" strokeWidth={2} strokeLinecap="round"/>
                </svg>
                <input placeholder="Buscar título..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,paddingLeft:38}} />
              </div>
              <div style={{display:'flex',gap:6}}>
                {(['all','series','movie'] as const).map(f=>(
                  <button key={f} onClick={()=>setFilterType(f)} style={{padding:'8px 16px',borderRadius:8,border:'1px solid',cursor:'pointer',fontSize:13,fontWeight:500,background:filterType===f?'rgba(99,102,241,0.2)':'transparent',borderColor:filterType===f?'#6366f1':'var(--surface-border)',color:filterType===f?'#818cf8':'var(--text-muted)',fontFamily:'inherit'}}>
                    {f==='all'?'Todos':f==='series'?'Séries':'Filmes'}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div style={{textAlign:'center',padding:80,color:'var(--text-faint)'}}>Carregando...</div>
            ) : filtered.length===0 ? (
              <div style={{textAlign:'center',padding:80,color:'var(--text-faint)'}}>Nenhum resultado</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {filtered.map(t=>(
                  <div key={t.id} style={{display:'flex',alignItems:'center',gap:16,padding:'14px 18px',background:'var(--surface-card)',border:'1px solid var(--border-card)',borderRadius:12}}>
                    <div style={{width:46,height:64,borderRadius:8,flexShrink:0,background:'var(--card-bg)',overflow:'hidden',border:'1px solid var(--card-border)'}}>
                      {t.cover_url && <img src={t.cover_url} alt={t.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                        <p style={{fontWeight:600,fontSize:15,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.name}</p>
                        {t.featured && <span style={{padding:'2px 8px',borderRadius:4,background:'rgba(234,179,8,0.15)',border:'1px solid rgba(234,179,8,0.3)',fontSize:10,fontWeight:600,color:'#fbbf24',flexShrink:0}}>DESTAQUE</span>}
                      </div>
                      <div style={{display:'flex',gap:12,alignItems:'center'}}>
                        <span style={{padding:'2px 8px',borderRadius:4,background:t.type==='series'?'rgba(99,102,241,0.12)':'rgba(16,185,129,0.12)',border:`1px solid ${t.type==='series'?'rgba(99,102,241,0.2)':'rgba(16,185,129,0.2)'}`,fontSize:11,fontWeight:600,color:t.type==='series'?'#818cf8':'#34d399'}}>
                          {t.type==='series'?'SÉRIE':'FILME'}
                        </span>
                        {t.year && <span style={{fontSize:12,color:'var(--text-faint)'}}>{t.year}</span>}
                        {t.type==='series'&&t.total_seasons && <span style={{fontSize:12,color:'var(--text-faint)'}}>{t.total_seasons} temp.</span>}
                        {t.total_episodes && <span style={{fontSize:12,color:'var(--text-faint)'}}>{t.total_episodes} ep.</span>}
                      </div>
                    </div>
                    <div style={{display:'flex',gap:6,flexShrink:0}}>
                      <button onClick={()=>toggleFeatured(t.id,t.featured??false)} style={{width:34,height:34,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',background:t.featured?'rgba(234,179,8,0.15)':'transparent',border:`1px solid ${t.featured?'rgba(234,179,8,0.3)':'var(--surface-border)'}`,cursor:'pointer',color:t.featured?'#fbbf24':'var(--text-faint)',fontSize:16}}>★</button>
                      <button onClick={()=>startEdit(t)} style={{width:34,height:34,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',border:'1px solid var(--surface-border)',cursor:'pointer',color:'var(--text-muted)'}}>
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeWidth={2} strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth={2} strokeLinecap="round"/></svg>
                      </button>
                      {deleteConfirm===t.id ? (
                        <div style={{display:'flex',gap:4}}>
                          <button onClick={()=>deleteTitle(t.id)} style={{padding:'4px 10px',borderRadius:6,background:'#dc2626',border:'none',color:'white',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Confirmar</button>
                          <button onClick={()=>setDeleteConfirm(null)} style={{padding:'4px 10px',borderRadius:6,background:'transparent',border:'1px solid var(--surface-border)',color:'var(--text-muted)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Cancelar</button>
                        </div>
                      ) : (
                        <button onClick={()=>setDeleteConfirm(t.id)} style={{width:34,height:34,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',background:'transparent',border:'1px solid var(--surface-border)',cursor:'pointer',color:'var(--text-muted)'}}>
                          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==='add' && (
          <div style={{maxWidth:680}}>
            {editingId && <div style={{padding:'10px 16px',borderRadius:8,marginBottom:24,background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',fontSize:13,color:'#818cf8'}}>✏️ Editando título ID #{editingId}</div>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
              <div style={{gridColumn:'1/-1'}}>
                <label style={lbl}>Nome do título *</label>
                <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ex: Money Heist" style={inp} />
              </div>
              <div>
                <label style={lbl}>Tipo</label>
                <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} style={inp}>
                  <option value="series">Série</option>
                  <option value="movie">Filme</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Ano</label>
                <input type="number" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} placeholder="2024" style={inp} />
              </div>
              {form.type==='series' && (<>
                <div>
                  <label style={lbl}>Temporadas</label>
                  <input type="number" value={form.total_seasons} onChange={e=>setForm({...form,total_seasons:e.target.value})} placeholder="4" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Episódios totais</label>
                  <input type="number" value={form.total_episodes} onChange={e=>setForm({...form,total_episodes:e.target.value})} placeholder="40" style={inp} />
                </div>
              </>)}
              <div style={{gridColumn:'1/-1'}}>
                <label style={lbl}>URL da capa</label>
                <input value={form.cover_url} onChange={e=>setForm({...form,cover_url:e.target.value})} placeholder="https://..." style={inp} />
              </div>
              <div style={{gridColumn:'1/-1'}}>
                <label style={lbl}>Descrição</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Sinopse..." rows={4} style={{...inp,resize:'vertical'}} />
              </div>
            </div>
            {form.cover_url && (
              <div style={{marginTop:20}}>
                <label style={lbl}>Preview</label>
                <img src={form.cover_url} alt="preview" style={{width:100,height:148,objectFit:'cover',borderRadius:10,border:'1px solid var(--surface-border)'}} onError={e=>{(e.target as HTMLImageElement).style.display='none'}} />
              </div>
            )}
            <div style={{display:'flex',gap:12,marginTop:28}}>
              <button onClick={saveTitle} disabled={saving||!form.name.trim()} style={{padding:'12px 28px',borderRadius:10,background:form.name.trim()?'linear-gradient(135deg,#6366f1,#8b5cf6)':'var(--surface)',border:'none',color:form.name.trim()?'white':'var(--text-muted)',fontSize:14,fontWeight:600,cursor:form.name.trim()?'pointer':'not-allowed',boxShadow:form.name.trim()?'0 4px 20px rgba(99,102,241,0.3)':'none',fontFamily:'inherit'}}>
                {saving?'Salvando...':editingId?'Salvar alterações':'Adicionar título'}
              </button>
              <button onClick={()=>{setTab('titles');setEditingId(null);setForm({name:'',type:'series',cover_url:'',year:'',total_seasons:'',total_episodes:'',description:''})}} style={{padding:'12px 20px',borderRadius:10,background:'transparent',border:'1px solid var(--surface-border)',color:'var(--text-muted)',fontSize:14,cursor:'pointer',fontFamily:'inherit'}}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        input::placeholder, textarea::placeholder { color: var(--text-faint); }
        select option { background: var(--surface-input); color: var(--text-primary); }
        textarea { outline: none; }
      `}</style>
    </div>
  )
}