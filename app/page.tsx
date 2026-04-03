import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import TitleCard from '@/components/TitleCard'
import SeasonSelect from '@/components/SeasonSelect'
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
  genres: string[] | null
}

type Episode = {
  id: number
  season: number
  episode: number
  name: string
  duration: string | null
  thumbnail_url: string | null
  file_id: string
  storage: string
  title_id: number
}

type SimilarTitle = {
  id: number
  name: string
  type: string
  cover_url: string | null
  year: number | null
  total_seasons: number | null
  total_episodes: number | null
}

export default async function TitlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: title } = await supabase
    .from('titles')
    .select('*')
    .eq('id', id)
    .single<Title>()

  if (!title) notFound()

  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .eq('title_id', title.id)
    .order('season')
    .order('episode')

  const { data: similar } = await supabase
    .from('titles')
    .select('*')
    .eq('type', title.type)
    .neq('id', title.id)
    .limit(8)

  const typedEpisodes = (episodes ?? []) as Episode[]
  const typedSimilar = (similar ?? []) as SimilarTitle[]
  const seasons = [...new Set(typedEpisodes.map(e => e.season))].sort((a, b) => a - b)

  // Get first episode for play button
  const firstEpisode = typedEpisodes[0]

  return (
    <main className="min-h-screen bg-[#08080c] text-white">
      {/* Hero Section */}
      <div
        className="relative h-[520px] flex items-end px-6 lg:px-10 pb-12 pt-20 overflow-hidden"
      >
        {title.cover_url && (
          <img
            src={title.cover_url}
            alt={title.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080c] via-[#08080c]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#8b5cf6]/5" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
            <span className="text-xs font-medium text-[#818cf8]">
              {title.type === 'series'
                ? `Serie - ${title.total_seasons} temporadas - ${title.total_episodes} episodios`
                : `Filme - ${title.year}`}
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {title.name}
          </h1>
          
          {title.description && (
            <p className="text-[#a1a1b5] text-base leading-relaxed mb-6 max-w-2xl">
              {title.description}
            </p>
          )}
          
          {title.genres && title.genres.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {title.genres.map((g) => (
                <span
                  key={g}
                  className="text-xs font-medium text-[#a1a1b5] bg-[#1a1a24] border border-[#2a2a3a] px-3 py-1.5 rounded-lg"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {firstEpisode && (
            <Link
              href={`/episodio/${firstEpisode.id}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all hover:shadow-lg hover:shadow-[#6366f1]/25"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Assistir agora
            </Link>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 lg:px-10 py-10">
        {title.type === 'series' && typedEpisodes.length > 0 && (
          <SeasonSelect seasons={seasons} episodes={typedEpisodes} />
        )}

        {title.type === 'movie' && typedSimilar.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]" />
              <h2 className="text-lg font-semibold text-white">Titulos semelhantes</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {typedSimilar.map(t => (
                <div key={t.id} className="flex-none w-[160px]">
                  <TitleCard title={t} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
