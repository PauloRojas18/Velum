'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface User {
  id: number
  name: string
  email: string
  avatar_color: string | null
  is_admin: boolean
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()

    if (error || !user) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    localStorage.setItem('user', JSON.stringify(user))
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#08080c] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#8b5cf6]/5" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#6366f1]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#8b5cf6]/20 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative">
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-[#6366f1]/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#6366f1]/30">
              <span className="text-white font-bold text-2xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Bem-vindo ao Velum
            </h1>
            <p className="text-[#6b6b80] text-sm">
              Entre para acessar seu streaming pessoal
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-[#a1a1b5] mb-2 block">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1a1a24] border border-[#2a2a3a] text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all placeholder:text-[#6b6b80]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#a1a1b5] mb-2 block">Senha</label>
              <input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full bg-[#1a1a24] border border-[#2a2a3a] text-white text-sm px-4 py-3 rounded-xl outline-none focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 transition-all placeholder:text-[#6b6b80]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-[#6366f1]/25 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
