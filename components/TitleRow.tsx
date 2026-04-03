import TitleCard from './TitleCard'
import Link from 'next/link'

type Title = {
  id: number
  name: string
  type: string
  cover_url: string | null
  year: number | null
  total_seasons: number | null
  total_episodes: number | null
}

export default function TitleRow({
  label,
  titles,
}: {
  label: string
  titles: Title[]
}) {
  return (
    <div className="px-6 lg:px-10 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]" />
          <h2 className="text-lg font-semibold text-white">
            {label}
          </h2>
        </div>
        <Link
          href="/catalogo"
          className="flex items-center gap-1.5 text-sm text-[#6b6b80] hover:text-[#818cf8] transition-colors group"
        >
          Ver tudo
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {titles.map(t => (
          <div key={t.id} className="flex-none w-[160px]">
            <TitleCard title={t} />
          </div>
        ))}
      </div>
    </div>
  )
}
