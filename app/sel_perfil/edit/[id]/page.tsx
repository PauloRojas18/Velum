'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import VelumLogo from '@/components/VelumLogo'
import Link from 'next/link'
import Image from 'next/image'

interface Avatar { id: number; image_url: string }

export default function EditProfile() {
  const router = useRouter()
  const params = useParams()
  const profileId = Number(params.id)

  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      // Carrega todos os avatares
      const { data: avatarData } = await supabase.from('avatars').select('*')
      if (avatarData) setAvatars(avatarData)

      // Carrega dados atuais do perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, avatars(id, image_url)')
        .eq('id', profileId)
        .single()

      if (profileData) {
        setName(profileData.name)
        setSelectedAvatar(profileData.avatar_id)
      }
    }
    load()
  }, [profileId])

  async function handleSave() {
    if (!name || !selectedAvatar) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ name, avatar_id: selectedAvatar })
      .eq('id', profileId)
    if (!error) {
      setSaved(true)
      setTimeout(() => router.push('/sel_perfil'), 800)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('Excluir este perfil?')) return
    setDeleting(true)
    await supabase.from('profiles').delete().eq('id', profileId)
    router.push('/sel_perfil')
  }

  const selectedAvatarUrl = avatars.find(a => a.id === selectedAvatar)?.image_url

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      color: 'var(--text-primary)',
    }}>

      <div style={{
        width: '100%', height: 60,
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 12, flexShrink: 0,
      }}>
        <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <VelumLogo variant="default" />
        </div>
        <h1 style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', letterSpacing: -0.3 }}>Velum</h1>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 24px 64px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.4, marginBottom: 6 }}>
            Editar perfil
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Altere o avatar ou o nome do perfil
          </p>
        </div>

        <div style={{ maxWidth: 480, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Avatar */}
          <div style={{
            background: 'var(--surface-card)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-card)', borderRadius: 16, padding: 24,
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#8b5cf6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Avatar
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                overflow: 'hidden', background: 'var(--surface-input)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: selectedAvatar ? '2px solid #6366f1' : '2px solid var(--surface-border)',
                boxShadow: selectedAvatar ? '0 8px 32px rgba(99,102,241,0.25)' : 'none',
                transition: 'all 0.3s',
              }}>
                {selectedAvatarUrl
                  ? <Image src={selectedAvatarUrl} width={64} height={64} alt="selecionado" style={{ objectFit: 'cover' }} />
                  : <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                }
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {avatars.map((a) => (
                  <button key={a.id} onClick={() => setSelectedAvatar(a.id)} style={{
                    width: 44, height: 44, borderRadius: 10, padding: 0, border: 'none',
                    cursor: 'pointer', overflow: 'hidden', background: 'var(--surface-input)',
                    outline: selectedAvatar === a.id ? '3px solid #6366f1' : '2px solid transparent',
                    outlineOffset: selectedAvatar === a.id ? 3 : 0,
                    boxShadow: selectedAvatar === a.id ? '0 4px 20px rgba(99,102,241,0.35)' : 'none',
                    transition: 'all 0.2s',
                  }}>
                    <Image src={a.image_url} priority width={44} height={44} alt="avatar" style={{ objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nome */}
          <div style={{
            background: 'var(--surface-card)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-card)', borderRadius: 16, padding: 24,
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#6366f1">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Nome do perfil
            </h3>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome do perfil"
              style={{
                width: '100%', background: 'var(--surface-input)',
                border: '1px solid var(--surface-border)', color: 'var(--text-primary)',
                fontSize: 14, padding: '12px 16px', borderRadius: 12,
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Salvar */}
          <button
            onClick={handleSave}
            disabled={saving || !name || !selectedAvatar}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: 'white', fontSize: 14, fontWeight: 600,
              padding: '14px 24px', borderRadius: 12, border: 'none',
              cursor: saving || !name || !selectedAvatar ? 'not-allowed' : 'pointer',
              opacity: saving || !name || !selectedAvatar ? 0.6 : 1,
              boxShadow: '0 4px 20px rgba(99,102,241,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'inherit', transition: 'opacity 0.2s',
            }}
          >
            {saving ? (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" />
                  <path fill="white" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Salvando...
              </>
            ) : saved ? (
              <>
                <svg width="16" height="16" fill="white" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Salvo!
              </>
            ) : 'Salvar alterações'}
          </button>

          {/* Cancelar */}
          <Link href="/sel_perfil" style={{
            textAlign: 'center', fontSize: 13, color: 'var(--text-primary)',
            background: 'var(--surface-card)', textDecoration: 'none',
            padding: '14px 24px', borderRadius: 12,
          }}>
            Cancelar
          </Link>

          {/* Excluir perfil */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              width: '100%', background: 'transparent',
              color: '#f87171', fontSize: 13, fontWeight: 500,
              padding: '10px 24px', borderRadius: 12,
              border: '1px solid rgba(248,113,113,0.3)',
              cursor: deleting ? 'not-allowed' : 'pointer',
              opacity: deleting ? 0.5 : 1,
              fontFamily: 'inherit', transition: 'opacity 0.2s',
            }}
          >
            {deleting ? 'Excluindo...' : 'Excluir perfil'}
          </button>

        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </main>
  )
}