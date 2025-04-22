'use client'
import './globals.css'
import { isMobile } from 'react-device-detect'
import WhatsAppWidget from '../components/WhatsAppWidget'
import ThemeWrapper from '../components/ThemeWrapper'
import { Suspense } from 'react'
import Footer from '../components/Footer'

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <ThemeWrapper>
            <main>
              {children}
            </main>
            <Footer />
            {!isMobile && <WhatsAppWidget />}
          </ThemeWrapper>
        </Suspense>
      </body>
    </html>
  )
}
