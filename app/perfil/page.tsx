'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EpisodeCard from '@/components/EpisodeCard'
import Link from 'next/link'

interface User { id:number; name:string; email:string; avatar_color:string|null; is_admin:boolean }
interface EpisodeData { id:number; season:number; episode:number; name:string; duration:string|null; thumbnail_url:string|null }
interface WatchProgress { id:number; episodes: EpisodeData }

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User|null>(null)
  const [history, setHistory] = useState<WatchProgress[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored) as User
    setUser(u)
    loadHistory(u.id)
  }, [router])

  async function loadHistory(userId: number) {
    const { data } = await supabase.from('watch_progress').select('*, episodes(*, titles(*))').eq('user_id',userId).eq('watched',true).order('updated_at',{ascending:false}).limit(10)
    setHistory((data??[]) as WatchProgress[])
  }

  function handleLogout() { localStorage.removeItem('user'); router.push('/login') }

  if (!user) return null
  const av = user.avatar_color ?? '#6366f1'

  return (
    <main style={{minHeight:'100vh',background:'#08080c',color:'white',paddingTop:88,paddingBottom:64,paddingLeft:40,paddingRight:40}}>
      {/* Profile header */}
      <div style={{background:'rgba(15,15,20,0.85)',backdropFilter:'blur(12px)',border:'1px solid rgba(99,102,241,0.12)',borderRadius:16,padding:24,marginBottom:40}}>
        <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
          <div style={{width:80,height:80,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:700,textTransform:'uppercase',flexShrink:0,background:`linear-gradient(135deg,${av},${av}bb)`,boxShadow:`0 8px 32px ${av}40`}}>
            {user.name[0]}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <h1 style={{fontSize:22,fontWeight:700,color:'white'}}>{user.name}</h1>
            <p style={{fontSize:13,color:'#6b6b80',marginTop:4}}>{user.email}</p>
            {user.is_admin && (
              <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:500,color:'#a78bfa',background:'rgba(139,92,246,0.12)',border:'1px solid rgba(139,92,246,0.25)',padding:'4px 10px',borderRadius:8,marginTop:8}}>
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Administrador
              </span>
            )}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
            <Link href="/configuracoes" style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',borderRadius:12,background:'#1a1a24',border:'1px solid #2a2a3a',fontSize:14,fontWeight:500,color:'#a1a1b5',textDecoration:'none'}}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Configuracoes
            </Link>
            <button onClick={handleLogout} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',borderRadius:12,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.22)',fontSize:14,fontWeight:500,color:'#f87171',cursor:'pointer',fontFamily:'inherit'}}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Watch history */}
      <div>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
          <div style={{width:4,height:24,borderRadius:4,background:'linear-gradient(to bottom,#6366f1,#8b5cf6)',flexShrink:0}} />
          <h2 style={{fontSize:17,fontWeight:600,color:'white'}}>Historico</h2>
        </div>
        {history.length === 0 ? (
          <div style={{background:'rgba(15,15,20,0.85)',backdropFilter:'blur(12px)',border:'1px solid rgba(99,102,241,0.12)',borderRadius:16,padding:48,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:64,height:64,borderRadius:16,background:'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#6b6b80"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p style={{fontSize:14,color:'#6b6b80'}}>Nenhum episodio assistido ainda.</p>
          </div>
        ) : (
          <div style={{display:'flex',gap:16,overflowX:'auto',paddingBottom:16}}>
            {history.map(h=><EpisodeCard key={h.id} episode={h.episodes} />)}
          </div>
        )}
      </div>
    </main>
  )
}
