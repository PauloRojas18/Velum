'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import VelumLogo from '@/components/VelumLogo'
import { Plus, Brush } from 'lucide-react'
import Image from 'next/image'

interface User { id: number; name: string; email: string; avatar_color: string | null; is_admin: boolean }
interface Profile { id: number; name: string; avatar_color: string | null; avatars?: { id: number; image_url: string } | null }

export default function SelPerfil() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [managing, setManaging] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const s = localStorage.getItem('user')
        if (!s) return
        const parsedUser: User = JSON.parse(s)
        const { data } = await supabase
          .from('profiles')
          .select('*, avatars(id,image_url)')
          .eq('user_id', parsedUser.id)
        if (data) setProfiles(data)
      } catch (e) {
        console.error('Error loading profiles:', e)
      }
    }
    load()
  }, [])

  async function handleSelectProfile(profileId: number) {
    localStorage.setItem('profile_id', String(profileId))
    router.push('/home')
  }

  async function handleAddProfile() {
    router.push('/sel_perfil/add')
  }

  return (
    <>
      <style>{`
        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .profile-avatar {
          width: 120px;
          height: 120px;
        }
        .profile-initials {
          width: 120px;
          height: 120px;
          font-size: 40px;
        }
        .add-avatar {
          width: 120px;
          height: 120px;
        }
        .page-title {
          font-size: 24px;
        }
        @media (max-width: 768px) {
          .profiles-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .profile-avatar {
            width: 90px;
            height: 90px;
          }
          .profile-initials {
            width: 90px;
            height: 90px;
            font-size: 30px;
          }
          .add-avatar {
            width: 90px;
            height: 90px;
          }
          .page-title {
            font-size: 20px;
          }
        }
        @media (max-width: 480px) {
          .profiles-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .profile-avatar {
            width: 70px;
            height: 70px;
          }
          .profile-initials {
            width: 70px;
            height: 70px;
            font-size: 24px;
          }
          .add-avatar {
            width: 70px;
            height: 70px;
          }
          .page-title {
            font-size: 18px;
          }
        }
      `}</style>

      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          gap: 12,
        }}>
          <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VelumLogo variant='default' />
          </div>
          <h1 style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', letterSpacing: -0.3, margin: 0 }}>Velum</h1>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px 40px',
          gap: 32,
        }}>
          <h2 className="page-title" style={{
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: -0.3,
            margin: 0,
            textAlign: 'center',
          }}>
            Quem está assistindo?
          </h2>

          <div className="profiles-grid">
            {profiles?.map((p) => (
              <button
                key={p.id}
                onClick={() => managing ? router.push(`/sel_perfil/edit/${p.id}`) : handleSelectProfile(p.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                <div style={{ position: 'relative'}}>
                  {managing && (
                    <div style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 28,
                      height: 28,
                      backgroundColor: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      zIndex: 2,
                    }}>
                      <Brush size={14} color='var(--bg)' />
                    </div>
                  )}
                  {p.avatars?.image_url ? (
                    <Image
                      src={p.avatars.image_url}
                      alt={p.name}
                      width={120}
                      height={120}
                      className="profile-avatar"
                      style={{
                        borderRadius: 8,
                        objectFit: 'cover',
                        opacity: managing ? 0.6 : 1,
                        transition: 'opacity 0.2s',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div
                      className="profile-initials"
                      style={{
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${p.avatar_color ?? '#6366f1'}, ${p.avatar_color ?? '#6366f1'}aa)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'white',
                        opacity: managing ? 0.6 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span style={{ color: 'azure', fontSize: 'clamp(12px, 2vw, 14px)' }}>{p.name}</span>
              </button>
            ))}

            {/* Add profile */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <button
                onClick={handleAddProfile}
                className="add-avatar"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  backgroundColor: 'var(--surface)',
                  border: '2px solid var(--text-secondary)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                <Plus size={48} />
              </button>
              <span style={{ color: 'var(--text-secondary)', fontSize: 'clamp(12px, 2vw, 14px)' }}>Adicionar</span>
            </div>
          </div>

          <button
            onClick={() => setManaging(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              borderRadius: 4,
              border: '1px solid var(--text-secondary)',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {managing ? 'Concluído' : 'Gerenciar Perfis'}
            </span>
          </button>
        </div>
      </main>
    </>
  )
}