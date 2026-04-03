'use client'

import { useState } from 'react'
import EpisodeCard from './EpisodeCard'

type Episode = {
  id: number
  season: number
  episode: number
  name: string
  duration: string | null
  thumbnail_url: string | null
  file_id: string
  storage: string
}

export default function SeasonSelect({
  seasons,
  episodes,
}: {
  seasons: number[]
  episodes: Episode[]
}) {
  const [active, setActive] = useState(seasons[0] ?? 1)
  const filtered = episodes.filter(e => e.season === active)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]" />
          <h2 className="text-lg font-semibold text-white">Episodios</h2>
        </div>
        
        <div className="flex items-center gap-2 bg-[#1a1a24] rounded-xl p-1 border border-[#2a2a3a]">
          {seasons.map(s => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                active === s
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/20'
                  : 'text-[#6b6b80] hover:text-white hover:bg-white/5'
              }`}
            >
              T{s}
            </button>
          ))}
        </div>
        
        <span className="text-sm text-[#6b6b80] bg-[#1a1a24] px-3 py-1.5 rounded-lg border border-[#2a2a3a]">
          {filtered.length} episodios
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(ep => (
          <EpisodeCard key={ep.id} episode={ep} />
        ))}
      </div>
    </div>
  )
}
