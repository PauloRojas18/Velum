'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import VelumLogo from './VelumLogo'

interface User { name: string; email: string; avatar_color: string | null; is_admin: boolean }

const NAV_LINKS = [
  { href: '/home', label: 'Início' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/pesquisar', label: 'Buscar' },
]

export default function Navbar() {
  const pathname = usePathname()
  // null no SSR e no primeiro render do cliente — evita hydration mismatch
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    // Roda só no cliente, após hydration
    try {
      const s = localStorage.getItem('user')
      if (s) setUser(JSON.parse(s))
      setTheme((localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark')
    } catch {}

    const h = () => setScrolled(window.scrollY > 10)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Observa mudanças de tema feitas em runtime (página de configurações)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme') as 'dark' | 'light'
      if (t) setTheme(t)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  if (pathname === '/login') return null

  const av = user?.avatar_color ?? '#6366f1'
  const isHome = pathname === '/home'
  const solid = scrolled || !isHome

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 64,
      transition: 'background 0.4s, backdrop-filter 0.4s, border-color 0.4s',
      background: solid ? 'var(--bg-nav)' : 'transparent',
      backdropFilter: solid ? 'blur(16px)' : 'none',
      borderBottom: solid ? '1px solid var(--nav-border)' : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 36 }}>
          <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VelumLogo variant={theme === 'light' ? 'mono' : 'default'} size={38} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', letterSpacing: -0.3 }}>Velum</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{
                padding: '6px 14px', borderRadius: 8,
                fontSize: 14, fontWeight: active ? 600 : 400,
                color: active ? 'var(--text-primary)' : 'var(--nav-link-color)',
                background: active ? 'var(--nav-link-active-bg)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.15s', letterSpacing: 0.1,
              }}>{label}</Link>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {user?.is_admin && (
          <Link href="/admin" style={{ padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, color: '#a78bfa', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', textDecoration: 'none', letterSpacing: 0.2 }}>Admin</Link>
        )}
        <Link href="/pesquisar" style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'transparent', textDecoration: 'none' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/></svg>
        </Link>
        <Link href="/configuracoes" style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'transparent', textDecoration: 'none' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
        </Link>
        <Link href="/perfil" style={{ marginLeft: 4, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', background: `linear-gradient(135deg,${av},${av}cc)`, boxShadow: `0 0 0 2px var(--bg), 0 0 0 4px ${av}66`, color: 'white' }}>
            {user?.name?.[0] ?? 'U'}
          </div>
        </Link>
      </div>
    </nav>
  )
}