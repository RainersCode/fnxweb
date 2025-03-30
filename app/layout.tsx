import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RK "Fēnikss" - Valmieras Regbija Klubs | Dibināts 2005',
  description: 'RK "Fēnikss" oficiālā mājaslapa - Valmieras vadošais regbija klubs, dibināts 2005. gadā. Pievienojieties mums, lai uzzinātu par spēlēm, jaunumiem, fotoattēliem un informāciju par klubu. Apvieno dažāda vecuma un prasmju spēlētājus vienotā komandā.',
  generator: 'v0.dev',
  keywords: ['regbijs', 'Valmiera', 'Fēnikss', 'sporta klubs', 'Latvijas regbijs', 'regbija spēles', 'regbija komanda'],
  authors: [{ name: 'RK Fēnikss' }],
  openGraph: {
    title: 'RK "Fēnikss" - Valmieras Regbija Klubs | Dibināts 2005',
    description: 'RK "Fēnikss" oficiālā mājaslapa - Valmieras vadošais regbija klubs, dibināts 2005. gadā. Pievienojieties mums, lai uzzinātu par spēlēm, jaunumiem un informāciju par klubu.',
    url: 'https://your-domain.com', // Replace with your actual domain when available
    siteName: 'RK Fēnikss',
    images: [
      {
        url: '/Logo/fēniks_logo-removebg-preview.png',
        width: 800,
        height: 600,
        alt: 'RK Fēnikss Logo',
      }
    ],
    locale: 'lv_LV',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RK "Fēnikss" - Valmieras Regbija Klubs',
    description: 'RK "Fēnikss" oficiālā mājaslapa - Valmieras vadošais regbija klubs, dibināts 2005. gadā.',
    images: ['/Logo/fēniks_logo-removebg-preview.png'],
  },
  icons: {
    icon: '/Logo/fēniks_logo-removebg-preview.png',
    shortcut: '/Logo/fēniks_logo-removebg-preview.png',
    apple: '/Logo/fēniks_logo-removebg-preview.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          header: 'hidden',
          card: {
            boxShadow: 'none',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
          },
          modalBackdrop: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          modalContent: {
            backgroundColor: 'white',
            borderRadius: '0.5rem',
          },
        },
        layout: {
          socialButtonsPlacement: 'bottom',
          socialButtonsVariant: 'blockButton',
          termsPageUrl: 'https://clerk.com/terms',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(inter.className, 'min-h-screen bg-background')}
          suppressHydrationWarning
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
            <Toaster />
            <SonnerToaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
