'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import VelumLogo from '@/components/VelumLogo'
import { Plus, Brush } from 'lucide-react'
import Image from 'next/image'

interface User { id:number; name:string; email:string; avatar_color:string|null; is_admin:boolean }

interface Profile { id:number; name:string; avatar_color:string|null; avatars?: { id:number; image_url:string }[] | null }

export default function SelPerfil() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [managing, setManaging] = useState(false)

    useEffect(() => {
        const load = async () => {
            try{
                const s = localStorage.getItem('user')

                if(!s) return

                const parsedUser: User = JSON.parse(s)

                const { data } = await supabase.from('profiles').select('*, avatars(id,image_url)').eq('user_id', parsedUser.id)

                if (data) setProfiles(data) }catch(e){
                    console.error('Error loading profiles:', e)
            }
        }       

        load()
    }, [])

    async function handleSelectProfile(profileId: number) {
    localStorage.setItem('profile_id', String(profileId))
    router.push('/home')
    }
    async function handleAddProfile(profileId: number) {
    localStorage.setItem('profile_id', String(profileId))
    router.push('/sel_perfil/add')
    }

  return (
<main style={{
      height: '100vh', position: 'relative', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      flexDirection: 'column',
    }}>
        <div style={{width: '100%', height: '10%', justifyContent: 'flex-start', alignItems: 'center', display: 'flex', padding: '0 16px', gap: 12}}>
            <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <VelumLogo variant='default'/>
            </div>
            <h1 style={{fontWeight: 700, fontSize: 17, color: 'var(--text-primary)', letterSpacing: -0.3 }}>Velum</h1>
        </div>  
        <div style={{ width: '100%', height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{ transform: 'translateY(-30%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24  }}>
                <h2 style={{fontWeight: 700, fontSize: 24, color: 'var(--text-primary)', letterSpacing: -0.3, marginBottom: 8 }}>Quem está assistindo?</h2>
                <div className='rows-container' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                    {profiles?.map((p) => (
                        <button  key={p.id} onClick={() => managing ? router.push(`/sel_perfil/edit/${p.id}`) : handleSelectProfile(p.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', background: 'none', border: 'none' }}>
                            <div style={{ position: 'relative', width: 120, height: 120 }}>
                                {managing && (
                                <div style={{ position: 'absolute', top: -6, right: -6, width: 28, height: 28, backgroundColor: 'var(--text-primary)',display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', zIndex: 2 }}>
                                    <Brush size={14} color='var(--bg)'/>
                                </div>
                                )}
                                <Image
                                src={p.avatars?.[0]?.image_url ?? ''}
                                alt={p.name}
                                width={120}
                                height={120}
                                style={{ borderRadius: 8, objectFit: 'cover', opacity: managing ? 0.6 : 1, transition: 'opacity 0.2s' }}
                                />
                            </div>
                            <span style={{ color:'azure'}}>{p.name}</span>
                        </button>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                        <button onClick={() => handleAddProfile(0)} style={{ height: 120, width: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: 'var(--surface)', border: '2px solid var(--text-secondary)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Plus size={64}/>
                        </button>
                        <span>Adicionar</span>
                    </div>
                </div>
            </div>
            <button onClick={() => setManaging(prev => !prev)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',padding: '10px 14px', borderRadius: 4, border: '1px solid var(--text-secondary)', cursor: 'pointer' }}>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{managing ? 'Concluído' : 'Gerenciar Perfis'}</h4>
            </button>
        </div>  
    </main>
  )
}
