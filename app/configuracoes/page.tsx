'use client'
import { useState, useLayoutEffect, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface User { id: number; name: string; email: string; avatar_color: string | null; is_admin: boolean }

type ThemeColor = '#6366f1' | '#8b5cf6' | '#06b6d4' | '#10b981' | '#f59e0b' | '#ef4444'
const COLORS: ThemeColor[] = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

type AppTheme = 'dark' | 'light'

function getProfileFromStorage() {
  try {
    const stored = localStorage.getItem('user')
    if (!stored) return null
    const u = JSON.parse(stored) as User
    return {
      user: u,
      name: u.name,
      color: (COLORS.includes(u.avatar_color as ThemeColor) ? u.avatar_color : COLORS[0]) as ThemeColor,
    }
  } catch {
    return null
  }
}

function getThemeFromStorage(): AppTheme {
  try {
    return (localStorage.getItem('theme') ?? 'dark') as AppTheme
  } catch {
    return 'dark'
  }
}

export default function SettingsPage() {
  const router = useRouter()

  const [profile, setProfile] = useState<{ user: User; name: string; color: ThemeColor } | null>(getProfileFromStorage)
  const [theme, setTheme] = useState<AppTheme>(getThemeFromStorage)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (!profile) {
      router.push('/login')
    }
  }, [profile, router])

  if (!profile) return null

  async function handleSave() {
    if (!profile) return
    setSaving(true)
    const { data } = await supabase
      .from('users')
      .update({ name: profile.name, avatar_color: profile.color })
      .eq('id', profile.user.id)
      .select()
      .single()
    if (data) {
      localStorage.setItem('user', JSON.stringify(data))
      setProfile(prev => prev ? { ...prev, user: data as User } : prev)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const { user, name, color } = profile

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', paddingTop: 80, paddingBottom: 64, paddingLeft: 40, paddingRight: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Link href="/perfil" style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'var(--surface)' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>Configurações</h1>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 36, marginLeft: 44 }}>Personalize seu perfil</p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: 520 }}>
              <div style={{ background: 'var(--surface-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-card)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#6366f1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Informações pessoais
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Nome</label>
                    <input type="text" value={name} onChange={e => setProfile(prev => prev ? { ...prev, name: e.target.value } : prev)}
                      style={{ width: '100%', background: 'var(--surface-input)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)', fontSize: 14, padding: '12px 16px', borderRadius: 12, outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Email</label>
                    <input type="email" value={user.email} disabled
                      style={{ width: '100%', background: 'var(--surface-input-disabled)', border: '1px solid var(--surface-border)', color: 'var(--text-muted)', fontSize: 14, padding: '12px 16px', borderRadius: 12, outline: 'none', cursor: 'not-allowed', fontFamily: 'inherit' }} />
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-card)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#8b5cf6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                  Cor do avatar
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, textTransform: 'uppercase', flexShrink: 0, color: 'white', background: `linear-gradient(135deg,${color},${color}bb)`, boxShadow: `0 8px 32px ${color}40`, transition: 'all 0.3s' }}>
                    {name[0] || 'U'}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setProfile(prev => prev ? { ...prev, color: c } : prev)}
                        style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${c},${c}bb)`, border: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: color === c ? 3 : 0, boxShadow: color === c ? `0 4px 20px ${c}40` : 'none' }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-card)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#a78bfa"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                  Aparência
                </h2>
                <div style={{ display: 'flex', gap: 14 }}>
                  <button onClick={() => setTheme('dark')}
                    style={{ flex: 1, padding: 0, border: theme === 'dark' ? '2px solid #6366f1' : '2px solid var(--surface-border)', borderRadius: 12, cursor: 'pointer', background: 'none', boxShadow: theme === 'dark' ? '0 0 0 3px rgba(99,102,241,0.18)' : 'none', transition: 'all 0.2s', overflow: 'hidden' }}>
                    <div style={{ background: '#0d0d12', padding: '16px 14px 10px', borderRadius: '10px 10px 0 0' }}>
                      <div style={{ height: 6, width: '55%', borderRadius: 4, background: '#2a2a3a', marginBottom: 8 }} />
                      <div style={{ height: 4, width: '80%', borderRadius: 4, background: '#1e1e28', marginBottom: 6 }} />
                      <div style={{ height: 4, width: '65%', borderRadius: 4, background: '#1e1e28', marginBottom: 12 }} />
                      <div style={{ height: 28, width: '50%', borderRadius: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }} />
                    </div>
                    <div style={{ padding: '10px 14px 12px', background: '#08080c', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {theme === 'dark' && <svg width="13" height="13" fill="#6366f1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      <span style={{ fontSize: 12, fontWeight: 600, color: theme === 'dark' ? '#818cf8' : 'var(--text-muted)' }}>Escuro</span>
                    </div>
                  </button>

                  <button onClick={() => setTheme('light')}
                    style={{ flex: 1, padding: 0, border: theme === 'light' ? '2px solid #6366f1' : '2px solid var(--surface-border)', borderRadius: 12, cursor: 'pointer', background: 'none', boxShadow: theme === 'light' ? '0 0 0 3px rgba(99,102,241,0.18)' : 'none', transition: 'all 0.2s', overflow: 'hidden' }}>
                    <div style={{ background: '#eeeef4', padding: '16px 14px 10px', borderRadius: '10px 10px 0 0' }}>
                      <div style={{ height: 6, width: '55%', borderRadius: 4, background: '#c8c8d8', marginBottom: 8 }} />
                      <div style={{ height: 4, width: '80%', borderRadius: 4, background: '#d8d8e4', marginBottom: 6 }} />
                      <div style={{ height: 4, width: '65%', borderRadius: 4, background: '#d8d8e4', marginBottom: 12 }} />
                      <div style={{ height: 28, width: '50%', borderRadius: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }} />
                    </div>
                    <div style={{ padding: '10px 14px 12px', background: '#e4e4ec', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {theme === 'light' && <svg width="13" height="13" fill="#6366f1" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      <span style={{ fontSize: 12, fontWeight: 600, color: theme === 'light' ? '#818cf8' : 'var(--text-muted)' }}>Claro</span>
                    </div>
                  </button>
                </div>
              </div>

              <button onClick={handleSave} disabled={saving}
                style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', fontSize: 14, fontWeight: 600, padding: '14px 24px', borderRadius: 12, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, boxShadow: '0 4px 20px rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                {saving
                  ? <><svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" /><path fill="white" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Salvando...</>
                  : saved
                  ? <><svg width="16" height="16" fill="white" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Salvo!</>
                  : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </main>
  )
}