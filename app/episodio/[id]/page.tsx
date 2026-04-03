import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import DrivePlayer from '@/components/DrivePlayer'
import EpisodeCard from '@/components/EpisodeCard'
import Link from 'next/link'

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
  titles: { name: string } | null
}

type NextEpisode = {
  id: number
  season: number
  episode: number
  name: string
  duration: string | null
  thumbnail_url: string | null
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: episode } = await supabase
    .from('episodes')
    .select('*, titles(*)')
    .eq('id', id)
    .single<Episode>()

  if (!episode) notFound()

  const { data: next } = await supabase
    .from('episodes')
    .select('*')
    .eq('title_id', episode.title_id)
    .gt('episode', episode.episode)
    .eq('season', episode.season)
    .order('episode')
    .limit(8)

  const nextEpisodes = (next ?? []) as NextEpisode[]

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="px-8 pt-6 pb-2 flex items-center gap-4">
        <Link
          href={`/titulo/${episode.title_id}`}
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
        <p className="text-[9px] tracking-[4px] text-[#888] uppercase mb-1">
          Temporada {episode.season} · Episódio {episode.episode}
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-2xl italic">
          {episode.name}
        </h1>
        {episode.duration && (
          <p className="text-xs text-white/30 mt-1">{episode.duration}</p>
        )}
      </div>

      {nextEpisodes.length > 0 && (
        <div className="px-8 pb-12">
          <p className="text-[9px] tracking-[4px] text-[#888] uppercase mb-6">
            A seguir
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {nextEpisodes.map(ep => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
