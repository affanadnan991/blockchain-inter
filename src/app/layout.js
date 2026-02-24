import { Lexend, Poppins } from 'next/font/google'
import ProvidersClient from '../components/ProvidersClient'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import '../styles/globals.css'

// Fonts with proper weights
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['400', '500', '600']
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['500', '600', '700']
})

export const metadata = {
  title: 'GiveHope - Transparent Donation Platform',
  description: 'Blockchain-based transparent donation platform for global philanthropy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lexend.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans min-h-screen flex flex-col pt-24">
        <ProvidersClient>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ProvidersClient>
      </body>
    </html>
  )
}
