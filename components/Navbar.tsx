'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface User {
  name: string
  email: string
  avatar_color: string | null
  is_admin: boolean
}

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored) as User)
  }, [])

  if (pathname === '/login') return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-gradient-to-b from-[#0a0a0a] to-transparent">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="font-[family-name:var(--font-sans)] font-black text-base tracking-widest text-white uppercase"
        >
          Velum
        </Link>
        <div className="flex items-center gap-6">
          {[
            { href: '/', label: 'Início' },
            { href: '/catalogo', label: 'Catálogo' },
            { href: '/pesquisar', label: 'Buscar' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-[family-name:var(--font-mono)] text-[10px] tracking-[3px] uppercase transition-colors ${
                pathname === href ? 'text-white' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.is_admin && (
          <Link
            href="/admin"
            className="font-[family-name:var(--font-mono)] text-[10px] tracking-[3px] uppercase text-[#888]/60 hover:text-[#aaa] transition-colors"
          >
            Admin
          </Link>
        )}
        <Link href="/perfil">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black cursor-pointer hover:scale-110 transition-transform uppercase"
            style={{
              background: (user?.avatar_color ?? '#555') + '22',
              border: `1px solid ${user?.avatar_color ?? '#555'}`,
              color: user?.avatar_color ?? '#888',
            }}
          >
            {user?.name?.[0] ?? 'U'}
          </div>
        </Link>
      </div>
    </nav>
  )
}
