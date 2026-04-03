'use client'
import { useState } from 'react'
import EpisodeCard from './EpisodeCard'

type Episode = { id:number; season:number; episode:number; name:string; duration:string|null; thumbnail_url:string|null; file_id:string; storage:string }

export default function SeasonSelect({ seasons, episodes }: { seasons: number[]; episodes: Episode[] }) {
  const [active, setActive] = useState(seasons[0] ?? 1)
  const filtered = episodes.filter(e => e.season === active)

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:32,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:4,height:24,borderRadius:4,background:'linear-gradient(to bottom,#6366f1,#8b5cf6)',flexShrink:0}} />
          <h2 style={{fontSize:17,fontWeight:600,color:'white'}}>Episodios</h2>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:6,background:'#1a1a24',borderRadius:12,padding:4,border:'1px solid #2a2a3a'}}>
          {seasons.map(s => (
            <button key={s} onClick={() => setActive(s)}
              style={{padding:'8px 16px',borderRadius:9,fontSize:14,fontWeight:500,border:'none',cursor:'pointer',transition:'all 0.2s',fontFamily:'inherit',
                background: active === s ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                color: active === s ? 'white' : '#6b6b80',
                boxShadow: active === s ? '0 2px 12px rgba(99,102,241,0.25)' : 'none',
              }}>
              T{s}
            </button>
          ))}
        </div>

        <span style={{fontSize:13,color:'#6b6b80',background:'#1a1a24',padding:'5px 12px',borderRadius:8,border:'1px solid #2a2a3a'}}>
          {filtered.length} episodios
        </span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:16}}>
        {filtered.map(ep => <EpisodeCard key={ep.id} episode={ep} />)}
      </div>
    </div>
  )
}
