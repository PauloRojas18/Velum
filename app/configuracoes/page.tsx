'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface User {
  id: number
  name: string
  email: string
  avatar_color: string | null
  is_admin: boolean
}

const AVATAR_COLORS = ['#888', '#7c6adb', '#4caf9a', '#db6a6a', '#6aaabb'] as const

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[0])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored) as User
    setUser(u)
    setName(u.name)
    setColor((u.avatar_color as typeof AVATAR_COLORS[number]) ?? AVATAR_COLORS[0])
  }, [])

  async function handleSave() {
    if (!user) return
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
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#080808] text-white px-8 py-10">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl italic mb-10">
        Configurações
      </h1>

      <div className="max-w-sm flex flex-col gap-6">
        <div>
          <p className="text-[9px] tracking-[4px] text-[#888] uppercase mb-3">
            Nome
          </p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 outline-none focus:border-white/30 transition-colors"
          />
        </div>

        <div>
          <p className="text-[9px] tracking-[4px] text-[#888] uppercase mb-3">
            Cor do avatar
          </p>
          <div className="flex gap-3">
            {AVATAR_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                style={{
                  background: c,
                  outline: color === c ? `2px solid ${c}` : 'none',
                  outlineOffset: '3px',
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-white text-black text-xs tracking-[3px] uppercase py-3 hover:bg-white/80 transition-opacity"
        >
          {saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>
    </main>
  )
}
