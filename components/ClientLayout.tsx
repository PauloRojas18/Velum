'use client'
import Navbar from './Navbar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Tema aplicado via script inline no layout.tsx — sem useEffect necessário aqui
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}