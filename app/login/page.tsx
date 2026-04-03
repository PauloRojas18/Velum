'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface User { id:number; name:string; email:string; avatar_color:string|null; is_admin:boolean }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true); setError('')
    const { data: user, error } = await supabase.from('users').select('*').eq('email',email).eq('password',password).single()
    if (error || !user) { setError('Email ou senha incorretos.'); setLoading(false); return }
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/')
  }

  return (
    <main style={{minHeight:'100vh',background:'#08080c',display:'flex',alignItems:'center',justifyContent:'center',padding:16,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'25%',left:-80,width:260,height:260,borderRadius:'50%',background:'rgba(99,102,241,0.18)',filter:'blur(60px)',pointerEvents:'none'}} />
      <div style={{position:'absolute',bottom:'25%',right:-80,width:260,height:260,borderRadius:'50%',background:'rgba(139,92,246,0.18)',filter:'blur(60px)',pointerEvents:'none'}} />
      <div style={{width:'100%',maxWidth:420,background:'rgba(15,15,20,0.9)',backdropFilter:'blur(12px)',border:'1px solid rgba(99,102,241,0.14)',borderRadius:20,padding:'36px 32px',boxShadow:'0 20px 60px rgba(0,0,0,0.5)',position:'relative',zIndex:1}}>
        <div style={{width:64,height:64,borderRadius:16,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:700,color:'white',margin:'0 auto 18px',boxShadow:'0 8px 24px rgba(99,102,241,0.3)'}}>V</div>
        <h1 style={{fontSize:22,fontWeight:700,color:'white',textAlign:'center',marginBottom:6}}>Bem-vindo ao Velum</h1>
        <p style={{fontSize:13,color:'#6b6b80',textAlign:'center',marginBottom:28}}>Entre para acessar seu streaming pessoal</p>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div>
            <label style={{fontSize:12,fontWeight:500,color:'#a1a1b5',display:'block',marginBottom:8}}>Email</label>
            <input type="email" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)}
              style={{width:'100%',background:'#1a1a24',border:'1px solid #2a2a3a',color:'white',fontSize:14,padding:'12px 16px',borderRadius:12,outline:'none',fontFamily:'inherit'}} />
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:500,color:'#a1a1b5',display:'block',marginBottom:8}}>Senha</label>
            <input type="password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
              style={{width:'100%',background:'#1a1a24',border:'1px solid #2a2a3a',color:'white',fontSize:14,padding:'12px 16px',borderRadius:12,outline:'none',fontFamily:'inherit'}} />
          </div>
          {error && (
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 16px',borderRadius:12,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.22)',color:'#f87171',fontSize:13}}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}
          <button onClick={handleLogin} disabled={loading}
            style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:14,fontWeight:600,padding:'13px 24px',borderRadius:12,border:'none',cursor:loading?'not-allowed':'pointer',opacity:loading?0.6:1,boxShadow:'0 4px 20px rgba(99,102,241,0.25)',marginTop:4,fontFamily:'inherit',width:'100%'}}>
            {loading ? (
              <><svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{animation:'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"/><path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Entrando...</>
            ) : 'Entrar'}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </main>
  )
}
