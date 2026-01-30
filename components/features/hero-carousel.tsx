'use client'

import { useState, useEffect } from 'react'
import { default as NextImage } from 'next/image'
import { ChevronLeft, ChevronRight, CalendarDays, ArrowRight } from 'lucide-react'
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

// Helper function to strip HTML tags
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: simple regex removal
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1))
  }

  const getCurrentItem = () => {
    return newsItems[currentSlide]
  }

  const getTitle = (item: NewsItem): string => {
    return item.title
  }

  const getDescription = (item: NewsItem): string => {
    if ('id' in item) {
      return stripHtml(item.content).substring(0, 180) + '...'
    }
    return item.description
  }

  const getImageUrl = (item: NewsItem): string => {
    if ('id' in item) {
      return item.image_url || '/placeholder.svg?height=1080&width=1920&text=Rugby News'
    }
    return item.image
  }

  const getLink = (item: NewsItem, index: number): string => {
    if ('id' in item) {
      return `/news/${item.id}`
    }
    return `/news/${index + 1}`
  }

  return (
    <section className="relative min-h-[85vh] bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 overflow-hidden">
      {/* Blurred article image background */}
      <div className="absolute inset-0 z-0">
        {newsItems.map((item, index) => (
          <div
            key={'id' in item ? item.id : index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <NextImage
              src={getImageUrl(item)}
              alt=""
              fill
              sizes="100vw"
              className="object-cover blur-2xl scale-110"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLTtRuLC8iu7WVo54W3I6nkGtDg+RXOr6Xp9ze3E00NuiTSBmKIOc5ycY71SlTiqUWU7M51kXaij/9k="
            />
          </div>
        ))}
        {/* Overlay to make it light and blend with teal */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/70 via-teal-800/60 to-teal-900/70" />
      </div>

      {/* Decorative skewed lines */}
      <div className="absolute top-20 left-0 w-64 h-1 bg-teal-400/20 skew-x-[-12deg] z-10" />
      <div className="absolute top-28 left-0 w-32 h-1 bg-teal-400/10 skew-x-[-12deg] z-10" />
      <div className="absolute bottom-32 right-0 w-48 h-1 bg-teal-400/20 skew-x-[-12deg] z-10" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh] py-12">

          {/* Left Content */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-0.5 bg-teal-400 skew-x-[-12deg]" />
              <span className="text-sm font-bold uppercase tracking-widest text-teal-300">Jaunākās Ziņas</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold uppercase leading-tight tracking-tighter text-white mb-6">
              {getTitle(getCurrentItem())}
            </h1>

            {/* Description */}
            <p className="text-lg text-teal-100/80 leading-relaxed mb-8 max-w-lg">
              {getDescription(getCurrentItem())}
            </p>

            {/* CTA Button */}
            <div className="flex items-center gap-6">
              <Link
                href={getLink(getCurrentItem(), currentSlide)}
                className="group"
              >
                <button className="animate-glow-border skew-x-[-12deg] transform bg-white px-8 py-4 font-bold tracking-wide text-teal-900 shadow-xl transition-all duration-300 hover:bg-teal-50 hover:scale-105">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    LASĪT VAIRĀK
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>

              {/* Slide indicators */}
              <div className="hidden sm:flex items-center gap-0">
                {newsItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className="p-3 flex items-center justify-center"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <span className={`block h-2 skew-x-[-12deg] transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-10 bg-teal-400'
                        : 'w-6 bg-white/30 hover:bg-white/50'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={prevSlide}
                className="skew-x-[-12deg] transform bg-white/10 border border-white/20 p-3 text-white transition-all duration-300 hover:bg-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 skew-x-[12deg] transform" />
              </button>
              <button
                onClick={nextSlide}
                className="skew-x-[-12deg] transform bg-white/10 border border-white/20 p-3 text-white transition-all duration-300 hover:bg-white/20"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 skew-x-[12deg] transform" />
              </button>
              <span className="ml-2 text-sm text-teal-300/70">
                {String(currentSlide + 1).padStart(2, '0')} / {String(newsItems.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            {/* Simple image frame */}
            <div className="relative overflow-hidden shadow-2xl border-b-4 border-teal-400">
              {/* Image carousel */}
              <div className="relative aspect-[4/3] bg-teal-800">
                {newsItems.map((item, index) => (
                  <div
                    key={'id' in item ? item.id : index}
                    className={`absolute inset-0 transition-all duration-700 ${
                      index === currentSlide
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <NextImage
                      src={getImageUrl(item)}
                      alt={getTitle(item)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLTtRuLC8iu7WVo54W3I6nkGtDg+RXOr6Xp9ze3E00NuiTSBmKIOc5ycY71SlTiqUWU7M51kXaij/9k="
                    />
                  </div>
                ))}
              </div>

              {/* Date badge */}
              {articles.length > 0 && currentSlide < articles.length && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="skew-x-[-12deg] transform bg-teal-700/90 backdrop-blur-sm px-4 py-2">
                    <div className="skew-x-[12deg] transform flex items-center gap-2 text-white">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {new Date(articles[currentSlide].published_at).toLocaleDateString('lv-LV', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile slide indicators */}
            <div className="flex sm:hidden items-center justify-center gap-0 mt-6">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="p-3 flex items-center justify-center"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span className={`block h-2 skew-x-[-12deg] transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-10 bg-teal-400'
                      : 'w-6 bg-white/30 hover:bg-white/50'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
