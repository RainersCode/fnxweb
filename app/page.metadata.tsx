import type { Metadata } from 'next'
import { generateOrganizationSchema } from '@/lib/structured-data'

export function generateMetadata(): Metadata {
  const organizationJsonLd = generateOrganizationSchema()
  
  return {
    title: 'RK "Fēnikss" - Valmieras Regbija Klubs | Dibināts 2005',
    description: 'RK "Fēnikss" oficiālā mājaslapa - Valmieras vadošais regbija klubs, dibināts 2005. gadā. Pievienojieties mums, lai uzzinātu par spēlēm, jaunumiem, komandas sastāvu un treneriem.',
    keywords: ['regbijs', 'Valmiera', 'Fēnikss', 'sporta klubs', 'Latvijas regbijs', 'regbija spēles', 'regbija komanda'],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'RK "Fēnikss" - Valmieras Regbija Klubs | Dibināts 2005',
      description: 'RK "Fēnikss" oficiālā mājaslapa - Valmieras vadošais regbija klubs, dibināts 2005. gadā.',
      url: 'https://feniks-rugby.com/',
      siteName: 'RK Fēnikss',
      locale: 'lv_LV',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'RK "Fēnikss" - Valmieras Regbija Klubs',
      description: 'RK "Fēnikss" oficiālā mājaslapa - Valmieras vadošais regbija klubs, dibināts 2005. gadā.',
    },
    other: {
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': 'RK Fēnikss Logo',
      'twitter:image:alt': 'RK Fēnikss Logo',
      'application-name': 'RK Fēnikss',
      'apple-mobile-web-app-title': 'RK Fēnikss',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#006644',
      'msapplication-tap-highlight': 'no',
      'theme-color': '#ffffff',
      'google-site-verification': 'your-google-verification-code',
    },
  }
} 