import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regbija Noteikumi | RK Fēnikss',
  description:
    'Regbija noteikumi iesācējiem: kā gūst punktus, kas ir piezemējums, grupu cīņa, auts, raks, mols un aizmugure, un kādas ir spēlētāju pozīcijas.',
  keywords: [
    'regbija noteikumi',
    'kā spēlēt regbiju',
    'regbijs noteikumi',
    'regbija likumi',
    'regbijs latvijā',
    'regbijs iesācējiem',
  ],
  openGraph: {
    title: 'Regbija Noteikumi | RK Fēnikss',
    description:
      'Regbija noteikumi iesācējiem: kā gūst punktus, kas ir piezemējums, grupu cīņa, auts, raks, mols un aizmugure, un kādas ir spēlētāju pozīcijas.',
    url: 'https://www.fnx-rugby.lv/noteikumi',
  },
}

export default function NoteikumiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
