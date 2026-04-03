import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'

 export type Title = {
  id: number
  name: string
  type: string
  cover_url: string | null
  year: number | null
  total_seasons: number | null
  total_episodes: number | null
  featured?: boolean | null
}


export default async function HomePage() {
  const { data } = await supabase
    .from('titles')
    .select('*')
    .order('name')

  const titles = (data ?? []) as Title[]

  const hero = titles[0] ?? null

  return (
    <main style={{ background: '#0b0b0f', color: 'white', minHeight: '100vh' }}>
      
      {/* HERO GRANDE */}
      {hero && (
        <section
          style={{
            position: 'relative',
            height: '80vh',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '80px 60px',
            backgroundImage: `url(${hero.cover_url ?? '/fallback.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* overlay forte */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(to top, #0b0b0f 5%, transparent 60%),
                linear-gradient(to right, rgba(0,0,0,0.85), transparent 60%)
              `,
            }}
          />

          {/* conteúdo */}
          <div style={{ position: 'relative', maxWidth: 500 }}>
            <h1 style={{ fontSize: 48, fontWeight: 700 }}>
              {hero.name}
            </h1>

            <p style={{ color: '#aaa', margin: '10px 0 20px' }}>
              {hero.year ?? ''} • {hero.type}
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                style={{
                  padding: '12px 28px',
                  background: 'white',
                  color: 'black',
                  borderRadius: 6,
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                Assistir
              </button>

              <button
                style={{
                  padding: '12px 28px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 6,
                  border: 'none',
                  color: 'white',
                }}
              >
                Mais informações
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CONTEÚDO */}
      <div style={{ padding: '40px 60px' }}>
        
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>
          Continuar assistindo
        </h2>

        <div
          style={{
            display: 'flex',
            gap: 14,
            overflowX: 'auto',
          }}
        >
          {titles.map(t => (
            <TitleCard key={t.id} title={t} />
          ))}
        </div>

      </div>
    </main>
  )
}