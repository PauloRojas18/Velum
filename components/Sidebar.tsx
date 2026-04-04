'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User { name: string; avatar_color: string | null; is_admin: boolean }

const NAV = [
  { href: '/', label: 'Início', icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12L12 4l9 8"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>
  )},
  { href: '/catalogo', label: 'Catálogo', icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.8}/><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.8}/><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.8}/><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.8}/></svg>
  )},
  { href: '/pesquisar', label: 'Buscar', icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth={1.8}/><path strokeLinecap="round" strokeWidth={1.8} d="m21 21-4.35-4.35"/></svg>
  )},
  { href: '/perfil', label: 'Perfil', icon: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4" strokeWidth={1.8}/></svg>
  )},
]

export default function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const s = localStorage.getItem('user')
    if (s) setUser(JSON.parse(s))
  }, [])

  if (pathname === '/login') return null

  const av = user?.avatar_color ?? '#6366f1'

  return (
    <aside style={{
      width: 68,
      flexShrink: 0,
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 0',
      background: '#080810',
      borderRight: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Logo */}
      <Link href="/" style={{ marginBottom: 32, display: 'block' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 16, color: 'white',
          boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
        }}>V</div>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', alignItems: 'center' }}>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} title={label} style={{
              width: 44, height: 44, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: active ? 'white' : '#4a4a60',
              background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
              borderLeft: active ? '2px solid #6366f1' : '2px solid transparent',
              transition: 'all 0.2s',
              position: 'relative',
            }}>
              {icon}
            </Link>
          )
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Admin */}
      {user?.is_admin && (
        <Link href="/admin" title="Admin" style={{
          width: 44, height: 44, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: pathname === '/admin' ? '#818cf8' : '#4a4a60',
          background: pathname === '/admin' ? 'rgba(99,102,241,0.18)' : 'transparent',
          marginBottom: 8,
        }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </Link>
      )}

      {/* Settings */}
      <Link href="/configuracoes" title="Configurações" style={{
        width: 44, height: 44, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: pathname === '/configuracoes' ? 'white' : '#4a4a60',
        background: pathname === '/configuracoes' ? 'rgba(99,102,241,0.18)' : 'transparent',
        marginBottom: 12,
      }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" strokeWidth={1.8}/></svg>
      </Link>

      {/* Avatar */}
      <Link href="/perfil" title="Perfil" style={{
        width: 36, height: 36, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, textTransform: 'uppercase',
        background: `linear-gradient(135deg,${av},${av}bb)`,
        outline: `2px solid ${av}44`, outlineOffset: 2,
        color: 'white',
      }}>
        {user?.name?.[0] ?? 'U'}
      </Link>
    </aside>
  )
}
