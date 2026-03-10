// RK Fēnikss - Official Website
import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { Oswald, Barlow_Condensed, Barlow } from 'next/font/google'

const oswald = Oswald({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cond',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Regbija Klubs "Fēnikss" Valmiera | RK Fēnikss - Dibināts 2005',
  description: 'Regbija klubs "Fēnikss" - Valmieras vadošais regbija klubs, dibināts 2005. gadā. Regbija klubs Valmierā apvieno dažāda vecuma un prasmju spēlētājus. Uzzini par spēlēm, jaunumiem un pievienojies mūsu komandai!',
  generator: 'v0.dev',
  keywords: ['regbija klubs', 'regbija klubs Valmiera', 'regbija klubs fēnikss', 'regbijs', 'Valmiera', 'Fēnikss', 'Latvijas regbijs', 'regbija spēles', 'regbija komanda', 'sporta klubs', 'komandas sports', 'rugby club', 'Latvia rugby', 'regbijs Valmierā'],
  authors: [{ name: 'RK Fēnikss' }],
  applicationName: 'RK Fēnikss Website',
  creator: 'RK Fēnikss',
  publisher: 'RK Fēnikss',
  category: 'Sports',
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL('https://www.fnx-rugby.lv'),
  alternates: {
    canonical: 'https://www.fnx-rugby.lv',
  },
  openGraph: {
    title: 'Regbija Klubs "Fēnikss" Valmiera | RK Fēnikss - Dibināts 2005',
    description: 'Regbija klubs "Fēnikss" - Valmieras vadošais regbija klubs, dibināts 2005. gadā. Regbija klubs Valmierā apvieno dažāda vecuma un prasmju spēlētājus.',
    url: 'https://www.fnx-rugby.lv',
    siteName: 'RK Fēnikss',
    images: [
      {
        url: 'https://www.fnx-rugby.lv/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RK Fēnikss - Valmieras Regbija Klubs',
      }
    ],
    locale: 'lv_LV',
    type: 'website',
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': 'RK Fēnikss - Valmieras Regbija Klubs'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regbija Klubs "Fēnikss" Valmiera | RK Fēnikss',
    description: 'Regbija klubs "Fēnikss" - Valmieras vadošais regbija klubs, dibināts 2005. gadā.',
    images: ['https://www.fnx-rugby.lv/og-image.jpg'],
    creator: '@RKFeniks',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Organization JSON-LD structured data for AI and search engines
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  '@id': 'https://www.fnx-rugby.lv/#organization',
  name: 'RK Fēnikss',
  alternateName: ['Regbija Klubs Fēnikss', 'RK Feniks', 'Fēnikss Rugby Club'],
  description: 'RK "Fēnikss" ir Valmieras vadošais regbija klubs, dibināts 2005. gadā. Klubs apvieno dažāda vecuma un prasmju spēlētājus vienotā komandā.',
  url: 'https://www.fnx-rugby.lv',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.fnx-rugby.lv/logo.png',
    width: 512,
    height: 512,
  },
  image: 'https://www.fnx-rugby.lv/og-image.jpg',
  foundingDate: '2005',
  sport: 'Rugby',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Valmiera',
    addressCountry: 'LV',
  },
  sameAs: [
    'https://www.facebook.com/RKFenikss',
    'https://www.instagram.com/rk_fenikss/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'info@fnx-rugby.lv',
    availableLanguage: ['Latvian', 'English'],
  },
}

// LocalBusiness JSON-LD for local search
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.fnx-rugby.lv/#localbusiness',
  name: 'RK Fēnikss - Valmieras Regbija Klubs',
  description: 'Regbija klubs Valmierā, Latvijā. Dibināts 2005. gadā.',
  url: 'https://www.fnx-rugby.lv',
  telephone: '+37129113938',
  email: 'rkfenikss@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kaimiņi, Brenguļi, Brenguļu pagasts',
    addressLocality: 'Valmieras novads',
    postalCode: 'LV-4245',
    addressCountry: 'LV',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 57.5388,
    longitude: 25.4263,
  },
  openingHours: ['Tu 18:00-20:00', 'Th 18:00-20:00'],
  sameAs: [
    'https://www.facebook.com/RKFenikss',
    'https://www.instagram.com/rk_fenikss/',
    'https://www.tiktok.com/@rk_fenikss',
  ],
}

// WebSite JSON-LD for search features
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.fnx-rugby.lv/#website',
  name: 'RK Fēnikss',
  url: 'https://www.fnx-rugby.lv',
  description: 'Regbija klubs "Fēnikss" oficiālā mājaslapa - Valmieras regbija klubs',
  publisher: {
    '@id': 'https://www.fnx-rugby.lv/#organization',
  },
  inLanguage: 'lv-LV',
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
      <html lang="lv" suppressHydrationWarning>
        <head>
          {/* Preconnect to critical third-party origins to reduce LCP delay */}
          {process.env.NEXT_PUBLIC_SUPABASE_URL && (
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
          )}
          <link rel="dns-prefetch" href="https://clerk.accounts.dev" />

          {/* JSON-LD Structured Data for AI and Search Engines */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteJsonLd),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(localBusinessJsonLd),
            }}
          />
          {/* AI Search Tool hints */}
          <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Information" />
        </head>
        <body
          className={cn(barlow.className, oswald.variable, barlowCondensed.variable, barlow.variable, 'min-h-screen bg-background')}
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
