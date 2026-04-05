'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import VelumLogo from '@/components/VelumLogo'

interface User { id:number; name:string; email:string; avatar_color:string|null; is_admin:boolean }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true); setError('')
    const { data: user, error } = await supabase.from('users').select('*').eq('email',email).eq('password',password).single<User>()
    if (error || !user) { setError('Email ou senha incorretos.'); setLoading(false); return }
    localStorage.setItem('user', JSON.stringify(user))
    document.cookie = `is_admin=${user.is_admin}; path=/; max-age=604800; SameSite=Lax`
    router.push('/home')
  }

  function fillGuest() {
    setEmail('convidado@email.com')
    setPassword('12345678')
  }

  return (
    <main className="login-main" style={{
      minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 16, overflow: 'hidden',
      backgroundImage: `url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f562aaf4-5dbb-4603-a32b-6ef6c2230136/dh0w8qv-9d8ee6b2-b41a-4681-ab9b-8a227560dc75.jpg/v1/fill/w_1192,h_670,q_70,strp/the_netflix_login_background__canada__2024___by_logofeveryt_dh0w8qv-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6Ii9mL2Y1NjJhYWY0LTVkYmItNDYwMy1hMzJiLTZlZjZjMjIzMDEzNi9kaDB3OHF2LTlkOGVlNmIyLWI0MWEtNDY4MS1hYjliLThhMjI3NTYwZGM3NS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.FScrpAAFnKqBVKwe2syeiOww6mfH6avq-DRHZ_uFVNw')`,
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
    }}>
      <div style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',backgroundColor:'rgba(0,0,0,0.65)',zIndex:0}} />
      <div className="login-glow-1" style={{position:'absolute',top:'25%',left:-80,width:260,height:260,borderRadius:'50%',background:'rgba(99,102,241,0.18)',filter:'blur(60px)',pointerEvents:'none',zIndex:1}} />
      <div className="login-glow-2" style={{position:'absolute',bottom:'25%',right:-80,width:260,height:260,borderRadius:'50%',background:'rgba(139,92,246,0.18)',filter:'blur(60px)',pointerEvents:'none',zIndex:1}} />
      <div className="login-card" style={{width:'100%',maxWidth:380,background:'color-mix(in srgb, var(--card) 92%, transparent)',backdropFilter:'blur(20px)',border:'1px solid rgba(99,102,241,0.14)',borderRadius:20,padding:'48px 32px',boxShadow:'0 20px 60px rgba(0,0,0,0.5)',position:'relative',zIndex:2,WebkitBackdropFilter:'blur(20px)'}}>
        <div style={{width:64,height:64,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}>
          <VelumLogo variant='default'/>
        </div>
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

          {/* Card de acesso como convidado */}
          <button onClick={fillGuest} style={{display:'flex',alignItems:'center',gap:12,width:'100%',background:'rgba(99,102,241,0.08)',border:'1px dashed rgba(99,102,241,0.35)',borderRadius:12,padding:'12px 14px',cursor:'pointer',textAlign:'left',fontFamily:'inherit'}}>
            <div style={{width:34,height:34,borderRadius:10,background:'rgba(99,102,241,0.18)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:12,fontWeight:600,color:'#818cf8',margin:0,marginBottom:3}}>Entrar como convidado</p>
              <p className="guest-info" style={{fontSize:11,color:'#6b6b80',margin:0,lineHeight:1.4}}>
                <span style={{color:'#a1a1b5'}}>convidado@email.com</span>
                {' · '}
                <span style={{color:'#a1a1b5'}}>12345678</span>
              </p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a4a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

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
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        @media (max-width: 480px) {
          .login-card {
            padding: 32px 20px !important;
            margin: 0 8px;
          }
          .login-glow-1,
          .login-glow-2 {
            width: 150px !important;
            height: 150px !important;
          }
          .guest-info {
            font-size: 10px !important;
          }
        }
      `}</style>
    </main>
  )
}
