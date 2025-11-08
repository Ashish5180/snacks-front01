// These styles apply to every route in the application
import './globals.css'
import Script from 'next/script'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'
import { ToastProvider } from '../components/Toaster'
import GoToCartBar from '../components/GoToCartBar'
import BackendKeepAlive from '../components/BackendKeepAlive'

export const metadata = {
  title: {
    default: 'VIBE BITES - Vibe Every Bite | Healthy Snacks',
    template: '%s | VIBE BITES',
  },
  description:
    'Discover healthy snacks like baked chips, roasted makhanas, protein snacks, and energy bites. Vibe Every Bite with VIBE BITES - your trusted source for nutritious and delicious snacks.',
  keywords: [
    'healthy snacks',
    'baked chips',
    'roasted makhanas',
    'protein snacks',
    'energy bites',
    'VIBE BITES',
    'organic snacks',
    'gluten-free snacks',
    'natural snacks',
    'healthy food',
  ],
  authors: [{ name: 'VIBE BITES' }],
  creator: 'VIBE BITES',
  publisher: 'VIBE BITES',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vibebites.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vibebites.com',
    siteName: 'VIBE BITES',
    title: 'VIBE BITES - Vibe Every Bite | Healthy Snacks',
    description:
      'Discover healthy snacks like baked chips, roasted makhanas, protein snacks, and energy bites. Vibe Every Bite with VIBE BITES.',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'VIBE BITES - Healthy Snacks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIBE BITES - Vibe Every Bite | Healthy Snacks',
    description:
      'Discover healthy snacks like baked chips, roasted makhanas, protein snacks, and energy bites.',
    images: ['/images/logo.jpeg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/logo.jpeg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#D9A25F" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Preload Razorpay script for faster payment processing */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
        {/* Keep backend alive to prevent cold starts */}
        <BackendKeepAlive />
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <GoToCartBar />
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
