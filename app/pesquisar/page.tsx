'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'

type Title = { id:number; name:string; type:string; cover_url:string|null; year:number|null; total_seasons:number|null; total_episodes:number|null }

export default function PesquisarPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Title[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    const { data } = await supabase.from('titles').select('*').ilike('name',`%${query}%`)
    setResults((data??[]) as Title[])
    setSearched(true)
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',background:'#08080c',color:'white',paddingTop:88,paddingBottom:64,paddingLeft:40,paddingRight:40}}>
      <div style={{marginBottom:40}}>
        <h1 style={{fontSize:30,fontWeight:700,color:'white',marginBottom:6}}>Buscar</h1>
        <p style={{fontSize:14,color:'#6b6b80'}}>Encontre seus titulos favoritos</p>
      </div>
      <div style={{display:'flex',gap:12,marginBottom:40,maxWidth:640}}>
        <div style={{flex:1,position:'relative'}}>
          <svg style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',width:18,height:18,color:'#6b6b80',pointerEvents:'none'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Nome do titulo..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()}
            style={{width:'100%',background:'#1a1a24',border:'1px solid #2a2a3a',color:'white',fontSize:14,padding:'13px 16px 13px 46px',borderRadius:12,outline:'none',fontFamily:'inherit'}} />
        </div>
        <button onClick={handleSearch} disabled={loading}
          style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:14,fontWeight:600,padding:'0 24px',borderRadius:12,border:'none',cursor:loading?'not-allowed':'pointer',boxShadow:'0 4px 16px rgba(99,102,241,0.25)',display:'flex',alignItems:'center',justifyContent:'center',minWidth:90,fontFamily:'inherit',opacity:loading?0.6:1}}>
          {loading ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style={{animation:'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"/><path fill="white" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : 'Buscar'}
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
            <div style={{width:4,height:24,borderRadius:4,background:'linear-gradient(to bottom,#6366f1,#8b5cf6)',flexShrink:0}} />
            <h2 style={{fontSize:17,fontWeight:600,color:'white'}}>Resultados</h2>
            <span style={{fontSize:13,color:'#6b6b80',background:'#1a1a24',padding:'3px 12px',borderRadius:8,border:'1px solid #2a2a3a'}}>{results.length} titulos</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:16}}>
            {results.map(t=><TitleCard key={t.id} title={t} />)}
          </div>
        </div>
      )}

      {searched && results.length === 0 && (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 20px'}}>
          <div style={{width:72,height:72,borderRadius:16,background:'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#6b6b80"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p style={{fontSize:14,color:'#6b6b80',textAlign:'center'}}>Nenhum resultado para &quot;{query}&quot;</p>
        </div>
      )}

      {!searched && (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 20px'}}>
          <div style={{width:72,height:72,borderRadius:16,background:'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#6366f1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p style={{fontSize:14,color:'#6b6b80',textAlign:'center'}}>Digite o nome de um titulo para buscar</p>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </main>
  )
}
