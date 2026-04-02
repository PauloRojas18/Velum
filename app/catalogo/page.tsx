import { supabase } from '@/lib/supabase'
import TitleCard from '@/components/TitleCard'

export default async function BrowsePage() {
  const { data: titles } = await supabase
    .from('titles')
    .select('*')
    .order('name')

  const series = titles?.filter(t => t.type === 'series') || []
  const movies = titles?.filter(t => t.type === 'movie') || []

  return (
    <main className="min-h-screen bg-[#080808] text-white px-8 py-10">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl italic mb-10">
        Catálogo
      </h1>

      {series.length > 0 && (
        <section className="mb-12">
          <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase mb-6">
            Séries
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {series.map(t => <TitleCard key={t.id} title={t} />)}
          </div>
        </section>
      )}

      {movies.length > 0 && (
        <section>
          <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase mb-6">
            Filmes
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map(t => <TitleCard key={t.id} title={t} />)}
          </div>
        </section>
      )}

      {(!titles || titles.length === 0) && (
        <p className="text-white/30 text-sm">Nenhum título cadastrado ainda.</p>
      )}
    </main>
  )
}