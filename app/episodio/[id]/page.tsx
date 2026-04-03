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
    <main className="min-h-screen bg-[#08080c] text-white">
      {/* Breadcrumb */}
      <div className="px-6 lg:px-10 pt-20 pb-4 flex items-center gap-3">
        <Link
          href={`/titulo/${episode.title_id}`}
          className="flex items-center gap-2 text-sm text-[#6b6b80] hover:text-[#818cf8] transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <span className="text-[#2a2a3a]">/</span>
        <span className="text-sm text-[#a1a1b5]">
          {episode.titles?.name}
        </span>
      </div>

      {/* Player */}
      <div className="px-6 lg:px-10 pb-6">
        <DrivePlayer fileId={episode.file_id} storage={episode.storage} />
      </div>

      {/* Episode Info */}
      <div className="px-6 lg:px-10 pb-8">
        <div className="glass rounded-2xl p-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/20 mb-3">
            <span className="text-xs font-medium text-[#818cf8]">
              Temporada {episode.season} - Episodio {episode.episode}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {episode.name}
          </h1>
          {episode.duration && (
            <p className="text-sm text-[#6b6b80] flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {episode.duration}
            </p>
          )}
        </div>
      </div>

      {/* Next Episodes */}
      {nextEpisodes.length > 0 && (
        <div className="px-6 lg:px-10 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]" />
            <h2 className="text-lg font-semibold text-white">A seguir</h2>
          </div>
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
