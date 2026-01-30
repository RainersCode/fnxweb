'use client'

import { default as NextImage } from 'next/image'
import { CalendarDays, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Article } from '@/types/supabase'
import { useState, useRef, useEffect } from 'react'

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

// News card component to avoid duplication
interface NewsCardProps {
  article?: Article
  fallbackItem?: FallbackNewsItem
  index: number
  isFirst: boolean
}

function NewsCard({ article, fallbackItem, index, isFirst }: NewsCardProps) {
  const item = article || fallbackItem
  if (!item) return null

  const isArticle = 'id' in item
  const href = isArticle ? `/news/${(item as Article).id}` : `/news/${index + 1}`
  const imageUrl = isArticle
    ? (item as Article).image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'
    : (item as FallbackNewsItem).image
  const title = item.title
  const content = isArticle ? stripHtml((item as Article).content) : (item as FallbackNewsItem).description
  const displayContent = content.length > 120 ? `${content.substring(0, 120)}...` : content
  const date = isArticle
    ? new Date((item as Article).published_at).toLocaleDateString('lv-LV', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '2023. gada 15. apr.'

  return (
    <Link href={href} className="group block h-full">
      <div className="relative h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-b-4 border-teal-700">
        {/* Featured badge for first article */}
        {isFirst && (
          <div className="absolute top-4 left-0 z-20 bg-teal-700 px-4 py-1 skew-x-[-12deg] -translate-x-1">
            <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">Jaunākais</span>
          </div>
        )}

        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <NextImage
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Date overlay */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm font-medium">{date}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="mt-3 text-sm text-zinc-600 line-clamp-3">
            {displayContent}
          </p>

          <div className="mt-5 flex items-center text-teal-700 font-semibold text-sm group-hover:text-teal-600 transition-colors">
            <span>LASĪT VAIRĀK</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function HomeNewsSection({ articles }: HomeNewsSectionProps) {
  const displayItems = articles.length > 0 ? articles : null
  const itemsToShow = displayItems ? articles.slice(0, 3) : fallbackNewsItems.slice(0, 3)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Handle scroll to update active dot indicator
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth * 0.85 + 16 // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(newIndex, itemsToShow.length - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [itemsToShow.length])

  // Scroll to specific card when dot is clicked
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth * 0.85 + 16
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
  }

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

        {/* Mobile Swipable Carousel - visible only on small screens */}
        <div className="md:hidden mb-12">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {itemsToShow.map((item, index) => (
              <div
                key={'id' in item ? item.id : index}
                className="flex-shrink-0 w-[85%] snap-center"
              >
                {'id' in item ? (
                  <NewsCard article={item as Article} index={index} isFirst={index === 0} />
                ) : (
                  <NewsCard fallbackItem={item as FallbackNewsItem} index={index} isFirst={index === 0} />
                )}
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-0 mt-4">
            {itemsToShow.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className="p-3 flex items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span className={`block h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'bg-teal-700 w-6'
                    : 'bg-teal-300 hover:bg-teal-400 w-2'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet Grid - hidden on small screens */}
        <div className="hidden md:grid mb-12 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {itemsToShow.map((item, index) => (
            <div key={'id' in item ? item.id : index}>
              {'id' in item ? (
                <NewsCard article={item as Article} index={index} isFirst={index === 0} />
              ) : (
                <NewsCard fallbackItem={item as FallbackNewsItem} index={index} isFirst={index === 0} />
              )}
            </div>
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
