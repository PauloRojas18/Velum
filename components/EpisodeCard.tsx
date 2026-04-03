import Link from 'next/link'

type Episode = {
  id: number
  season: number
  episode: number
  name: string
  duration: string | null
  thumbnail_url: string | null
}

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link href={`/episodio/${episode.id}`} className="group block flex-none w-[160px]">
      <div className="w-full h-[90px] bg-[#111] border border-white/5 overflow-hidden relative">
        {episode.thumbnail_url ? (
          <img
            src={episode.thumbnail_url}
            alt={episode.name}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-[family-name:var(--font-serif)] text-3xl italic text-white/10">
              {episode.episode}
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <span className="text-white text-sm">Assistir</span>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-[9px] tracking-[3px] text-[#888] uppercase">
          Ep {episode.episode}
        </p>
        <p className="text-xs text-white/70 mt-1 truncate">{episode.name}</p>
        {episode.duration && (
          <p className="text-[10px] text-white/30 mt-0.5">{episode.duration}</p>
        )}
      </div>
    </Link>
  )
}
