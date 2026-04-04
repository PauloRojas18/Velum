import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import DrivePlayer from '@/components/DrivePlayer'
import EpisodeCard from '@/components/EpisodeCard'
import Link from 'next/link'

type Episode = {
  id: number; season: number; episode: number; name: string
  duration: string | null; thumbnail_url: string | null
  file_id: string; storage: string; title_id: number
  titles: { id: number; name: string } | null
}

type NextEpisode = {
  id: number; season: number; episode: number; name: string
  duration: string | null; thumbnail_url: string | null
}

export default async function EpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: episode } = await supabase
    .from('episodes').select('*, titles(*)').eq('id', id).single<Episode>()

  if (!episode) notFound()

  const { data: next } = await supabase
    .from('episodes').select('*')
    .eq('title_id', episode.title_id)
    .gt('episode', episode.episode)
    .eq('season', episode.season)
    .order('episode').limit(8)

  const nextEpisodes = (next ?? []) as NextEpisode[]

  return (
    <main style={{minHeight:'100vh',background:'var(--bg)',color:'var(--text-primary)',paddingBottom:60}}>
      {/* Breadcrumb */}
      <div style={{padding:'80px 40px 16px',display:'flex',alignItems:'center',gap:8}}>
        <Link href={`/titulo/${episode.title_id}`} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'var(--text-muted)',textDecoration:'none',transition:'color 0.2s'}}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          {episode.titles?.name ?? 'Voltar'}
        </Link>
        <span style={{color:'var(--surface-border)',fontSize:13}}>/</span>
        <span style={{fontSize:13,color:'var(--text-muted)'}}>T{episode.season} E{episode.episode}</span>
      </div>

      {/* Player */}
      <div style={{padding:'0 40px 24px'}}>
        <DrivePlayer fileId={episode.file_id} storage={episode.storage} />
      </div>

      {/* Episode info */}
      <div style={{padding:'0 40px 32px'}}>
        <div style={{
          background:'var(--surface-card)',backdropFilter:'blur(12px)',
          border:'1px solid var(--border-card)',borderRadius:14,padding:24,
        }}>
          <span style={{
            display:'inline-flex',alignItems:'center',
            fontSize:11,fontWeight:600,color:'#818cf8',
            background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',
            padding:'4px 12px',borderRadius:20,marginBottom:12,
          }}>
            Temporada {episode.season} · Episódio {episode.episode}
          </span>
          <h1 style={{fontSize:22,fontWeight:700,color:'var(--text-primary)',marginBottom:8}}>{episode.name}</h1>
          {episode.duration && (
            <div style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'var(--text-muted)'}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {episode.duration}
            </div>
          )}
        </div>
      </div>

      {/* Next episodes */}
      {nextEpisodes.length > 0 && (
        <div style={{padding:'0 40px'}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <div style={{width:3,height:22,borderRadius:4,background:'linear-gradient(to bottom,#6366f1,#8b5cf6)',flexShrink:0}} />
            <h2 style={{fontSize:16,fontWeight:700,color:'var(--text-primary)'}}>A seguir</h2>
          </div>
          <div style={{display:'flex',gap:14,overflowX:'auto',paddingBottom:16,scrollbarWidth:'none' as const}}>
            {nextEpisodes.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
          </div>
        </div>
      )}
    </main>
  )
}