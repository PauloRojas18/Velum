'use client'
import Navbar from './Navbar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* ✅ suppressHydrationWarning resolve o Suspense boundary mismatch do Next.js 16 */}
      <div suppressHydrationWarning>
        {children}
      </div>
    </>
  )
}