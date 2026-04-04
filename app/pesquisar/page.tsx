'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'

type Title = {
  id: number; name: string; type: string; cover_url: string | null
  year: number | null; total_seasons: number | null; total_episodes: number | null
  genres?: string[] | null; admin_only?: boolean | null
}

function getIsAdminFromStorage(): boolean {
  try {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}')
    return user?.is_admin === true
  } catch {
    return false
  }
}

function PesquisarContent() {
  const searchParams = useSearchParams()
  const generoParam = searchParams.get('genero')

  const [query, setQuery] = useState('')
  const [allTitles, setAllTitles] = useState<Title[]>([])
  const [isAdmin] = useState<boolean>(getIsAdminFromStorage)
  const [searched, setSearched] = useState(!!generoParam)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(generoParam)

  useEffect(() => {
    supabase.from('titles').select('*').order('name').then(({ data }) => {
      setAllTitles((data ?? []) as Title[])
    })
  }, [])

  const visibleTitles = allTitles.filter(t => isAdmin || !t.admin_only)
  const allGenres = Array.from(new Set(visibleTitles.flatMap(t => t.genres ?? []))).filter(Boolean).sort()

  const results = searched
    ? visibleTitles.filter(t => {
        const matchQuery = query.trim() ? t.name.toLowerCase().includes(query.trim().toLowerCase()) : true
        const matchGenre = selectedGenre ? t.genres?.includes(selectedGenre) : true
        return matchQuery && matchGenre
      })
    : []

  function handleSearch() { setSearched(true) }

  function toggleGenre(genre: string) {
    setSelectedGenre(prev => prev === genre ? null : genre)
    setSearched(true)
  }

  function clearFilters() {
    setQuery('')
    setSelectedGenre(null)
    setSearched(false)
  }

  const hasFilters = query.trim() || selectedGenre

  return (
    <main className="pesquisar-main" style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', paddingTop: 64, paddingBottom: 64 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="pesquisar-title" style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Buscar</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Encontre seus títulos favoritos</p>
      </div>

      <div className="search-bar" style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--text-muted)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Nome do título..." value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ width: '100%', background: 'var(--surface-input)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)', fontSize: 14, padding: '13px 16px 13px 46px', borderRadius: 12, outline: 'none', fontFamily: 'inherit' }} />
        </div>
        <button onClick={handleSearch} className="search-btn" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 600, padding: '0 24px', borderRadius: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 90, fontFamily: 'inherit' }}>
          Buscar
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="clear-btn" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, fontWeight: 500, padding: '0 16px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' as const }}>
            Limpar
          </button>
        )}
      </div>

      {allGenres.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-faint)', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 }}>Filtrar por gênero</p>
          <div className="genres-wrap" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {allGenres.map(genre => {
              const active = selectedGenre === genre
              return (
                <button key={genre} onClick={() => toggleGenre(genre)}
                  style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'white' : 'var(--text-secondary)', background: active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--surface)', border: active ? '1px solid transparent' : '1px solid var(--surface-border)', padding: '7px 16px', borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit', boxShadow: active ? '0 4px 16px rgba(99,102,241,0.25)' : 'none', transition: 'all 0.2s' }}>
                  {genre}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {searched && results.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ width: 4, height: 24, borderRadius: 4, background: 'linear-gradient(to bottom,#6366f1,#8b5cf6)', flexShrink: 0 }} />
            <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>{selectedGenre ?? 'Resultados'}</h2>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', background: 'var(--surface)', padding: '3px 12px', borderRadius: 8, border: '1px solid var(--surface-border)' }}>
              {results.length} título{results.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="results-grid" style={{ display: 'grid', gap: 16 }}>
            {results.map(t => <TitleCard key={t.id} title={t} />)}
          </div>
        </div>
      )}

      {searched && results.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#6b6b80"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
            Nenhum resultado{query && <> para &quot;{query}&quot;</>}{selectedGenre && <> em &quot;{selectedGenre}&quot;</>}
          </p>
        </div>
      )}

      {!searched && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg,rgba(99,102,241,0.18),rgba(139,92,246,0.18))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#6366f1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>Digite um nome ou selecione um gênero</p>
        </div>
      )}

      <style>{`
        .pesquisar-main {
          padding-left: 40px;
          padding-right: 40px;
        }
        .search-bar {
          max-width: 640px;
        }
        .results-grid {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }

        @media (max-width: 768px) {
          .pesquisar-main {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .pesquisar-title {
            font-size: 24px !important;
          }
          .search-bar {
            flex-wrap: wrap;
            max-width: none;
          }
          .search-bar > div:first-child {
            flex: 1 1 100%;
            min-width: 0;
          }
          .search-btn {
            flex: 1;
          }
          .clear-btn {
            flex: 0 0 auto;
          }
          .genres-wrap {
            gap: 6px !important;
          }
          .genres-wrap button {
            font-size: 12px !important;
            padding: 6px 12px !important;
          }
          .results-grid {
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)) !important;
            gap: 10px !important;
          }
        }

        @media (max-width: 480px) {
          .results-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
          }
        }
      `}</style>
    </main>
  )
}

export default function PesquisarPage() {
  return (
    <Suspense>
      <PesquisarContent />
    </Suspense>
  )
}
