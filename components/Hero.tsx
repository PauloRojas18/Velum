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
      <div className="h-[500px] flex items-end px-8 pb-10">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-5xl italic text-white/20">
            Velum
          </h1>
          <p className="text-white/20 text-sm mt-2">
            Nenhum título cadastrado ainda.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[500px] flex items-end px-8 pb-10 overflow-hidden">
      {featured.cover_url && (
        <img
          src={featured.cover_url}
          alt={featured.name}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

      <div className="relative z-10 max-w-lg">
        <p className="text-[9px] tracking-[4px] text-[#888] uppercase mb-3">
          {featured.type === 'series'
            ? `Série · ${featured.total_seasons} temporadas`
            : `Filme · ${featured.year}`}
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-5xl italic mb-4">
          {featured.name}
        </h1>
        {featured.description && (
          <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3">
            {featured.description}
          </p>
        )}
        <div className="flex gap-3">
          <Link
            href={`/titulo/${featured.id}`}
            className="bg-white text-black text-xs tracking-[3px] uppercase px-6 py-3 hover:bg-white/80 transition-opacity"
          >
            Ver detalhes
          </Link>
          <Link
            href="/catalogo"
            className="border border-white/20 text-white text-xs tracking-[3px] uppercase px-6 py-3 hover:border-white/50 transition-colors"
          >
            Catálogo
          </Link>
        </div>
      </div>
    </div>
  )
}
