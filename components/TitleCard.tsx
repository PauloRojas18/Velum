'use client'

import { useState } from 'react'
import Link from 'next/link'

type Title = {
  id: number
  name: string
  type: string
  cover_url: string | null
  year: number | null
  total_seasons: number | null
  total_episodes: number | null
}

export default function TitleCard({ title }: { title: Title }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link href={`/titulo/${title.id}`} className="group block">
      <div className="w-full aspect-[2/3] bg-[#1a1a24] rounded-xl overflow-hidden relative border border-[#2a2a3a] card-hover">
        {title.cover_url && !imgError ? (
          <img
            src={title.cover_url}
            alt=""
            onError={() => setImgError(true)}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10">
            <span className="text-lg font-bold text-[#6366f1]/60 text-center leading-tight">
              {title.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-[#6366f1] flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-[#08080c]/80 backdrop-blur-sm border border-white/10">
          <span className="text-[10px] font-medium text-[#a1a1b5]">
            {title.type === 'series' ? 'Serie' : 'Filme'}
          </span>
        </div>

        {/* Bottom info on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-sm font-semibold text-white truncate">{title.name}</p>
          <p className="text-xs text-[#a1a1b5] mt-1">
            {title.type === 'series'
              ? `${title.total_seasons} temp.`
              : title.year}
          </p>
        </div>
      </div>
      <div className="mt-3 group-hover:opacity-0 transition-opacity duration-300">
        <p className="text-sm font-medium text-white truncate">{title.name}</p>
        <p className="text-xs text-[#6b6b80] mt-1">
          {title.type === 'series'
            ? `${title.total_seasons} temporadas`
            : `Filme - ${title.year}`}
        </p>
      </div>
    </Link>
  )
}
