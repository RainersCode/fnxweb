'use client'

import { default as NextImage } from 'next/image'
import { CalendarDays, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Article } from '@/types/supabase'

interface FallbackNewsItem {
  title: string
  description: string
  image: string
}

interface HomeNewsSectionProps {
  articles: Article[]
}

const fallbackNewsItems: FallbackNewsItem[] = [
  {
    title: 'SEZONAS ATKLĀŠANA ŠO SESTDIEN',
    description: 'Pievienojieties mums sezonas pirmajā spēlē pret vietējiem sāncenšiem.',
    image: '/placeholder.svg?height=1080&width=1920&text=Season Opener',
  },
  {
    title: 'JAUNS TRENIŅU GRAFIKS',
    description:
      'Treneris Viljams ir paziņojis jauno treniņu grafiku gaidāmajai sezonai.',
    image: '/placeholder.svg?height=1080&width=1920&text=Training Schedule',
  },
  {
    title: 'KOPIENAS LĪDZEKĻU VĀKŠANAS PANĀKUMI',
    description: 'Mūsu nesenā kopienas līdzekļu vākšana ienesa vairāk nekā 2000 mārciņu jaunam treniņu aprīkojumam.',
    image: '/placeholder.svg?height=1080&width=1920&text=Fundraiser',
  },
]

// Helper function to strip HTML tags
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '')
  }
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export function HomeNewsSection({ articles }: HomeNewsSectionProps) {
  const displayItems = articles.length > 0 ? articles : fallbackNewsItems

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
      <div className="absolute top-16 right-0 w-48 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
      <div className="absolute bottom-16 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
            <span className="text-sm font-bold uppercase tracking-widest text-teal-600">Aktualitātes</span>
            <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <span className="text-teal-900">JAUNĀKĀS </span>
            <span className="text-teal-600 italic font-light">ZIŅAS</span>
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
        </div>

        {/* News Grid */}
        <div className="mb-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0
            ? articles.slice(0, 3).map((article, index) => (
                <Link href={`/news/${article.id}`} key={article.id} className="group block">
                  <div className="relative h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-b-4 border-teal-700">
                    {/* Featured badge for first article */}
                    {index === 0 && (
                      <div className="absolute top-4 left-0 z-20 bg-teal-700 px-4 py-1 skew-x-[-12deg] -translate-x-1">
                        <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">Jaunākais</span>
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <NextImage
                        src={article.image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Date overlay */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                        <CalendarDays className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {new Date(article.published_at).toLocaleDateString('lv-LV', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="mt-3 text-sm text-zinc-600 line-clamp-3">
                        {(() => {
                          const plainText = stripHtml(article.content)
                          return plainText.length > 120 ? `${plainText.substring(0, 120)}...` : plainText
                        })()}
                      </p>

                      <div className="mt-5 flex items-center text-teal-700 font-semibold text-sm group-hover:text-teal-600 transition-colors">
                        <span>LASĪT VAIRĀK</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            : fallbackNewsItems.slice(0, 3).map((item, index) => (
                <Link href={`/news/${index + 1}`} key={index} className="group block">
                  <div className="relative h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-b-4 border-teal-700">
                    {index === 0 && (
                      <div className="absolute top-4 left-0 z-20 bg-teal-700 px-4 py-1 skew-x-[-12deg] -translate-x-1">
                        <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">Jaunākais</span>
                      </div>
                    )}

                    <div className="relative h-56 overflow-hidden">
                      <NextImage
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                        <CalendarDays className="h-4 w-4" />
                        <span className="text-sm font-medium">2023. gada 15. apr.</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm text-zinc-600 line-clamp-3">{item.description}</p>
                      <div className="mt-5 flex items-center text-teal-700 font-semibold text-sm group-hover:text-teal-600 transition-colors">
                        <span>LASĪT VAIRĀK</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link href="/news" className="group">
            <button className="skew-x-[-12deg] transform bg-teal-800 px-8 py-4 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-teal-900 hover:shadow-xl">
              <span className="inline-flex skew-x-[12deg] transform items-center">
                SKATĪT VISAS ZIŅAS
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
