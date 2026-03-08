'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { default as NextImage } from 'next/image'
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { prepareImagePath } from '@/lib/supabase'
import { Gallery, GalleryImage } from '@/types/supabase'

interface GalleryDetailClientProps {
  gallery: Gallery | null
  images: GalleryImage[]
}

export function GalleryDetailClient({ gallery, images }: GalleryDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeImageViewer = useCallback(() => {
    setCurrentImageIndex(null)
    document.body.style.overflow = ''
  }, [])

  const navigateToNextImage = useCallback(() => {
    if (currentImageIndex === null || !images.length) return
    setCurrentImageIndex((currentImageIndex + 1) % images.length)
  }, [currentImageIndex, images.length])

  const navigateToPreviousImage = useCallback(() => {
    if (currentImageIndex === null || !images.length) return
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)
  }, [currentImageIndex, images.length])

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('lv-LV', options)
  }

  const getImageUrl = (url: string | null) => {
    return prepareImagePath(url)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentImageIndex === null) return

      if (e.key === 'Escape') {
        closeImageViewer()
      } else if (e.key === 'ArrowRight') {
        navigateToNextImage()
      } else if (e.key === 'ArrowLeft') {
        navigateToPreviousImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentImageIndex, closeImageViewer, navigateToNextImage, navigateToPreviousImage])

  if (!gallery) {
    return (
      <MainLayout currentPage="GALLERY">
        <main className="flex-1">
          <div className="min-h-[60vh] flex items-center justify-center bg-white">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="relative w-16 h-16 mx-auto mb-5 opacity-30">
                <NextImage src="/Logo/fēniks_logo-removebg-preview.png" alt="Fēnikss" fill className="object-contain" />
              </div>
              <h2 className="font-display text-3xl font-bold uppercase text-[#111] mb-3">Galerija nav atrasta</h2>
              <p className="font-cond text-xs tracking-[2px] uppercase text-[#888] mb-8">Meklētā galerija neeksistē vai ir dzēsta</p>
              <Link href="/gallery">
                <button className="inline-flex items-center gap-2 px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" /> Atpakaļ uz galerijām
                </button>
              </Link>
            </div>
          </div>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentPage="GALLERY">
      <main className="flex-1">
        {/* Hero header for gallery */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] bg-stripes-dark overflow-hidden">
          <div className="absolute inset-0">
            {images.length > 0 && (
              <img
                src={getImageUrl(images[0].image_url)}
                alt={gallery.title}
                className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex flex-col justify-end pb-12">
            <Link href="/gallery" className="inline-flex items-center gap-2 mb-6 group">
              <span className="font-cond text-sm font-bold tracking-[2px] uppercase text-white/70 group-hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 inline mr-1 transition-transform group-hover:-translate-x-1" />
                Galerija
              </span>
            </Link>
            <h1 className="font-display text-[clamp(28px,4vw,52px)] font-bold uppercase text-white leading-[0.95] tracking-tight max-w-[800px]">
              {gallery.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-5">
              <span className="font-cond text-sm font-semibold tracking-[2px] uppercase text-white/65">
                {formatDate(gallery.created_at || new Date().toISOString())}
              </span>
              {images.length > 0 && (
                <>
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  <span className="font-cond text-sm font-semibold tracking-[2px] uppercase text-white/65">
                    {images.length} foto
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Gallery images section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="group cursor-pointer overflow-hidden"
                    onClick={() => openImageViewer(index)}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={getImageUrl(image.image_url)}
                        alt={image.caption || `Attēls ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 stroke-current fill-none stroke-2"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative w-16 h-16 mx-auto mb-5 opacity-30">
                  <NextImage src="/Logo/fēniks_logo-removebg-preview.png" alt="Fēnikss" fill className="object-contain" />
                </div>
                <h2 className="font-display text-2xl font-bold uppercase text-[#111] mb-3">Nav attēlu</h2>
                <p className="font-cond text-xs tracking-[2px] uppercase text-[#888]">Šajā galerijā pašlaik nav pievienotu attēlu</p>
              </div>
            )}
          </div>
        </section>

        {/* Image viewer overlay */}
        {currentImageIndex !== null && images.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
            {/* Close button */}
            <button
              onClick={closeImageViewer}
              className="absolute right-4 top-4 z-20 bg-white/10 p-3 text-white transition-all duration-300 hover:bg-white/20"
              aria-label="Aizvērt"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/10 px-4 py-2">
              <span className="text-white font-medium">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>

            {/* Previous image button */}
            <button
              onClick={navigateToPreviousImage}
              className="absolute left-4 z-20 bg-white/10 p-3 text-white transition-all duration-300 hover:bg-white/20 md:left-8"
              aria-label="Iepriekšējais attēls"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Next image button */}
            <button
              onClick={navigateToNextImage}
              className="absolute right-4 z-20 bg-white/10 p-3 text-white transition-all duration-300 hover:bg-white/20 md:right-8"
              aria-label="Nākamais attēls"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Image container */}
            <div className="relative h-full w-full flex items-center justify-center p-16">
              <img
                src={getImageUrl(images[currentImageIndex].image_url)}
                alt={images[currentImageIndex].caption || `Attēls ${currentImageIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />

              {/* Caption */}
              {images[currentImageIndex].caption && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl bg-black/60 backdrop-blur-sm px-6 py-3 text-center">
                  <p className="text-white">{images[currentImageIndex].caption}</p>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex gap-2 bg-black/40 backdrop-blur-sm p-2 max-w-3xl overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 overflow-hidden transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'ring-2 ring-teal-400 scale-110'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getImageUrl(image.image_url)}
                    alt={`Sīktēls ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  )
}
