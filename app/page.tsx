import { supabase } from '@/lib/supabase'
import Hero from '@/components/Hero'
import TitleRow from '@/components/TitleRow'

export default async function Home() {
  const { data: series } = await supabase
    .from('titles')
    .select('*')
    .eq('type', 'series')
    .order('created_at', { ascending: false })

  const { data: movies } = await supabase
    .from('titles')
    .select('*')
    .eq('type', 'movie')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <Hero titles={[...(series || []), ...(movies || [])]} />
      <div className="pb-12">
        {series && series.length > 0 && (
          <TitleRow label="Séries" titles={series} />
        )}
        {movies && movies.length > 0 && (
          <TitleRow label="Filmes" titles={movies} />
        )}
      </div>
    </main>
  )
}