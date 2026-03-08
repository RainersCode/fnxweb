'use client'

import { default as NextImage } from 'next/image'
import { ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { Gallery } from '@/types/supabase'
import { useState, useRef, useEffect } from 'react'

interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string | null
}

interface HomeGallerySectionProps {
  galleries: GalleryWithThumbnail[]
}

const isSvgUrl = (url: string | null): boolean => {
  if (!url) return false
  return url.toLowerCase().endsWith('.svg') || url.includes('/svg')
}

const getImageUrl = (url: string | null): string => {
  if (!url) return '/placeholder.svg'
  if (isSvgUrl(url)) return '/placeholder.svg?height=300&width=400&text=Gallery'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.includes('supabase')) return url.replace(/\s/g, '%20')
  return url
}

export function HomeGallerySection({ galleries }: HomeGallerySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth * 0.85 + 16
      const newIndex = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(newIndex, galleries.length - 1))
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [galleries.length])

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth * 0.85 + 16
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-[#111] bg-stripes-dark">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-[clamp(52px,6vw,86px)] font-bold uppercase text-teal-400 leading-[0.88] tracking-tight">
            Galerija
          </h2>
          <Link href="/gallery">
            <button className="hidden md:inline-flex items-center px-9 py-3.5 bg-white/10 text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200 border border-white/20">
              Skatīt visas
            </button>
          </Link>
        </div>

        {galleries.length === 0 ? (
          <div className="mb-12 bg-white/5 border border-white/10 p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-white/20 mb-3" />
            <p className="text-lg font-medium text-white/60">Drīzumā sekojiet galerijas atjauninājumiem!</p>
          </div>
        ) : (
          <>
            {/* Mobile carousel */}
            <div className="md:hidden mb-12">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {galleries.map((gallery) => (
                  <div key={gallery.id} className="flex-shrink-0 w-[85%] snap-center">
                    <GalleryCard gallery={gallery} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-0 mt-4">
                {galleries.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToCard(index)}
                    className="p-3 flex items-center justify-center"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <span className={`block h-[3px] transition-all duration-300 ${
                      activeIndex === index ? 'bg-teal-400 w-6' : 'bg-white/30 hover:bg-white/50 w-3'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
              {galleries.map((gallery, index) => (
                <GalleryCard key={gallery.id} gallery={gallery} index={index} />
              ))}
            </div>
          </>
        )}

        {/* Mobile CTA */}
        <div className="md:hidden mt-6 text-center">
          <Link href="/gallery">
            <button className="inline-flex items-center px-9 py-3.5 bg-white/10 text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200 border border-white/20">
              Skatīt visas galerijas
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

function GalleryCard({ gallery, index = 0 }: { gallery: GalleryWithThumbnail; index?: number }) {
  const tagColors = ['bg-[#c2185b]', 'bg-[#c2185b]', 'bg-teal-700', 'bg-teal-700']

  return (
    <Link href={`/gallery/${gallery.id}`} className="group block">
      <div className="relative h-[340px] overflow-hidden cursor-pointer">
        {/* Image */}
        {gallery.thumbnailUrl && !isSvgUrl(gallery.thumbnailUrl) ? (
          <NextImage
            src={getImageUrl(gallery.thumbnailUrl)}
            alt={gallery.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <ImageIcon className="h-16 w-16 text-white/20" />
          </div>
        )}

        {/* Diamond icon top-right */}
        <div className="absolute top-4 right-4 w-9 h-9 border-2 border-white/40 bg-white/10 backdrop-blur-sm grid place-items-center rotate-45">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-white fill-none stroke-2 -rotate-45">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="font-display text-[17px] font-bold uppercase text-white leading-[1.1] tracking-wide">
            {gallery.title}
          </h3>
          <div className="font-cond text-[11px] font-medium tracking-[1.5px] uppercase text-white/50 mt-1.5">
            {gallery.description || 'Fotogrāfijas'}
          </div>
        </div>
      </div>
    </Link>
  )
}
