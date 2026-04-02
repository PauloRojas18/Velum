import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import DrivePlayer from '@/components/DrivePlayer'
import EpisodeCard from '@/components/EpisodeCard'
import Link from 'next/link'

export default async function EpisodePage({
  params,
}: {
  params: { id: string }
}) {
  const { data: episode } = await supabase
    .from('episodes')
    .select('*, titles(*)')
    .eq('id', params.id)
    .single()

  if (!episode) notFound()

  const { data: next } = await supabase
    .from('episodes')
    .select('*')
    .eq('title_id', episode.title_id)
    .gt('episode', episode.episode)
    .eq('season', episode.season)
    .order('episode')
    .limit(8)

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="px-8 pt-6 pb-2 flex items-center gap-4">
        <Link
          href={`/title/${episode.title_id}`}
          className="text-[10px] tracking-[3px] uppercase text-white/40 hover:text-white transition-colors"
        >
          Voltar
        </Link>
        <span className="text-white/10">·</span>
        <span className="text-[10px] tracking-[3px] uppercase text-white/20">
          {episode.titles?.name}
        </span>
      </div>

      <div className="px-8 pb-6">
        <DrivePlayer fileId={episode.file_id} storage={episode.storage} />
      </div>

      <div className="px-8 pb-8">
        <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase mb-1">
          Temporada {episode.season} · Episódio {episode.episode}
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-2xl italic">
          {episode.name}
        </h1>
        {episode.duration && (
          <p className="text-xs text-white/30 mt-1">{episode.duration}</p>
        )}
      </div>

      {next && next.length > 0 && (
        <div className="px-8 pb-12">
          <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase mb-6">
            A seguir
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {next.map(ep => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}