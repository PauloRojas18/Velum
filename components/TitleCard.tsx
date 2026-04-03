'use client'
import { useState } from 'react'
import Link from 'next/link'

type Title = { id:number; name:string; type:string; cover_url:string|null; year:number|null; total_seasons:number|null; total_episodes:number|null }

export default function TitleCard({ title }: { title: Title }) {
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/titulo/${title.id}`} style={{display:'block',textDecoration:'none'}}>
      <div
        onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
        style={{width:'100%',aspectRatio:'2/3',background:'#1a1a24',borderRadius:12,overflow:'hidden',position:'relative',border:'1px solid #2a2a3a',transition:'transform 0.3s,box-shadow 0.3s',transform:hovered?'translateY(-4px)':'none',boxShadow:hovered?'0 12px 40px rgba(99,102,241,0.18)':'none'}}
      >
        {title.cover_url && !imgError ? (
          <img src={title.cover_url} alt="" onError={()=>setImgError(true)} style={{width:'100%',height:'100%',objectFit:'cover',opacity:hovered?1:0.9,transform:hovered?'scale(1.05)':'scale(1)',transition:'all 0.5s'}} />
        ) : (
          <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))',fontSize:15,fontWeight:700,color:'rgba(99,102,241,0.5)',textAlign:'center',lineHeight:1.3}}>
            {title.name}
          </div>
        )}
        {hovered && <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,#08080c,transparent)',pointerEvents:'none'}} />}
        {hovered && (
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:44,height:44,borderRadius:'50%',background:'#6366f1',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 20px rgba(99,102,241,0.4)'}}>
              <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}
        <div style={{position:'absolute',top:8,right:8,padding:'3px 8px',borderRadius:6,background:'rgba(8,8,12,0.82)',backdropFilter:'blur(6px)',border:'1px solid rgba(255,255,255,0.1)',fontSize:10,fontWeight:500,color:'#a1a1b5'}}>
          {title.type === 'series' ? 'Serie' : 'Filme'}
        </div>
      </div>
      <div style={{marginTop:12}}>
        <p style={{fontSize:14,fontWeight:500,color:'white',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title.name}</p>
        <p style={{fontSize:12,color:'#6b6b80',marginTop:4}}>
          {title.type==='series' ? `${title.total_seasons} temporadas` : `Filme - ${title.year}`}
        </p>
      </div>
    </Link>
  )
}
