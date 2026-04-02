import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import EpisodeCard from '@/components/EpisodeCard'
import TitleCard from '@/components/TitleCard'
import SeasonSelect from '@/components/SeasonSelect'

export default async function TitlePage({
  params,
}: {
  params: { id: string }
}) {
  const { data: title } = await supabase
    .from('titles')
    .select('*')
    .eq('id', params.id)
    .single()

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

  const seasons = [...new Set((episodes || []).map(e => e.season))].sort()

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
          <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase mb-3">
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
              {title.genres.map((g: string) => (
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
        {title.type === 'series' && episodes && (
          <SeasonSelect seasons={seasons} episodes={episodes} />
        )}

        {title.type === 'movie' && similar && similar.length > 0 && (
          <div>
            <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase mb-6">
              Títulos semelhantes
            </p>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {similar.map(t => <TitleCard key={t.id} title={t} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}