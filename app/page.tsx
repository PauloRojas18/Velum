'use client'

import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

type Title = {
  id: number; name: string; type: string; cover_url: string | null
  year: number | null; total_seasons: number | null; total_episodes: number | null
  featured?: boolean | null; description?: string | null; genres?: string[] | null
}

function Row({ label, titles, href }: { label: string; titles: Title[]; href?: string }) {
  return (
    <div style={{ marginBottom: 8, paddingTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 18, borderRadius: 3, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)', flexShrink: 0 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</h2>
        </div>
        <Link href={href ?? '/catalogo'} style={{ fontSize: 12, color: 'var(--text-faint)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          Ver tudo <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </Link>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 48px 12px', scrollbarWidth: 'none' as const }}>
        {titles.map(t => (
          <div key={t.id} style={{ flexShrink: 0, width: 152 }}>
            <TitleCard title={t} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [titles, setTitles] = useState<Title[]>([])
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    supabase.from('titles').select('*').order('name').then(({ data }) => {
      setTitles((data ?? []) as Title[])
    })
  }, [])

  const featuredTitles = titles.filter(t => t.cover_url).slice(0, 5)
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

  const series = titles.filter(t => t.type === 'series')
  const movies = titles.filter(t => t.type === 'movie')

  const allGenres = Array.from(new Set(titles.flatMap(t => t.genres ?? []))).filter(Boolean).sort()
  const genreRows = allGenres
    .map(genre => ({ genre, titles: titles.filter(t => t.genres?.includes(genre)) }))
    .filter(g => g.titles.length >= 2)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)' }}>
      {/* HERO */}
      {featuredTitles.length > 0 && current && (
        <section
          style={{ position: 'relative', height: '85vh', minHeight: 500, overflow: 'hidden' }}
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

          <button onClick={goToPrev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: 999, padding: 8, cursor: 'pointer', color: 'white', zIndex: 20 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={goToNext} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: 999, padding: 8, cursor: 'pointer', color: 'white', zIndex: 20 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>

          <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 20 }}>
            {featuredTitles.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentHeroIndex(idx)}
                style={{ height: 4, borderRadius: 4, background: idx === currentHeroIndex ? '#818cf8' : 'rgba(255,255,255,0.4)', width: idx === currentHeroIndex ? 32 : 16, transition: 'all 0.2s', border: 'none', cursor: 'pointer' }} />
            ))}
          </div>

          <div style={{ position: 'absolute', bottom: 80, left: 52, maxWidth: 500, zIndex: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: '#818cf8', textTransform: 'uppercase' }}>
                {current.type === 'series' ? 'Série' : 'Filme'}{current.year ? ` · ${current.year}` : ''}
              </span>
            </div>
            <h1 style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.02, marginBottom: 14, letterSpacing: -1.5, color: 'white', textShadow: '0 2px 24px rgba(0,0,0,0.7)' }}>
              {current.name}
            </h1>
            {current.type === 'series' && current.total_seasons && (
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 10 }}>
                {current.total_seasons} temporada{current.total_seasons > 1 ? 's' : ''}
              </p>
            )}
            {current.description && (
              <p style={{ fontSize: 14, color: '#bbb', lineHeight: 1.7, marginBottom: 20, maxWidth: 420, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {current.description}
              </p>
            )}
            {current.genres && current.genres.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {current.genres.map(g => (
                  <Link key={g} href={`/pesquisar?genero=${encodeURIComponent(g)}`}
                    style={{ fontSize: 11, fontWeight: 500, color: '#d1d1e0', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)', padding: '4px 10px', borderRadius: 6, textDecoration: 'none', backdropFilter: 'blur(4px)' }}>
                    {g}
                  </Link>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
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

      {/* ROWS */}
      <div style={{ paddingBottom: 64, marginTop: featuredTitles.length ? -36 : 80, position: 'relative', zIndex: 2 }}>
        {titles.length > 0 && <Row label="Novidades" titles={titles.slice(0, 10)} />}
        {series.length > 0 && <Row label="Séries" titles={series} />}
        {movies.length > 0 && <Row label="Filmes" titles={movies} />}
        {genreRows.map(({ genre, titles: gt }) => (
          <Row key={genre} label={genre} titles={gt} href={`/pesquisar?genero=${encodeURIComponent(genre)}`} />
        ))}
        {titles.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
            <p style={{ fontSize: 15, color: 'var(--text-faint)' }}>Nenhum título cadastrado</p>
          </div>
        )}
      </div>
    </div>
  )
}