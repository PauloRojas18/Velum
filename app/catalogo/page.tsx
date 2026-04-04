'use client'

import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

type Title = {
  id: number; name: string; type: string; cover_url: string | null
  year: number | null; total_seasons: number | null; total_episodes: number | null
  featured?: boolean | null; description?: string | null; genres?: string[] | null
  admin_only?: boolean | null
  created_at?: string
}

function Row({ label, titles, href, showRank = false }: { 
  label: string; 
  titles: Title[]; 
  href?: string;
  showRank?: boolean;
}) {
  return (
    <div style={{ marginBottom: 8, paddingTop: 32 }}>
      <div className="row-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 18, borderRadius: 3, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)', flexShrink: 0 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</h2>
        </div>
        <Link href={href ?? '/catalogo'} style={{ fontSize: 12, color: 'var(--text-faint)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Ver tudo <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </Link>
      </div>
      <div className="row-scroll" style={{ display: 'flex', gap: showRank ? 14 : 10, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' as const }}>
        {titles.map((title, idx) => (
          <div key={title.id} className={showRank ? 'row-card-rank' : 'row-card'} style={{ flexShrink: 0 }}>
            {showRank ? (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', width: 152, paddingLeft: 36 }}>
                <span style={{
                  position: 'absolute',
                  left: -15,
                  bottom: 25,
                  fontSize: 100,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: 'transparent',
                  WebkitTextStroke: '2px rgba(255,255,255,0.15)',
                  lineHeight: 1,
                  userSelect: 'none',
                  zIndex: 0,
                  letterSpacing: -6,
                }}>
                  {idx + 1}
                </span>
                <div style={{ position: 'relative', zIndex: 1, width: 116 }}>
                  <TitleCard title={title} />
                </div>
              </div>
            ) : (
              <TitleCard title={title} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CatalogoPage() {
  const [titles, setTitles] = useState<Title[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}')
      setIsAdmin(user?.is_admin === true)
    } catch {}

    supabase.from('titles').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setTitles((data ?? []) as Title[])
    })
  }, [])

  const visibleTitles = titles.filter(t => isAdmin || !t.admin_only)

  const featuredTitles = visibleTitles.filter(t => t.cover_url).slice(0, 5)
  const current = featuredTitles[currentHeroIndex]

  const goToNext = useCallback(() => {
    setCurrentHeroIndex((prev) => (prev + 1) % featuredTitles.length)
  }, [featuredTitles.length])

  const goToPrev = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + featuredTitles.length) % featuredTitles.length)
  }

  useEffect(() => {
    if (isHovering || featuredTitles.length === 0) return
    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [isHovering, goToNext, featuredTitles.length])

  const series = visibleTitles.filter(t => t.type === 'series')
  const movies = visibleTitles.filter(t => t.type === 'movie')
  const recent = [...visibleTitles].sort((a,b) => (b.year || 0) - (a.year || 0)).slice(0, 10)
  const recommended = visibleTitles.filter(t => t.featured).length > 0 ? visibleTitles.filter(t => t.featured) : visibleTitles.slice(0, 8)

  const genreMap = new Map<string, Title[]>()
  visibleTitles.forEach(title => {
    title.genres?.forEach(genre => {
      if (!genreMap.has(genre)) genreMap.set(genre, [])
      genreMap.get(genre)!.push(title)
    })
  })
  const genreRows = Array.from(genreMap.entries())
    .sort((a,b) => b[1].length - a[1].length)
    .slice(0, 4)
    .map(([genre, items]) => ({ genre, titles: items.slice(0, 10) }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {featuredTitles.length > 0 && current && (
        <section
          className="hero-section"
          style={{ position: 'relative', overflow: 'hidden' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div style={{ position: 'absolute', inset: 0 }}>
            {current.cover_url && (
              <img src={current.cover_url} alt={current.name}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'var(--hero-grad-bottom)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'var(--hero-grad-side)' }} />
          </div>

          <button onClick={goToPrev} className="hero-nav-btn hero-nav-prev" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: 999, padding: 8, cursor: 'pointer', color: 'white', zIndex: 20 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={goToNext} className="hero-nav-btn hero-nav-next" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: 999, padding: 8, cursor: 'pointer', color: 'white', zIndex: 20 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>

          <div className="hero-dots" style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 20 }}>
            {featuredTitles.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentHeroIndex(idx)}
                style={{ height: 4, borderRadius: 4, background: idx === currentHeroIndex ? '#818cf8' : 'rgba(255,255,255,0.4)', width: idx === currentHeroIndex ? 32 : 16, transition: 'all 0.2s', border: 'none', cursor: 'pointer' }} />
            ))}
          </div>

          <div className="hero-content" style={{ position: 'absolute', bottom: 80, zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: '#818cf8', textTransform: 'uppercase' }}>
                {current.type === 'series' ? 'Série' : 'Filme'}{current.year ? ` · ${current.year}` : ''}
              </span>
            </div>
            <h1 className="hero-title" style={{ fontWeight: 900, lineHeight: 1.02, marginBottom: 14, letterSpacing: -1.5, color: 'white', textShadow: '0 2px 24px rgba(0,0,0,0.7)' }}>
              {current.name}
            </h1>
            {current.type === 'series' && current.total_seasons && (
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 10 }}>
                {current.total_seasons} temporada{current.total_seasons > 1 ? 's' : ''}
              </p>
            )}
            {current.description && (
              <p className="hero-description" style={{ fontSize: 14, color: '#bbb', lineHeight: 1.7, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {current.description}
              </p>
            )}
            {current.genres && current.genres.length > 0 && (
              <div className="hero-genres" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {current.genres.map(g => (
                  <Link key={g} href={`/pesquisar?genero=${encodeURIComponent(g)}`}
                    style={{ fontSize: 11, fontWeight: 500, color: '#d1d1e0', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)', padding: '4px 10px', borderRadius: 6, textDecoration: 'none', backdropFilter: 'blur(4px)' }}>
                    {g}
                  </Link>
                ))}
              </div>
            )}
            <div className="hero-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/titulo/${current.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'white', color: '#08080c', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                <svg width="16" height="16" fill="#08080c" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Assistir
              </Link>
              <Link href={`/titulo/${current.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/></svg>
                Mais detalhes
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="rows-container" style={{ paddingBottom: 64, marginTop: featuredTitles.length ? -36 : 80, position: 'relative', zIndex: 2 }}>
        {visibleTitles.length > 0 && <Row label="Em Alta" titles={visibleTitles.slice(0, 10)} />}
        {visibleTitles.length > 0 && <Row label="Top 10 no Brasil" titles={visibleTitles.slice(0, 10)} showRank />}
        <Row label="Lançamentos" titles={recent} />
        <Row label="Recomendados para Você" titles={recommended} />
        {series.length > 0 && <Row label="Séries" titles={series} />}
        {movies.length > 0 && <Row label="Filmes" titles={movies} />}
        {genreRows.map(({ genre, titles: gt }) => (
          <Row key={genre} label={genre} titles={gt} href={`/pesquisar?genero=${encodeURIComponent(genre)}`} />
        ))}
        {visibleTitles.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
            <p style={{ fontSize: 15, color: 'var(--text-faint)' }}>Nenhum título cadastrado</p>
          </div>
        )}
      </div>

      <style>{`
        .hero-section {
          height: 85vh;
          min-height: 500px;
        }
        .hero-content {
          left: 52px;
          max-width: 500px;
        }
        .hero-title {
          font-size: 54px;
        }
        .hero-description {
          max-width: 420px;
        }
        .row-header {
          padding: 0 48px;
        }
        .row-scroll {
          padding-left: 48px;
          padding-right: 48px;
        }
        .row-card {
          width: 152px;
        }
        .row-card-rank {
          width: 152px;
        }

        @media (max-width: 768px) {
          .hero-section {
            height: 70vh;
            min-height: 400px;
          }
          .hero-content {
            left: 20px;
            right: 20px;
            max-width: none;
            bottom: 60px;
          }
          .hero-title {
            font-size: 28px;
            letter-spacing: -0.5px;
          }
          .hero-description {
            font-size: 13px;
            max-width: none;
            -webkit-line-clamp: 2;
          }
          .hero-genres {
            display: none !important;
          }
          .hero-buttons {
            flex-direction: column;
            gap: 8px;
          }
          .hero-buttons a {
            width: 100%;
            justify-content: center;
            padding: 10px 20px !important;
            font-size: 14px !important;
          }
          .hero-nav-btn {
            display: none !important;
          }
          .hero-dots {
            bottom: 12px !important;
          }
          .row-header {
            padding: 0 16px !important;
          }
          .row-scroll {
            padding-left: 16px !important;
            padding-right: 16px !important;
            gap: 8px !important;
          }
          .row-card {
            width: 120px !important;
          }
          .row-card-rank {
            width: 170px !important;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            height: 60vh;
            min-height: 350px;
          }
          .hero-title {
            font-size: 24px;
          }
          .row-card {
            width: 110px !important;
          }
          .row-card-rank {
            width: 170px !important;
          }
        }
      `}</style>
    </div>
  )
}