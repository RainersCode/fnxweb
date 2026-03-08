'use client'

import { default as NextImage } from 'next/image'
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
    description: 'Treneris Viljams ir paziņojis jauno treniņu grafiku gaidāmajai sezonai.',
    image: '/placeholder.svg?height=1080&width=1920&text=Training Schedule',
  },
  {
    title: 'KOPIENAS LĪDZEKĻU VĀKŠANAS PANĀKUMI',
    description: 'Mūsu nesenā kopienas līdzekļu vākšana ienesa vairāk nekā 2000 mārciņu jaunam treniņu aprīkojumam.',
    image: '/placeholder.svg?height=1080&width=1920&text=Fundraiser',
  },
]

const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') return html.replace(/<[^>]*>/g, '')
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export function HomeNewsSection({ articles }: HomeNewsSectionProps) {
  const displayItems = articles.length > 0 ? articles : null
  const allItems = displayItems ? articles.slice(0, 4) : fallbackNewsItems
  const featured = allItems[0]
  const cards = allItems.slice(1, 4)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth * 0.85 + 16
      const newIndex = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(newIndex, allItems.length - 1))
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [allItems.length])

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth * 0.85 + 16
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
  }

  const getImageUrl = (item: Article | FallbackNewsItem): string => {
    if ('id' in item) return item.image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'
    return item.image
  }
  const getTitle = (item: Article | FallbackNewsItem): string => item.title
  const getDate = (item: Article | FallbackNewsItem): string => {
    if ('id' in item) {
      return new Date(item.published_at).toLocaleDateString('lv-LV', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    }
    return '15 Apr 2025'
  }
  const getLink = (item: Article | FallbackNewsItem, index: number): string => {
    if ('id' in item) return `/news/${item.id}`
    return `/news/${index + 1}`
  }
  const getContent = (item: Article | FallbackNewsItem): string => {
    if ('id' in item) return stripHtml(item.content).substring(0, 120)
    return item.description
  }

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-[clamp(52px,6vw,86px)] font-bold uppercase text-teal-700 leading-[0.88] tracking-tight">
            Jaunākās<br />Ziņas
          </h2>
          <Link href="/news">
            <button className="hidden md:inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
              Skatīt visas
            </button>
          </Link>
        </div>

        {/* Featured article - split layout (desktop) */}
        {featured && (
          <Link href={getLink(featured, 0)} className="group">
            <div className="hidden md:grid grid-cols-[1fr_1.4fr] min-h-[440px] mb-6 cursor-pointer">
              {/* Left text panel */}
              <div className="bg-[#f5f5f5] p-12 flex flex-col justify-end">
                <h3 className="font-display text-[clamp(26px,3vw,38px)] font-bold uppercase leading-[0.98] text-[#111]">
                  {getTitle(featured)}
                </h3>
                <div className="flex items-center gap-3.5 mt-6">
                  <span className="font-cond text-[13px] font-semibold tracking-[2px] uppercase text-[#888]">
                    {getDate(featured)}
                  </span>
                  {/* Diamond button */}
                  <button className="w-[34px] h-[34px] border-2 border-[#111] grid place-items-center rotate-45 hover:bg-black/5 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#111] -rotate-45">
                      <polygon points="8,5 19,12 8,19" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Right image */}
              <div className="overflow-hidden">
                <div className="relative h-full">
                  <NextImage
                    src={getImageUrl(featured)}
                    alt={getTitle(featured)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Mobile: swipable carousel for all items */}
        <div className="md:hidden mb-8">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allItems.map((item, index) => (
              <div key={'id' in item ? item.id : index} className="flex-shrink-0 w-[85%] snap-center">
                <MobileNewsCard item={item} index={index} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-0 mt-4">
            {allItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToCard(index)}
                className="p-3 flex items-center justify-center"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span className={`block h-[3px] transition-all duration-300 ${
                  activeIndex === index ? 'bg-teal-700 w-6' : 'bg-gray-300 hover:bg-gray-400 w-3'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* 3 smaller cards below featured (desktop) */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {cards.map((item, index) => (
            <Link key={'id' in item ? item.id : index} href={getLink(item, index + 1)} className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
              <div className="h-[260px] overflow-hidden mb-3.5">
                <div className="relative h-full">
                  <NextImage
                    src={getImageUrl(item)}
                    alt={getTitle(item)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold uppercase leading-[1.05] text-[#111] tracking-wide">
                {getTitle(item)}
              </h3>
              <div className="font-cond text-xs font-medium tracking-[1.5px] uppercase text-[#888] mt-2">
                {getDate(item)}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden mt-6 text-center">
          <Link href="/news">
            <button className="inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
              Skatīt visas ziņas
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function MobileNewsCard({ item, index }: { item: Article | FallbackNewsItem; index: number }) {
  const imageUrl = 'id' in item ? (item.image_url || '/placeholder.svg') : item.image
  const href = 'id' in item ? `/news/${item.id}` : `/news/${index + 1}`
  const date = 'id' in item
    ? new Date(item.published_at).toLocaleDateString('lv-LV', { day: '2-digit', month: 'short', year: 'numeric' })
    : '15 Apr 2025'

  return (
    <Link href={href} className="group block">
      <div className="h-[200px] overflow-hidden mb-3">
        <div className="relative h-full">
          <NextImage src={imageUrl} alt={item.title} fill className="object-cover" />
        </div>
      </div>
      <h3 className="font-display text-lg font-bold uppercase leading-tight text-[#111]">
        {item.title}
      </h3>
      <div className="font-cond text-xs font-medium tracking-[1.5px] uppercase text-[#888] mt-2">
        {date}
      </div>
    </Link>
  )
}
