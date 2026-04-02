'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  async function handleSearch() {
    if (!query.trim()) return
    const { data } = await supabase
      .from('titles')
      .select('*')
      .ilike('name', `%${query}%`)
    setResults(data || [])
    setSearched(true)
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white px-8 py-10">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl italic mb-8">
        Buscar
      </h1>

      <div className="flex gap-3 mb-10 max-w-lg">
        <input
          type="text"
          placeholder="Nome do título..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors placeholder:text-white/20"
        />
        <button
          onClick={handleSearch}
          className="bg-[#c9a84c] text-black text-xs tracking-[3px] uppercase px-6 hover:opacity-80 transition-opacity"
        >
          Buscar
        </button>
      </div>

      {searched && results.length === 0 && (
        <p className="text-white/30 text-sm">Nenhum resultado encontrado.</p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map(t => <TitleCard key={t.id} title={t} />)}
        </div>
      )}
    </main>
  )
}