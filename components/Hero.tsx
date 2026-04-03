import Link from 'next/link'

type Title = { id:number; name:string; description:string|null; cover_url:string|null; type:string; total_seasons:number|null; total_episodes:number|null; year:number|null }

export default function Hero({ titles }: { titles: Title[] }) {
  const featured = titles[0]
  if (!featured) return (
    <div style={{height:560,display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 40px 0'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:72,height:72,margin:'0 auto 20px',borderRadius:16,background:'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#6366f1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
        </div>
        <h1 style={{fontSize:28,fontWeight:700,marginBottom:10,background:'linear-gradient(135deg,#818cf8,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Velum</h1>
        <p style={{fontSize:14,color:'#6b6b80'}}>Nenhum titulo cadastrado ainda.</p>
      </div>
    </div>
  )
  return (
    <div style={{position:'relative',height:600,display:'flex',alignItems:'flex-end',padding:'0 40px 64px',overflow:'hidden'}}>
      {featured.cover_url && <img src={featured.cover_url} alt={featured.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:0.38}} />}
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,#08080c,rgba(8,8,12,0.88),transparent)'}} />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,#08080c,rgba(8,8,12,0.5),transparent)'}} />
      <div style={{position:'relative',zIndex:10,maxWidth:600}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:999,background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.22)',marginBottom:18}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#6366f1',display:'inline-block'}} />
          <span style={{fontSize:12,fontWeight:500,color:'#818cf8'}}>
            {featured.type==='series' ? `Serie - ${featured.total_seasons} temporadas` : `Filme - ${featured.year}`}
          </span>
        </div>
        <h1 style={{fontSize:44,fontWeight:700,color:'white',lineHeight:1.15,marginBottom:16}}>{featured.name}</h1>
        {featured.description && <p style={{fontSize:15,color:'#a1a1b5',lineHeight:1.65,marginBottom:28,maxWidth:520}}>{featured.description}</p>}
        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
          <Link href={`/titulo/${featured.id}`} style={{display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontSize:14,fontWeight:600,padding:'12px 24px',borderRadius:12,textDecoration:'none',boxShadow:'0 4px 20px rgba(99,102,241,0.28)'}}>
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Assistir agora
          </Link>
          <Link href="/catalogo" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.1)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.12)',color:'white',fontSize:14,fontWeight:600,padding:'12px 24px',borderRadius:12,textDecoration:'none'}}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Explorar catalogo
          </Link>
        </div>
      </div>
    </div>
  )
}
