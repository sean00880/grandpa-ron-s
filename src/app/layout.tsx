import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '../components/NavbarAttempt'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Professional Landscaping Services in Canal Winchester, OH | Grandpa Ron\'s Lawn and Landscape',
  description: 'Expert landscaping services in Canal Winchester, Ohio. Mulching, mowing, patios, tree removal, leaf cleanup, and more. Serving Canal Winchester and Columbus area with professional lawn care and landscape design.',
  keywords: 'landscaping Canal Winchester Ohio, lawn care Columbus OH, mulching services, patio installation, tree removal, leaf cleanup, landscape design, professional landscaping',
  authors: [{ name: 'Grandpa Ron\'s Lawn and Landscape' }],
  creator: 'Grandpa Ron\'s Lawn and Landscape',
  publisher: 'Grandpa Ron\'s Lawn and Landscape',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://grandparons.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Professional Landscaping Services in Canal Winchester, OH | Grandpa Ron\'s Lawn and Landscape',
    description: 'Expert landscaping services in Canal Winchester, Ohio. Mulching, mowing, patios, tree removal, leaf cleanup, and more.',
    url: 'https://grandparons.com',
    siteName: 'Grandpa Ron\'s Lawn and Landscape',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Landscaping Services in Canal Winchester, OH',
    description: 'Expert landscaping services in Canal Winchester, Ohio. Mulching, mowing, patios, tree removal, leaf cleanup, and more.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}