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

export default async function CatalogoPage() {
  const { data } = await supabase
    .from('titles')
    .select('*')
    .order('name')

  const titles = (data ?? []) as Title[]
  const series = titles.filter(t => t.type === 'series')
  const movies = titles.filter(t => t.type === 'movie')

  return (
    <main className="min-h-screen bg-[#08080c] text-white pt-24 px-6 lg:px-10 pb-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Catalogo
        </h1>
        <p className="text-[#6b6b80]">
          Explore todos os titulos disponiveis
        </p>
      </div>

      {series.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]" />
            <h2 className="text-lg font-semibold text-white">Series</h2>
            <span className="text-sm text-[#6b6b80] bg-[#1a1a24] px-3 py-1 rounded-lg border border-[#2a2a3a]">
              {series.length} titulos
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {series.map(t => <TitleCard key={t.id} title={t} />)}
          </div>
        </section>
      )}

      {movies.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#8b5cf6] to-[#6366f1]" />
            <h2 className="text-lg font-semibold text-white">Filmes</h2>
            <span className="text-sm text-[#6b6b80] bg-[#1a1a24] px-3 py-1 rounded-lg border border-[#2a2a3a]">
              {movies.length} titulos
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map(t => <TitleCard key={t.id} title={t} />)}
          </div>
        </section>
      )}

      {titles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <p className="text-[#6b6b80] text-center">Nenhum titulo cadastrado ainda.</p>
        </div>
      )}
    </main>
  )
}
