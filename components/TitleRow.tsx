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
    <div className="px-8 mb-10">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[9px] tracking-[4px] text-[#c9a84c] uppercase">
          {label}
        </p>
        <Link
          href="/browse"
          className="text-[9px] tracking-[2px] uppercase text-white/20 hover:text-white/50 transition-colors"
        >
          Ver tudo
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {titles.map(t => (
          <div key={t.id} className="flex-none w-[140px]">
            <TitleCard title={t} />
          </div>
        ))}
      </div>
    </div>
  )
}