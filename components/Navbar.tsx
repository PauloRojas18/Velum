'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface User { name: string; email: string; avatar_color: string | null; is_admin: boolean }

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored) as User)
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  if (pathname === '/login') return null
  const av = user?.avatar_color ?? '#6366f1'

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:50,
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'14px 40px',transition:'all 0.3s',
      background: scrolled ? 'rgba(15,15,20,0.88)' : 'linear-gradient(to bottom,#08080c,rgba(8,8,12,0.5),transparent)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(99,102,241,0.1)' : 'none',
    }}>
      <div style={{display:'flex',alignItems:'center'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
          <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14,color:'white',boxShadow:'0 4px 12px rgba(99,102,241,0.3)',flexShrink:0}}>V</div>
          <span style={{fontWeight:600,fontSize:18,color:'white'}}>Velum</span>
        </Link>
        <div style={{display:'flex',alignItems:'center',gap:4,marginLeft:32}}>
          {[{href:'/',label:'Inicio'},{href:'/catalogo',label:'Catalogo'},{href:'/pesquisar',label:'Buscar'}].map(({href,label})=>(
            <Link key={href} href={href} style={{padding:'8px 16px',borderRadius:8,fontSize:14,fontWeight:500,color:pathname===href?'#818cf8':'#a1a1b5',background:pathname===href?'rgba(99,102,241,0.18)':'transparent',textDecoration:'none'}}>
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {user?.is_admin && <Link href="/admin" style={{padding:'5px 12px',borderRadius:8,fontSize:12,fontWeight:500,color:'#a78bfa',background:'rgba(139,92,246,0.12)',border:'1px solid rgba(139,92,246,0.25)',textDecoration:'none'}}>Admin</Link>}
        <Link href="/configuracoes" style={{width:36,height:36,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#6b6b80'}}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
        <Link href="/perfil">
          <div style={{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:600,textTransform:'uppercase',cursor:'pointer',background:`linear-gradient(135deg,${av},${av}bb)`,outline:`2px solid ${av}55`,outlineOffset:2}}>
            {user?.name?.[0] ?? 'U'}
          </div>
        </Link>
      </div>
    </nav>
  )
}
