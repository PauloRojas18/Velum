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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored) as User)

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname === '/login') return null

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10 py-4 transition-all duration-300 ${
        scrolled 
          ? 'glass' 
          : 'bg-gradient-to-b from-[#08080c] via-[#08080c]/80 to-transparent'
      }`}
    >
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-white group-hover:text-[#818cf8] transition-colors">
            Velum
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-1 ml-2">
          {[
            { href: '/', label: 'Inicio' },
            { href: '/catalogo', label: 'Catalogo' },
            { href: '/pesquisar', label: 'Buscar' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === href 
                  ? 'bg-[#6366f1]/20 text-[#818cf8]' 
                  : 'text-[#a1a1b5] hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.is_admin && (
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#a78bfa] bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 hover:bg-[#8b5cf6]/20 transition-all"
          >
            Admin
          </Link>
        )}
        <Link href="/configuracoes" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <svg className="w-5 h-5 text-[#6b6b80] hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
        <Link href="/perfil">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer hover:scale-105 transition-transform uppercase ring-2 ring-offset-2 ring-offset-[#08080c]"
            style={{
              background: `linear-gradient(135deg, ${user?.avatar_color ?? '#6366f1'} 0%, ${user?.avatar_color ?? '#8b5cf6'} 100%)`,
              ringColor: user?.avatar_color ?? '#6366f1',
            }}
          >
            {user?.name?.[0] ?? 'U'}
          </div>
        </Link>
      </div>
    </nav>
  )
}
