import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakti | RK Fēnikss',
  description:
    'Sazinies ar RK Fēnikss regbija klubu Valmierā. Adrese, telefons, e-pasts un treniņu laiki. Pievienojies mūsu regbija komandai!',
  keywords: [
    'regbija klubs kontakti',
    'Valmiera regbijs',
    'RK Fēnikss kontakti',
    'regbijs treniņi',
  ],
  openGraph: {
    title: 'Kontakti | RK Fēnikss',
    description:
      'Sazinies ar RK Fēnikss regbija klubu Valmierā. Adrese, telefons, e-pasts un treniņu laiki. Pievienojies mūsu regbija komandai!',
    url: 'https://www.fnx-rugby.lv/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
