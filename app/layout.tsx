import type { Metadata } from 'next'
import { Poppins, DM_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '700', '800'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Arquivo',
  description: 'Player pessoal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${dmMono.variable}`}>
      <body className="bg-[#0a0a0a] text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}