import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'

type Title = { id:number; name:string; type:string; cover_url:string|null; year:number|null; total_seasons:number|null; total_episodes:number|null }

export default async function CatalogoPage() {
  const { data } = await supabase.from('titles').select('*').order('name')
  const titles = (data ?? []) as Title[]
  const series = titles.filter(t=>t.type==='series')
  const movies = titles.filter(t=>t.type==='movie')

  const SectionHeader = ({ label, count }: { label: string; count: number }) => (
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
      <div style={{width:4,height:24,borderRadius:4,background:'linear-gradient(to bottom,#6366f1,#8b5cf6)',flexShrink:0}} />
      <h2 style={{fontSize:17,fontWeight:600,color:'white'}}>{label}</h2>
      <span style={{fontSize:13,color:'#6b6b80',background:'#1a1a24',padding:'3px 12px',borderRadius:8,border:'1px solid #2a2a3a'}}>{count} titulos</span>
    </div>
  )

  const Grid = ({ children }: { children: React.ReactNode }) => (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:16}}>{children}</div>
  )

  return (
    <main style={{minHeight:'100vh',background:'#08080c',color:'white',paddingTop:88,paddingBottom:64,paddingLeft:40,paddingRight:40}}>
      <div style={{marginBottom:40}}>
        <h1 style={{fontSize:30,fontWeight:700,color:'white',marginBottom:6}}>Catalogo</h1>
        <p style={{fontSize:14,color:'#6b6b80'}}>Explore todos os titulos disponiveis</p>
      </div>
      {series.length > 0 && (
        <section style={{marginBottom:48}}>
          <SectionHeader label="Series" count={series.length} />
          <Grid>{series.map(t=><TitleCard key={t.id} title={t} />)}</Grid>
        </section>
      )}
      {movies.length > 0 && (
        <section style={{marginBottom:48}}>
          <SectionHeader label="Filmes" count={movies.length} />
          <Grid>{movies.map(t=><TitleCard key={t.id} title={t} />)}</Grid>
        </section>
      )}
      {titles.length === 0 && (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'80px 20px'}}>
          <div style={{width:72,height:72,borderRadius:16,background:'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:20}}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#6366f1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
          </div>
          <p style={{fontSize:14,color:'#6b6b80'}}>Nenhum titulo encontrado.</p>
        </div>
      )}
    </main>
  )
}
