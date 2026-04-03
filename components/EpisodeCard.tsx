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
    <Link href={`/episodio/${episode.id}`} className="group block flex-none w-[200px]">
      <div className="w-full h-[112px] bg-[#1a1a24] rounded-xl overflow-hidden relative border border-[#2a2a3a] card-hover">
        {episode.thumbnail_url ? (
          <img
            src={episode.thumbnail_url}
            alt={episode.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10">
            <span className="text-3xl font-bold text-[#6366f1]/30">
              {episode.episode}
            </span>
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
          <div className="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* Episode badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#6366f1]/90 backdrop-blur-sm">
          <span className="text-[10px] font-semibold text-white">EP {episode.episode}</span>
        </div>

        {/* Duration badge */}
        {episode.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-[#08080c]/80 backdrop-blur-sm">
            <span className="text-[10px] font-medium text-[#a1a1b5]">{episode.duration}</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium text-white truncate group-hover:text-[#818cf8] transition-colors">
          {episode.name}
        </p>
        <p className="text-xs text-[#6b6b80] mt-1">
          Temporada {episode.season}
        </p>
      </div>
    </Link>
  )
}
