import Link from 'next/link'

type Title = {
  id: number
  name: string
  description: string | null
  cover_url: string | null
  type: string
  total_seasons: number | null
  total_episodes: number | null
  year: number | null
}

export default function Hero({ titles }: { titles: Title[] }) {
  const featured = titles[0]

  if (!featured) {
    return (
      <div className="h-[560px] flex items-center justify-center px-8 pt-20">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-3">
            Velum
          </h1>
          <p className="text-[#6b6b80] text-sm">
            Nenhum titulo cadastrado ainda.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[600px] flex items-end px-6 lg:px-10 pb-16 pt-20 overflow-hidden">
      {featured.cover_url && (
        <img
          src={featured.cover_url}
          alt={featured.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08080c] via-[#08080c]/90 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#8b5cf6]/5" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
          <span className="text-xs font-medium text-[#818cf8]">
            {featured.type === 'series'
              ? `Serie - ${featured.total_seasons} temporadas`
              : `Filme - ${featured.year}`}
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {featured.name}
        </h1>
        {featured.description && (
          <p className="text-[#a1a1b5] text-base leading-relaxed mb-8 line-clamp-3 max-w-xl">
            {featured.description}
          </p>
        )}
        <div className="flex gap-4">
          <Link
            href={`/titulo/${featured.id}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:shadow-lg hover:shadow-[#6366f1]/25"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Assistir agora
          </Link>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white/20 hover:border-white/20 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Explorar catalogo
          </Link>
        </div>
      </div>
    </div>
  )
}
