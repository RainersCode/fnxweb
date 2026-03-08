import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Komanda | RK Fēnikss',
  description:
    'Iepazīsti RK Fēnikss regbija komandu — spēlētājus un trenerus. Valmieras regbija klubs, dibināts 2005. gadā.',
  keywords: [
    'regbija komanda',
    'regbijs spēlētāji',
    'Valmiera regbijs',
    'RK Fēnikss komanda',
    'Latvijas regbijs',
  ],
  openGraph: {
    title: 'Komanda | RK Fēnikss',
    description:
      'Iepazīsti RK Fēnikss regbija komandu — spēlētājus un trenerus. Valmieras regbija klubs, dibināts 2005. gadā.',
    url: 'https://www.fnx-rugby.lv/team',
  },
}

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
