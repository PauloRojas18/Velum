import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Velum',
  description: 'Seu streaming pessoal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body style={{background:'#08080c',color:'white',fontFamily:"var(--font-sans,'Inter',system-ui,sans-serif)"}}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
