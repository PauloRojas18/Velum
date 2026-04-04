import { cookies } from 'next/headers'

export async function getIsAdmin(): Promise<boolean> {
  const store = await cookies()
  return store.get('is_admin')?.value === 'true'
}
