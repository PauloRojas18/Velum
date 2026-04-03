import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import TitleCard from '@/components/TitleCard'
import SeasonSelect from '@/components/SeasonSelect'

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

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div
        className="relative h-[360px] flex items-end px-8 pb-10 overflow-hidden"
        style={{ background: '#0f0f0f' }}
      >
        {title.cover_url && (
          <img
            src={title.cover_url}
            alt={title.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-[9px] tracking-[4px] text-[#888] uppercase mb-3">
            {title.type === 'series'
              ? `Série · ${title.total_seasons} temporadas · ${title.total_episodes} episódios`
              : `Filme · ${title.year}`}
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-4xl italic mb-4">
            {title.name}
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-6">
            {title.description}
          </p>
          {title.genres && (
            <div className="flex gap-2 flex-wrap">
              {title.genres.map((g) => (
                <span
                  key={g}
                  className="text-[9px] tracking-[2px] uppercase border border-white/20 px-3 py-1 text-white/40"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-10">
        {title.type === 'series' && typedEpisodes.length > 0 && (
          <SeasonSelect seasons={seasons} episodes={typedEpisodes} />
        )}

        {title.type === 'movie' && typedSimilar.length > 0 && (
          <div>
            <p className="text-[9px] tracking-[4px] text-[#888] uppercase mb-6">
              Títulos semelhantes
            </p>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {typedSimilar.map(t => <TitleCard key={t.id} title={t} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
