'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface User { id:number; name:string; email:string; avatar_color:string|null; is_admin:boolean }

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444'] as const

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User|null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored) as User
    setUser(u); setName(u.name); setColor((u.avatar_color as typeof COLORS[number]) ?? COLORS[0])
  }, [router])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    const { data } = await supabase.from('users').update({name,avatar_color:color}).eq('id',user.id).select().single()
    if (data) { localStorage.setItem('user',JSON.stringify(data)); setUser(data as User); setSaved(true); setTimeout(()=>setSaved(false),2000) }
    setSaving(false)
  }

  if (!user) return null

  return (
    <main style={{minHeight:'100vh',background:'#08080c',color:'white',paddingTop:88,paddingBottom:64,paddingLeft:40,paddingRight:40}}>
      <div style={{maxWidth:560}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
          <Link href="/perfil" style={{width:36,height:36,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#6b6b80',background:'rgba(255,255,255,0.04)'}}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 style={{fontSize:28,fontWeight:700,color:'white'}}>Configuracoes</h1>
        </div>
        <p style={{fontSize:14,color:'#6b6b80',marginBottom:36,marginLeft:44}}>Personalize seu perfil</p>

        {/* Personal info */}
        <div style={{background:'rgba(15,15,20,0.85)',backdropFilter:'blur(12px)',border:'1px solid rgba(99,102,241,0.12)',borderRadius:16,padding:24,marginBottom:16}}>
          <h2 style={{display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:600,color:'white',marginBottom:18}}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#6366f1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Informacoes pessoais
          </h2>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label style={{fontSize:12,fontWeight:500,color:'#a1a1b5',display:'block',marginBottom:8}}>Nome</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)}
                style={{width:'100%',background:'#1a1a24',border:'1px solid #2a2a3a',color:'white',fontSize:14,padding:'12px 16px',borderRadius:12,outline:'none',fontFamily:'inherit'}} />
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:500,color:'#a1a1b5',display:'block',marginBottom:8}}>Email</label>
              <input type="email" value={user.email} disabled
                style={{width:'100%',background:'rgba(26,26,36,0.5)',border:'1px solid #2a2a3a',color:'#6b6b80',fontSize:14,padding:'12px 16px',borderRadius:12,outline:'none',cursor:'not-allowed',fontFamily:'inherit'}} />
            </div>
          </div>
        </div>

        {/* Avatar color */}
        <div style={{background:'rgba(15,15,20,0.85)',backdropFilter:'blur(12px)',border:'1px solid rgba(99,102,241,0.12)',borderRadius:16,padding:24,marginBottom:16}}>
          <h2 style={{display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:600,color:'white',marginBottom:18}}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#8b5cf6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Cor do avatar
          </h2>
          <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
            <div style={{width:64,height:64,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:700,textTransform:'uppercase',flexShrink:0,background:`linear-gradient(135deg,${color},${color}bb)`,boxShadow:`0 8px 32px ${color}40`,transition:'all 0.3s'}}>
              {name[0]||'U'}
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setColor(c)}
                  style={{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${c},${c}bb)`,border:'none',cursor:'pointer',transition:'transform 0.2s',transform:'scale(1)',outline:color===c?`3px solid ${c}`:'none',outlineOffset:color===c?3:0,boxShadow:color===c?`0 4px 20px ${c}40`:'none'}}
                />
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          style={{width:'100%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:14,fontWeight:600,padding:'14px 24px',borderRadius:12,border:'none',cursor:saving?'not-allowed':'pointer',opacity:saving?0.6:1,boxShadow:'0 4px 20px rgba(99,102,241,0.25)',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'inherit'}}>
          {saving ? (
            <><svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{animation:'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"/><path fill="white" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Salvando...</>
          ) : saved ? (
            <><svg width="16" height="16" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Salvo!</>
          ) : 'Salvar alteracoes'}
        </button>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </main>
  )
}
