import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Cihan Motors Oto Kiralama - Kartal\'ın En Güvenilir Araç Kiralama Firması',
  description: 'Kartal, İstanbul\'da uygun fiyatlı ve güvenilir araç kiralama hizmeti. Geniş araç filomuz ile 7/24 hizmetinizdeyiz. Rezervasyon için hemen arayın.',
  keywords: 'Kartal araç kiralama, İstanbul araç kiralama, oto kiralama Kartal, rent a car Kartal, Cihan Motors',
  openGraph: {
    title: 'Cihan Motors Oto Kiralama',
    description: 'Kartal, İstanbul\'da güvenilir araç kiralama hizmeti',
    url: 'https://cihanmotorsotokiralama.com',
    siteName: 'Cihan Motors Oto Kiralama',
    locale: 'tr_TR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://cihanmotorsotokiralama.com',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' }
            }
          }}
        />
        {children}
      </body>
    </html>
  )
}
