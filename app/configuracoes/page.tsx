'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface User {
  id: number
  name: string
  email: string
  avatar_color: string | null
  is_admin: boolean
}

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'] as const

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[0])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored) as User
    setUser(u)
    setName(u.name)
    setColor((u.avatar_color as typeof AVATAR_COLORS[number]) ?? AVATAR_COLORS[0])
  }, [router])

  async function handleSave() {
    if (!user) return
    setSaving(true)
    const { data } = await supabase
      .from('users')
      .update({ name, avatar_color: color })
      .eq('id', user.id)
      .select()
      .single()

    if (data) {
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data as User)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#08080c] text-white pt-24 px-6 lg:px-10 pb-16">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Link 
            href="/perfil"
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-[#6b6b80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Configuracoes
          </h1>
        </div>
        <p className="text-[#6b6b80] mb-10 ml-12">
          Personalize seu perfil
        </p>

        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#6366f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informacoes pessoais
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#a1a1b5] mb-2 block">Nome</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#1a1a24] border border-[#2a2a3a] text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-[#a1a1b5] mb-2 block">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-[#1a1a24]/50 border border-[#2a2a3a] text-[#6b6b80] text-sm px-4 py-3 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Cor do avatar
          </h2>
          
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold uppercase shadow-lg transition-all"
              style={{ 
                background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                boxShadow: `0 8px 32px ${color}40`
              }}
            >
              {name[0] || 'U'}
            </div>
            <div className="flex gap-3 flex-wrap">
              {AVATAR_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-10 h-10 rounded-xl transition-all hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${c} 0%, ${c}cc 100%)`,
                    outline: color === c ? `3px solid ${c}` : 'none',
                    outlineOffset: '3px',
                    boxShadow: color === c ? `0 4px 20px ${c}40` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#6366f1]/25 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Salvando...
            </>
          ) : saved ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Salvo!
            </>
          ) : 'Salvar alteracoes'}
        </button>
      </div>
    </main>
  )
}
