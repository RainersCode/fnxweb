import type { Metadata } from 'next'
import { pageUrl } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: pageUrl('/contact') },
  title: 'Kontakti | RK Fēnikss',
  description:
    'Sazinies ar RK Fēnikss regbija klubu: tālrunis, e-pasts, sociālie tīkli un ceļš uz Brenguļiem. Pievienojies mūsu regbija komandai!',
  keywords: [
    'regbija klubs kontakti',
    'Valmiera regbijs',
    'RK Fēnikss kontakti',
    'regbijs treniņi',
  ],
  openGraph: {
    title: 'Kontakti | RK Fēnikss',
    description:
      'Sazinies ar RK Fēnikss regbija klubu: tālrunis, e-pasts, sociālie tīkli un ceļš uz Brenguļiem. Pievienojies mūsu regbija komandai!',
    url: pageUrl('/contact'),
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
