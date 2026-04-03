import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import TitleCard from '@/components/TitleCard'
import SeasonSelect from '@/components/SeasonSelect'
import Link from 'next/link'

type Title = { id:number; name:string; description:string|null; cover_url:string|null; type:string; total_seasons:number|null; total_episodes:number|null; year:number|null; genres:string[]|null }
type Episode = { id:number; season:number; episode:number; name:string; duration:string|null; thumbnail_url:string|null; file_id:string; storage:string; title_id:number }
type SimilarTitle = { id:number; name:string; type:string; cover_url:string|null; year:number|null; total_seasons:number|null; total_episodes:number|null }

export default async function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: title } = await supabase.from('titles').select('*').eq('id', id).single<Title>()
  if (!title) notFound()

  const { data: episodes } = await supabase.from('episodes').select('*').eq('title_id', title.id).order('season').order('episode')
  const { data: similar } = await supabase.from('titles').select('*').eq('type', title.type).neq('id', title.id).limit(8)

  const typedEpisodes = (episodes ?? []) as Episode[]
  const typedSimilar = (similar ?? []) as SimilarTitle[]
  const seasons = [...new Set(typedEpisodes.map(e => e.season))].sort((a, b) => a - b)
  const firstEpisode = typedEpisodes[0]

  return (
    <main style={{minHeight:'100vh',background:'#08080c',color:'white'}}>
      {/* Hero */}
      <div style={{position:'relative',height:520,display:'flex',alignItems:'flex-end',padding:'80px 40px 48px',overflow:'hidden'}}>
        {title.cover_url && (
          <img src={title.cover_url} alt={title.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.38}} />
        )}
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,#08080c,rgba(8,8,12,0.88),transparent)'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,#08080c,rgba(8,8,12,0.55),transparent)'}} />

        <div style={{position:'relative',zIndex:10,maxWidth:700}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:999,background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.22)',marginBottom:18}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#6366f1',display:'inline-block',flexShrink:0}} />
            <span style={{fontSize:12,fontWeight:500,color:'#818cf8'}}>
              {title.type === 'series'
                ? `Serie - ${title.total_seasons} temporadas - ${title.total_episodes} episodios`
                : `Filme - ${title.year}`}
            </span>
          </div>

          <h1 style={{fontSize:42,fontWeight:700,color:'white',lineHeight:1.15,marginBottom:16}}>{title.name}</h1>

          {title.description && (
            <p style={{fontSize:15,color:'#a1a1b5',lineHeight:1.65,marginBottom:20,maxWidth:600}}>{title.description}</p>
          )}

          {title.genres && title.genres.length > 0 && (
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
              {title.genres.map(g => (
                <span key={g} style={{fontSize:12,fontWeight:500,color:'#a1a1b5',background:'#1a1a24',border:'1px solid #2a2a3a',padding:'5px 12px',borderRadius:8}}>
                  {g}
                </span>
              ))}
            </div>
          )}

          {firstEpisode && (
            <Link href={`/episodio/${firstEpisode.id}`} style={{display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:14,fontWeight:600,padding:'12px 24px',borderRadius:12,textDecoration:'none',boxShadow:'0 4px 20px rgba(99,102,241,0.3)'}}>
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Assistir agora
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{padding:'40px 40px 64px'}}>
        {title.type === 'series' && typedEpisodes.length > 0 && (
          <SeasonSelect seasons={seasons} episodes={typedEpisodes} />
        )}

        {title.type === 'movie' && typedSimilar.length > 0 && (
          <div>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
              <div style={{width:4,height:24,borderRadius:4,background:'linear-gradient(to bottom,#6366f1,#8b5cf6)',flexShrink:0}} />
              <h2 style={{fontSize:17,fontWeight:600,color:'white'}}>Titulos semelhantes</h2>
            </div>
            <div style={{display:'flex',gap:16,overflowX:'auto',paddingBottom:16}}>
              {typedSimilar.map(t => (
                <div key={t.id} style={{flexShrink:0,width:160}}>
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
