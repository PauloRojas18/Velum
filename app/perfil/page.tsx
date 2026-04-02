'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'
import EpisodeCard from '@/components/EpisodeCard'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored)
    setUser(u)
    loadHistory(u.id)
  }, [])

  async function loadHistory(userId: number) {
    const { data } = await supabase
      .from('watch_progress')
      .select('*, episodes(*, titles(*))')
      .eq('user_id', userId)
      .eq('watched', true)
      .order('updated_at', { ascending: false })
      .limit(10)
    setHistory(data || [])
  }

  function handleLogout() {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#080808] text-white px-8 py-10">
      <div className="flex items-center gap-5 mb-12">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-[family-name:var(--font-serif)] italic"
          style={{ background: user.avatar_color + '22', border: `1px solid ${user.avatar_color}` }}
        >
          {user.name[0]}
        </div>
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-2xl italic">
            {user.name}
          </h1>
          <p className="text-white/30 text-xs mt-1">{user.email}</p>
          {user.is_admin && (
            <span className="text-[9px] tracking-[2px] uppercase text-[#c9a84c] border border-[#c9a84c]/30 px-2 py-0.5 mt-1 inline-block">
              Admin
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="ml-auto text-[10px] tracking-[3px] uppercase text-white/30 hover:text-white transition-colors"
        >
          Sair
        </button>
      </div>

      <div>
        <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase mb-6">
          Histórico
        </p>
        {history.length === 0 ? (
          <p className="text-white/30 text-sm">Nenhum episódio assistido ainda.</p>
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