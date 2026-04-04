'use client'

import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

type Title = {
  id: number; name: string; type: string; cover_url: string | null
  year: number | null; total_seasons: number | null; total_episodes: number | null
  description?: string | null; featured?: boolean | null; genres?: string[] | null
}

export default function CatalogoPage() {
  const [titles, setTitles] = useState<Title[]>([])
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.from('titles').select('*').order('name').then(({ data }) => {
      setTitles((data ?? []) as Title[])
      setLoaded(true)
    })
  }, [])

  const featured = titles.filter(t => t.featured)
  const spotlight = (featured.length > 0 ? featured : titles.filter(t => t.cover_url)).slice(0, 8)
  const series = titles.filter(t => t.type === 'series')
  const movies = titles.filter(t => t.type === 'movie')
  const current = spotlight[spotlightIndex]

  const goToNext = useCallback(() => {
    setSpotlightIndex(prev => (prev + 1) % spotlight.length)
  }, [spotlight.length])

  const goToPrev = useCallback(() => {
    setSpotlightIndex(prev => (prev - 1 + spotlight.length) % spotlight.length)
  }, [spotlight.length])

  useEffect(() => {
    if (isHovering || spotlight.length === 0) return
    const interval = setInterval(goToNext, 3000)
    return () => clearInterval(interval)
  }, [isHovering, goToNext, spotlight.length])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', paddingBottom: 64, paddingTop: 64 }}>

      <div style={{ padding: '32px 48px 0' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Catálogo</h1>
        <p style={{ fontSize: 14, color: 'var(--text-faint)' }}>Explore todos os títulos disponíveis</p>
      </div>

      {/* SPOTLIGHT ROTATIVO */}
      {loaded && spotlight.length > 0 && current && (
        <div style={{ marginTop: 32, position: 'relative' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 48px', marginBottom: 16 }}>
            <div style={{ width: 3, height: 20, borderRadius: 3, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)', flexShrink: 0 }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Em destaque</h2>
          </div>

          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <button onClick={goToPrev} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', zIndex: 20, backdropFilter: 'blur(8px)' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={goToNext} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'var(--surface-card)', border: '1px solid var(--surface-border)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)', zIndex: 20, backdropFilter: 'blur(8px)' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>

            <div style={{ display: 'flex', gap: 16, padding: '4px 48px 20px', overflowX: 'auto', scrollbarWidth: 'none' as const, alignItems: 'flex-end' }}>
              {spotlight.map((t, i) => {
                const isActive = i === spotlightIndex
                return (
                  <Link key={t.id} href={`/titulo/${t.id}`} onClick={() => setSpotlightIndex(i)}
                    style={{ flexShrink: 0, width: isActive ? 300 : 220, height: isActive ? 400 : 330, borderRadius: 14, overflow: 'hidden', position: 'relative', display: 'block', textDecoration: 'none', border: isActive ? '2px solid rgba(99,102,241,0.6)' : '1px solid var(--surface-border)', boxShadow: isActive ? '0 16px 48px rgba(99,102,241,0.3)' : '0 8px 24px rgba(0,0,0,0.12)', transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', transform: isActive ? 'scale(1)' : 'scale(0.95)', opacity: isActive ? 1 : 0.65 }}
                  >
                    {t.cover_url
                      ? <img src={t.cover_url} alt={t.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                      : <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-light)' }} />
                    }
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--card-overlay)' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: isActive ? '18px 16px' : '12px 12px' }}>
                      <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#818cf8', marginBottom: 5, textTransform: 'uppercase' as const }}>
                        {t.type === 'series' ? 'SÉRIE' : 'FILME'}{t.year ? ` · ${t.year}` : ''}
                      </span>
                      <p style={{ fontSize: isActive ? 16 : 13, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: isActive ? 8 : 0 }}>{t.name}</p>
                      {isActive && t.description && (
                        <p style={{ fontSize: 11, color: '#bbb', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', marginBottom: 8 }}>
                          {t.description}
                        </p>
                      )}
                      {isActive && t.genres && t.genres.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {t.genres.slice(0, 3).map(g => (
                            <span key={g} style={{ fontSize: 9, color: '#d1d1e0', background: 'rgba(255,255,255,0.1)', padding: '2px 7px', borderRadius: 4 }}>{g}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {!isActive && (
                      <div style={{ position: 'absolute', top: 10, left: 10, width: 24, height: 24, borderRadius: 6, background: 'var(--spotlight-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', backdropFilter: 'blur(4px)' }}>
                        {i + 1}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingBottom: 8 }}>
              {spotlight.map((_, idx) => (
                <button key={idx} onClick={() => setSpotlightIndex(idx)}
                  style={{ height: 3, borderRadius: 3, background: idx === spotlightIndex ? '#818cf8' : 'var(--surface-border)', width: idx === spotlightIndex ? 24 : 12, transition: 'all 0.2s', border: 'none', cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grids */}
      <div style={{ padding: '40px 48px 0' }}>
        {series.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 3, height: 20, borderRadius: 3, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)', flexShrink: 0 }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Séries</h2>
              <span style={{ fontSize: 12, color: 'var(--text-faint)', background: 'var(--surface)', padding: '2px 10px', borderRadius: 20, border: '1px solid var(--surface-border)' }}>{series.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 14 }}>
              {series.map(t => <TitleCard key={t.id} title={t} />)}
            </div>
          </section>
        )}
        {movies.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 3, height: 20, borderRadius: 3, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)', flexShrink: 0 }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Filmes</h2>
              <span style={{ fontSize: 12, color: 'var(--text-faint)', background: 'var(--surface)', padding: '2px 10px', borderRadius: 20, border: '1px solid var(--surface-border)' }}>{movies.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 14 }}>
              {movies.map(t => <TitleCard key={t.id} title={t} />)}
            </div>
          </section>
        )}
        {titles.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: 14, color: 'var(--text-faint)' }}>Nenhum título encontrado.</p>
          </div>
        )}
      </div>
    </main>
  )
}