import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-teal-800">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-zinc-800">Lapa nav atrasta</h2>
          <p className="mt-2 text-lg text-zinc-600">
            Diemžēl meklētā lapa neeksistē vai ir pārvietota.
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild>
              <Link href="/" className="inline-flex items-center justify-center rounded-md">
                Atgriezties sākumlapā
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact" className="inline-flex items-center justify-center rounded-md">
                Sazināties ar mums
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center">
            <div className="h-24 w-24 animate-bounce opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full text-teal-700"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M8 15h8" />
                <path d="M9 9h.01" />
                <path d="M15 9h.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 