'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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

export default function AdminPage() {
  const [titles, setTitles] = useState<Title[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState('series')

  async function loadTitles() {
    const { data } = await supabase
      .from('titles')
      .select('*')
      .order('id', { ascending: false })

    setTitles((data ?? []) as Title[])
  }

  async function createTitle() {
    if (!name) return

    await supabase.from('titles').insert([{ name, type }])
    setName('')
    loadTitles()
  }

  async function deleteTitle(id: number) {
    await supabase.from('titles').delete().eq('id', id)
    loadTitles()
  }

  async function toggleFeatured(id: number, current: boolean | null) {
    await supabase
      .from('titles')
      .update({ featured: !current })
      .eq('id', id)

    loadTitles()
  }

  useEffect(() => {
    loadTitles()
  }, [])

  return (
    <main style={{ padding: 40, color: 'white', background: '#0b0b0f', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Admin</h1>

      {/* FORM */}
      <div style={{ marginBottom: 30, display: 'flex', gap: 10 }}>
        <input
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: 8 }}
        />

        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="series">Série</option>
          <option value="movie">Filme</option>
        </select>

        <button onClick={createTitle}>Adicionar</button>
      </div>

      {/* GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
          gap: 16,
        }}
      >
        {titles.map(t => (
          <div
            key={t.id}
            style={{
              background: '#111',
              padding: 12,
              borderRadius: 10,
            }}
          >
            <p style={{ fontWeight: 600 }}>{t.name}</p>
            <p style={{ fontSize: 12, color: '#888' }}>{t.type}</p>

            <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
              <button onClick={() => deleteTitle(t.id)}>Excluir</button>

              <button onClick={() => toggleFeatured(t.id, t.featured ?? false)}>
                {t.featured ? 'Remover destaque' : 'Destacar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}