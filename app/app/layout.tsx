
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Pastelería Mairim - Endulzando tus momentos especiales en Zongolica',
  description: 'Descubre los mejores pasteles, cupcakes y postres artesanales de Zongolica, Veracruz. Pastelería Mairim, tradición y sabor desde el corazón de México.',
  keywords: 'pastelería, pasteles, cupcakes, postres, Zongolica, Veracruz, México, pastelería artesanal'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(45, 100%, 98%)',
                color: 'hsl(25, 25%, 20%)',
                border: '1px solid hsl(45, 20%, 88%)',
                borderRadius: '1rem',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
