'use client'

import { useState, useEffect } from 'react'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { Article } from '@/types/supabase'

interface FallbackNewsItem {
  title: string
  description: string
  image: string
}

type NewsItem = Article | FallbackNewsItem

interface HeroCarouselProps {
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

const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html.replace(/<[^>]*>/g, '')
  }
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export function HeroCarousel({ articles }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const newsItems: NewsItem[] = articles.length > 0 ? articles : fallbackNewsItems

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [newsItems.length])

  const getTitle = (item: NewsItem): string => item.title
  const getImageUrl = (item: NewsItem): string => {
    if ('id' in item) return item.image_url || '/placeholder.svg?height=1080&width=1920&text=Rugby News'
    return item.image
  }
  const getLink = (item: NewsItem, index: number): string => {
    if ('id' in item) return `/news/${item.id}`
    return `/news/${index + 1}`
  }
  const getDate = (item: NewsItem): string => {
    if ('id' in item) {
      return new Date(item.published_at).toLocaleDateString('lv-LV', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    }
    return '08 Mar 2026'
  }

  const currentItem = newsItems[currentSlide]

  return (
    <section className="relative h-[85vh] min-h-[550px] max-h-[780px] overflow-hidden">
      {/* Full-width hero image */}
      <div className="absolute inset-0">
        {newsItems.map((item, index) => (
          <div
            key={'id' in item ? item.id : index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <NextImage
              src={getImageUrl(item)}
              alt={getTitle(item)}
              fill
              sizes="100vw"
              className="object-cover scale-105 blur-[2px]"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        {/* Overlays to mask low-res artifacts */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      </div>

      {/* Bottom-left content */}
      <div className="absolute bottom-12 left-4 sm:left-8 md:left-16 z-10 max-w-[720px]">
        <Link href={getLink(currentItem, currentSlide)}>
          <h2 className="font-display text-[clamp(40px,5.5vw,76px)] font-bold uppercase text-white leading-[0.92] tracking-tight cursor-pointer hover:text-white/90 transition-colors">
            {getTitle(currentItem)}
          </h2>
        </Link>
        <div className="flex items-center gap-4 mt-5">
          <span className="font-cond text-sm font-semibold tracking-[2px] uppercase text-white/65">
            {getDate(currentItem)}
          </span>
          {/* Diamond play button */}
          <Link href={getLink(currentItem, currentSlide)}>
            <button className="w-10 h-10 border-2 border-white/50 grid place-items-center rotate-45 hover:border-white hover:bg-white/15 transition-all duration-200">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white -rotate-45">
                <polygon points="8,5 19,12 8,19" />
              </svg>
            </button>
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center gap-2 mt-6">
          {newsItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-[3px] transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-4 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Training sidebar (desktop only) */}
      <aside className="hidden xl:block w-[320px] bg-white absolute right-0 bottom-0 z-20 p-7">
        <div className="font-cond text-sm font-bold tracking-[2px] uppercase text-[#111] mb-1">
          Treniņu Laiki
        </div>
        <div className="h-px bg-[#e5e5e5] my-3.5" />

        <div className="flex flex-col">
          {[
            { day: 'Pirmdiena', time: '18:30 – 20:00', place: 'Valmiera, Daliņi' },
            { day: 'Otrdiena', time: '18:00 – 20:30', place: 'Brenguļu zāle' },
            { day: 'Piektdiena', time: '18:30 – 20:00', place: 'Brenguļu zāle' },
          ].map((item, i) => (
            <div key={item.day}>
              {i > 0 && <div className="h-px bg-[#e5e5e5] my-2" />}
              <div className="py-0.5">
                <div className="font-cond text-[13px] font-bold tracking-[2px] uppercase text-[#888]">
                  {item.day}
                </div>
                <div className="font-display text-lg font-bold text-teal-700 tracking-tight mt-0.5">
                  {item.time}
                </div>
                <div className="font-cond text-[10px] font-medium tracking-[1.5px] uppercase text-[#888] flex items-center gap-1 mt-0.5">
                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 stroke-current fill-none stroke-2 flex-shrink-0">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {item.place}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-px bg-[#e5e5e5] mt-4 mb-3.5" />
        <Link href="/contact">
          <button className="w-full py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase text-center hover:bg-teal-700 transition-colors duration-200">
            Pievienoties
          </button>
        </Link>
      </aside>
    </section>
  )
}
