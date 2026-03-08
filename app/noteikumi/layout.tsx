import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regbija Noteikumi | RK Fēnikss',
  description:
    'Uzzini regbija noteikumus — kā spēlēt regbiju, punktu gūšana, spēlētāju pozīcijas un spēles pamati. Pilns regbija noteikumu skaidrojums latviski.',
  keywords: [
    'regbija noteikumi',
    'kā spēlēt regbiju',
    'regbijs noteikumi',
    'regbija likumi',
    'regbijs latvijā',
  ],
  openGraph: {
    title: 'Regbija Noteikumi | RK Fēnikss',
    description:
      'Uzzini regbija noteikumus — kā spēlēt regbiju, punktu gūšana, spēlētāju pozīcijas un spēles pamati. Pilns regbija noteikumu skaidrojums latviski.',
    url: 'https://www.fnx-rugby.lv/noteikumi',
  },
}

export default function NoteikumiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
