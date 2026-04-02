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
  return (
    <Link href={`/title/${title.id}`} className="group block">
      <div className="w-full aspect-[2/3] bg-[#111] border border-white/5 overflow-hidden relative">
        {title.cover_url ? (
          <img
            src={title.cover_url}
            alt={title.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <span className="font-[family-name:var(--font-serif)] text-2xl italic text-white/10 text-center">
              {title.name}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs font-medium truncate">{title.name}</p>
          <p className="text-[10px] text-white/40 mt-0.5">
            {title.type === 'series'
              ? `${title.total_seasons} temp.`
              : title.year}
          </p>
        </div>
      </div>
      <div className="mt-2 group-hover:hidden">
        <p className="text-xs text-white/70 truncate">{title.name}</p>
        <p className="text-[10px] text-white/30 mt-0.5">
          {title.type === 'series'
            ? `${title.total_seasons} temporadas`
            : `Filme · ${title.year}`}
        </p>
      </div>
    </Link>
  )
}