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
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
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
