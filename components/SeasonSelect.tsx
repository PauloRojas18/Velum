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
  const [active, setActive] = useState(seasons[0] || 1)
  const filtered = episodes.filter(e => e.season === active)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase">
          Temporada
        </p>
        <select
          value={active}
          onChange={e => setActive(Number(e.target.value))}
          className="bg-white/5 border border-white/10 text-white text-xs px-3 py-2 outline-none focus:border-[#c9a84c] transition-colors"
        >
          {seasons.map(s => (
            <option key={s} value={s} className="bg-[#111]">
              Temporada {s}
            </option>
          ))}
        </select>
        <span className="text-white/20 text-xs">
          {filtered.length} episódios
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