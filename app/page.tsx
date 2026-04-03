import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Title = {
  id: number
  name: string
  description: string | null
  cover_url: string | null
  type: string
  total_seasons: number | null
  total_episodes: number | null
  year: number | null
  genres: string[] | null
  views?: number
}

export default async function HomePage() {
  // 1. Buscar os mais assistidos (usa 'views' se existir, senão ordena por id)
  const { data: mostWatched } = await supabase
    .from('titles')
    .select('*')
    .order('views', { ascending: false, nullsLast: true })
    .limit(10)

  const titles = (mostWatched ?? []) as Title[]

  // 2. Buscar título em destaque (featured) com fallback para o primeiro da lista
  let featured: Title | null = null
  try {
    const { data } = await supabase
      .from('titles')
      .select('*')
      .eq('featured', true)
      .single()
    featured = data
  } catch {
    // Se não houver 'featured' ou der erro, usa o primeiro da lista de mais assistidos
    featured = titles[0] || null
  }

  const hero = featured

  // ---------- Estilos inline ----------
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#08080c',
    color: 'white',
  }

  const heroContainerStyle: React.CSSProperties = {
    position: 'relative',
    height: '560px',
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0 40px 60px 40px',
    overflow: 'hidden',
  }

  const heroBgStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.35,
  }

  const heroOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, #08080c 0%, rgba(8,8,12,0.8) 50%, transparent 100%)',
  }

  const heroBottomOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(0deg, #08080c 0%, rgba(8,8,12,0.6) 50%, transparent 100%)',
  }

  const heroContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    maxWidth: '600px',
  }

  const heroBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    background: 'rgba(99,102,241,0.15)',
    backdropFilter: 'blur(4px)',
    borderRadius: '30px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#a5b4fc',
    marginBottom: '20px',
    border: '1px solid rgba(99,102,241,0.3)',
  }

  const heroTitleStyle: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 700,
    marginBottom: '16px',
    lineHeight: 1.2,
  }

  const heroDescStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#cbd5e1',
    marginBottom: '24px',
    lineHeight: 1.5,
  }

  const heroButtonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    padding: '12px 28px',
    borderRadius: '40px',
    fontWeight: 600,
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }

  const sectionStyle: React.CSSProperties = {
    padding: '40px',
  }

  const sectionHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  }

  const sectionLineStyle: React.CSSProperties = {
    width: '4px',
    height: '28px',
    borderRadius: '4px',
    background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: 'white',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '24px',
  }

  const largeCardStyle: React.CSSProperties = {
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#111114',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  }

  const largeCardImageStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
  }

  const largeCardInfoStyle: React.CSSProperties = {
    padding: '12px',
  }

  const largeCardTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '4px',
  }

  const largeCardMetaStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#8b8ba0',
  }

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#6b6b80',
  }

  return (
    <main style={pageStyle}>
      {/* Hero / Destaque Principal */}
      {hero && (
        <div style={heroContainerStyle}>
          {hero.cover_url && (
            <img src={hero.cover_url} alt={hero.name} style={heroBgStyle} />
          )}
          <div style={heroOverlayStyle} />
          <div style={heroBottomOverlayStyle} />

          <div style={heroContentStyle}>
            <div style={heroBadgeStyle}>
              {hero.type === 'series' ? '📺 Série em destaque' : '🎬 Filme em destaque'}
            </div>
            <h1 style={heroTitleStyle}>{hero.name}</h1>
            {hero.description && (
              <p style={heroDescStyle}>
                {hero.description.length > 140
                  ? `${hero.description.substring(0, 140)}...`
                  : hero.description}
              </p>
            )}
            <Link href={`/titulo/${hero.id}`} style={heroButtonStyle}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Assistir agora
            </Link>
          </div>
        </div>
      )}

      {/* Seção: Mais assistidos */}
      {titles.length > 0 ? (
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionLineStyle} />
            <h2 style={sectionTitleStyle}>🔥 Mais assistidos da semana</h2>
          </div>
          <div style={gridStyle}>
            {titles.map((title) => (
              <Link
                key={title.id}
                href={`/titulo/${title.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={largeCardStyle}>
                  {title.cover_url && (
                    <img
                      src={title.cover_url}
                      alt={title.name}
                      style={largeCardImageStyle}
                    />
                  )}
                  <div style={largeCardInfoStyle}>
                    <div style={largeCardTitleStyle}>{title.name}</div>
                    <div style={largeCardMetaStyle}>
                      {title.type === 'series'
                        ? `${title.total_seasons || 0} temporadas`
                        : title.year || 'Ano desconhecido'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <p>Nenhum título encontrado. Adicione conteúdo ao seu banco de dados.</p>
        </div>
      )}
    </main>
  )
}