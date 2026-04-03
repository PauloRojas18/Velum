import Link from 'next/link'

type Episode = { id:number; season:number; episode:number; name:string; duration:string|null; thumbnail_url:string|null }

export default function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link href={`/episodio/${episode.id}`} style={{display:'block',flexShrink:0,width:200,textDecoration:'none'}} className="group">
      <div style={{width:'100%',height:112,background:'#1a1a24',borderRadius:12,overflow:'hidden',position:'relative',border:'1px solid #2a2a3a',transition:'transform 0.3s,box-shadow 0.3s'}} className="episode-thumb-wrap">
        {episode.thumbnail_url ? (
          <img src={episode.thumbnail_url} alt={episode.name} style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.82,transition:'all 0.5s'}} />
        ) : (
          <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))',fontSize:28,fontWeight:700,color:'rgba(99,102,241,0.3)'}}>
            {episode.episode}
          </div>
        )}
        <div style={{position:'absolute',top:8,left:8,padding:'3px 7px',borderRadius:6,background:'rgba(99,102,241,0.9)',fontSize:10,fontWeight:600,color:'white'}}>
          EP {episode.episode}
        </div>
        {episode.duration && (
          <div style={{position:'absolute',bottom:8,right:8,padding:'3px 7px',borderRadius:6,background:'rgba(8,8,12,0.82)',backdropFilter:'blur(6px)',fontSize:10,fontWeight:500,color:'#a1a1b5'}}>
            {episode.duration}
          </div>
        )}
      </div>
      <div style={{marginTop:10}}>
        <p style={{fontSize:14,fontWeight:500,color:'white',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{episode.name}</p>
        <p style={{fontSize:12,color:'#6b6b80',marginTop:3}}>Temporada {episode.season}</p>
      </div>
    </Link>
  )
}
