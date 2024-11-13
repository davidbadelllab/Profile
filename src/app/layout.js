import './globals.css'
import WhatsAppWidget from '@/components/WhatsAppWidget'

export const metadata = {
  title: 'Portafolio',
  description: 'Full Stack Developer Portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  )
}
