'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'

type Title = {
  id: number
  name: string
  type: string
  cover_url: string | null
  year: number | null
  total_seasons: number | null
  total_episodes: number | null
}

export default function PesquisarPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Title[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    const { data } = await supabase
      .from('titles')
      .select('*')
      .ilike('name', `%${query}%`)
    setResults((data ?? []) as Title[])
    setSearched(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#08080c] text-white pt-24 px-6 lg:px-10 pb-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Buscar
        </h1>
        <p className="text-[#6b6b80]">
          Encontre seus titulos favoritos
        </p>
      </div>

      <div className="flex gap-3 mb-10 max-w-2xl">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Nome do titulo..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full bg-[#1a1a24] border border-[#2a2a3a] text-white text-sm pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all placeholder:text-[#6b6b80]"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#6366f1]/25"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : 'Buscar'}
        </button>
      </div>

      {searched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#6b6b80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[#6b6b80] text-center">Nenhum resultado encontrado para &quot;{query}&quot;</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]" />
            <h2 className="text-lg font-semibold text-white">Resultados</h2>
            <span className="text-sm text-[#6b6b80] bg-[#1a1a24] px-3 py-1 rounded-lg border border-[#2a2a3a]">
              {results.length} titulos
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map(t => <TitleCard key={t.id} title={t} />)}
          </div>
        </div>
      )}

      {!searched && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[#6b6b80] text-center">Digite o nome de um titulo para buscar</p>
        </div>
      )}
    </main>
  )
}
