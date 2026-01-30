'use client'

import { default as NextImage } from 'next/image'
import { Camera, ImageIcon, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Gallery } from '@/types/supabase'
import { useState, useRef, useEffect } from 'react'

interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string | null
}

interface HomeGallerySectionProps {
  galleries: GalleryWithThumbnail[]
}

// Helper function to check if a URL is an SVG
const isSvgUrl = (url: string | null): boolean => {
  if (!url) return false
  return url.toLowerCase().endsWith('.svg') || url.includes('/svg')
}

// Helper function to get the image URL
const getImageUrl = (url: string | null): string => {
  if (!url) return '/placeholder.svg'

  // If it's an SVG, use a placeholder instead
  if (isSvgUrl(url)) {
    return '/placeholder.svg?height=300&width=400&text=Gallery'
  }

  // If it's already a valid HTTP URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If it's a storage URL from Supabase, ensure it's properly formatted
  if (url.includes('supabase')) {
    return url.replace(/\s/g, '%20')
  }

  return url
}

// Gallery card component to avoid duplication
interface GalleryCardProps {
  gallery: GalleryWithThumbnail
  isLarge?: boolean
}

function GalleryCard({ gallery, isLarge = false }: GalleryCardProps) {
  return (
    <Link href={`/gallery/${gallery.id}`} className="group block h-full">
      <div className={`relative overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl h-72 ${isLarge ? 'sm:h-full' : ''}`}>
        {/* Image */}
        {gallery.thumbnailUrl ? (
          isSvgUrl(gallery.thumbnailUrl) ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
              <div className="text-center">
                <ImageIcon className="mx-auto h-16 w-16 text-teal-800/30" />
                <p className="mt-2 text-sm font-medium text-teal-800/50">{gallery.title}</p>
              </div>
            </div>
          ) : (
            <NextImage
              src={getImageUrl(gallery.thumbnailUrl)}
              alt={gallery.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
            <div className="text-center">
              <ImageIcon className="mx-auto h-16 w-16 text-teal-800/30" />
              <p className="mt-2 text-sm font-medium text-teal-800/50">{gallery.title}</p>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/30 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Corner accent */}
        <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-4 w-4 text-teal-300" />
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">Galerija</span>
            </div>
            <h3 className={`font-bold text-white tracking-tight ${isLarge ? 'text-2xl' : 'text-lg'}`}>
              {gallery.title}
            </h3>
            {gallery.description && (
              <p className="line-clamp-2 text-sm text-teal-100/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {gallery.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-sm font-semibold">Skatīt galeriju</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function HomeGallerySection({ galleries }: HomeGallerySectionProps) {
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
      setActiveIndex(Math.min(newIndex, galleries.length - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [galleries.length])

  // Scroll to specific card when dot is clicked
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    const cardWidth = container.offsetWidth * 0.85 + 16
    container.scrollTo({ left: cardWidth * index, behavior: 'smooth' })
  }

  return (
    <section className="relative py-20 bg-gradient-to-b from-white via-teal-50/30 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-16 left-0 w-40 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
      <div className="absolute top-20 left-0 w-24 h-0.5 bg-teal-700/5 skew-x-[-12deg]" />
      <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
            <Camera className="h-5 w-5 text-teal-600" />
            <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <span className="text-teal-900">FOTO </span>
            <span className="text-teal-600 italic font-light">GALERIJA</span>
          </h2>
          <p className="mt-4 text-zinc-600 max-w-md mx-auto">
            Iemūžināti mirkļi no mūsu spēlēm, treniņiem un pasākumiem
          </p>
          <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
        </div>

        {/* Empty state */}
        {galleries.length === 0 ? (
          <div className="mb-12 bg-teal-50 border border-teal-100 p-8 text-center">
            <Camera className="mx-auto h-12 w-12 text-teal-300 mb-3" />
            <p className="text-lg font-medium text-teal-800">Drīzumā sekojiet galerijas atjauninājumiem!</p>
          </div>
        ) : (
          <>
            {/* Mobile Swipable Carousel - visible only on small screens */}
            <div className="sm:hidden mb-12">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {galleries.map((gallery) => (
                  <div
                    key={gallery.id}
                    className="flex-shrink-0 w-[85%] snap-center"
                  >
                    <GalleryCard gallery={gallery} />
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              <div className="flex justify-center gap-0 mt-4">
                {galleries.map((_, index) => (
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
            <div className="hidden sm:grid mb-12 grid-cols-2 gap-6 lg:grid-cols-4">
              {galleries.map((gallery, index) => (
                <div
                  key={gallery.id}
                  className={index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
                >
                  <GalleryCard gallery={gallery} isLarge={index === 0} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/gallery" className="group inline-block">
            <button className="skew-x-[-12deg] transform bg-teal-800 px-8 py-4 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-teal-900 hover:shadow-xl">
              <span className="inline-flex skew-x-[12deg] transform items-center">
                SKATĪT VISAS GALERIJAS
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
