'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EpisodeCard from '@/components/EpisodeCard'
import Link from 'next/link'

interface User {
  id: number
  name: string
  email: string
  avatar_color: string | null
  is_admin: boolean
}

interface EpisodeData {
  id: number
  season: number
  episode: number
  name: string
  duration: string | null
  thumbnail_url: string | null
}

interface WatchProgress {
  id: number
  episodes: EpisodeData
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<WatchProgress[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored) as User
    setUser(u)
    loadHistory(u.id)
  }, [router])

  async function loadHistory(userId: number) {
    const { data } = await supabase
      .from('watch_progress')
      .select('*, episodes(*, titles(*))')
      .eq('user_id', userId)
      .eq('watched', true)
      .order('updated_at', { ascending: false })
      .limit(10)
    setHistory((data ?? []) as WatchProgress[])
  }

  function handleLogout() {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null

  const avatarColor = user.avatar_color ?? '#6366f1'

  return (
    <main className="min-h-screen bg-[#08080c] text-white pt-24 px-6 lg:px-10 pb-16">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-6 mb-10">
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold uppercase shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${avatarColor} 0%, ${avatarColor}cc 100%)`,
              boxShadow: `0 8px 32px ${avatarColor}40`
            }}
          >
            {user.name[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {user.name}
            </h1>
            <p className="text-[#6b6b80] text-sm mt-1">{user.email}</p>
            {user.is_admin && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#a78bfa] bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 px-2.5 py-1 rounded-lg mt-2">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Administrador
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/configuracoes"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-sm font-medium text-[#a1a1b5] hover:text-white hover:border-[#6366f1]/50 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuracoes
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Watch History */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]" />
          <h2 className="text-lg font-semibold text-white">Historico</h2>
        </div>
        
        {history.length === 0 ? (
          <div className="glass rounded-2xl p-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#6b6b80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[#6b6b80] text-center">Nenhum episodio assistido ainda.</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {history.map(h => (
              <EpisodeCard key={h.id} episode={h.episodes} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
