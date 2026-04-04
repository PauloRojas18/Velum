import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', weight: ['400','500','600','700'] })

export const metadata: Metadata = {
  title: 'Velum',
  description: 'Seu streaming pessoal',
  icons: { icon: '/Velumicon.svg' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} data-theme="dark">
      <body style={{ background: 'var(--bg)', color: 'var(--text-primary)', fontFamily: "var(--font-sans,'Inter',system-ui,sans-serif)", minHeight: '100vh' }}>
        {/* Aplica data-theme ANTES do primeiro paint — sem flash, sem warning */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            var t = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}</Script>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}