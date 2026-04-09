'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

interface User { id:number; name:string; email:string; avatar_color:string|null; is_admin:boolean }

interface Profile { id:number; name:string; avatar_color:string|null; avatars?: string[] }

interface HistoryItem {
  id: number
  updated_at: string
  episode_id: number
  episodes: {
    id: number; season: number; episode: number; name: string
    duration: string | null; thumbnail_url: string | null
    titles: { id: number; name: string } | null
  } | null
}

function getUserFromStorage(): User | null {
  try {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) as User : null
  } catch {
    return null
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user] = useState<User | null>(getUserFromStorage)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(!!getUserFromStorage())
  const [profiles, setProfiles] = useState<Profile[]>([])
  const loadHistory = useCallback((userId: number) => {
    supabase
      .from('watch_progress')
      .select('id, updated_at, episode_id, episodes(id, season, episode, name, duration, thumbnail_url, titles(id, name))')
      .eq('user_id', userId)
      .eq('watched', true)
      .order('updated_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!error) setHistory((data ?? []) as unknown as HistoryItem[])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const load = async () => {
        try{
            const s = localStorage.getItem('user')

            if(!s) return

            const parsedUser: User = JSON.parse(s)

            const { data } = await supabase.from('profiles').select('*, avatars(id,image_url)').eq('user_id', parsedUser.id)

            if (data) setProfiles(data) }catch(e){
                console.error('Error loading profiles:', e)
        }
    }       
    if (!user) { router.push('/login'); return }
    loadHistory(user.id)

    load()
  }, [user, router, loadHistory])

  function handleLogout() { localStorage.removeItem('user'); router.push('/login') }

  if (!user) return null
  const av = user.avatar_color ?? '#6366f1'

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', paddingTop: 64 }}>
      <div className="perfil-container" style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Profile card */}
        <div className="profile-card" style={{ background: 'var(--surface-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-card)', borderRadius: 16, padding: 28, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' as const }}>
          {profiles.map((p) => (
          <div key={p.id} style={{ width: 80, height: 80, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 800, textTransform: 'uppercase' as const, flexShrink: 0, color: 'white', background: `linear-gradient(135deg,${av},${av}aa)` }}>
            <Image 
            src={p.avatars?.image_url}
            alt={p.name}
            width={80}
            height={80}
            style={{ borderRadius: 8, objectFit: 'cover', transition: 'opacity 0.2s' }}/>
          </div>
          ))}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="profile-name" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{user.name}</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user.email}</p>
            {user.is_admin && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#a78bfa', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', padding: '3px 9px', borderRadius: 6, marginTop: 8 }}>
                <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Administrador
              </span>
            )}
          </div>
          <div className="profile-actions" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/configuracoes" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--surface-border)', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
              Configurações
            </Link>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', fontSize: 13, fontWeight: 500, color: '#f87171', cursor: 'pointer', fontFamily: 'inherit' }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Sair
            </button>
          </div>
        </div>

        {/* Watch history */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 3, height: 20, borderRadius: 3, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)', flexShrink: 0 }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Histórico</h2>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-faint)', fontSize: 14 }}>Carregando...</p>
          ) : history.length === 0 ? (
            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-card)', borderRadius: 14, padding: '48px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-faint)' }}>Nenhum episódio assistido ainda.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map(h => {
                const ep = h.episodes
                if (!ep) return null
                return (
                  <Link key={h.id} href={`/episodio/${ep.id}`} className="history-item" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--surface-card)', border: '1px solid var(--border-card)', borderRadius: 12, textDecoration: 'none', transition: 'background 0.2s' }}>
                    <div className="history-thumb" style={{ width: 96, height: 54, borderRadius: 8, background: 'var(--card-bg)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--card-border)' }}>
                      {ep.thumbnail_url
                        ? <img src={ep.thumbnail_url} alt={ep.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card-placeholder-bg)', fontSize: 18, fontWeight: 700, color: 'var(--card-placeholder-color)' }}>{ep.episode}</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{ep.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {ep.titles?.name && <span style={{ color: 'var(--text-secondary)' }}>{ep.titles.name} · </span>}
                        T{ep.season} E{ep.episode}
                        {ep.duration && <span> · {ep.duration}</span>}
                      </p>
                    </div>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--text-faint)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .perfil-container {
          padding: 40px 48px 64px;
        }
        .profile-card {
          flex-direction: row;
        }
        .profile-actions {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .perfil-container {
            padding: 24px 16px 64px;
          }
          .profile-card {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 16px !important;
            padding: 20px !important;
          }
          .profile-name {
            font-size: 20px !important;
          }
          .profile-actions {
            width: 100%;
          }
          .profile-actions a,
          .profile-actions button {
            flex: 1;
            justify-content: center;
          }
          .history-item {
            padding: 10px 12px !important;
            gap: 12px !important;
          }
          .history-thumb {
            width: 72px !important;
            height: 42px !important;
          }
        }

        @media (max-width: 480px) {
          .history-thumb {
            width: 60px !important;
            height: 36px !important;
          }
        }
      `}</style>
    </main>
  )
}
