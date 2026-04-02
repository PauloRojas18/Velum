'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()

    if (!user) {
      setError('Email ou senha incorretos.')
      setLoading(false)
      return
    }

    localStorage.setItem('user', JSON.stringify(user))
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic text-center mb-2">
          Arquivo
        </h1>
        <p className="text-white/30 text-xs text-center tracking-widest uppercase mb-10">
          Acesso restrito
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors placeholder:text-white/20"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="bg-white/5 border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-[#c9a84c] transition-colors placeholder:text-white/20"
          />

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#c9a84c] text-black text-xs tracking-[3px] uppercase py-3 hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </main>
  )
}