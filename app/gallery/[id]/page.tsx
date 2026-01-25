'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, X, ChevronLeft, ChevronRight, Camera, CalendarDays, Images, ZoomIn } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { Gallery, GalleryImage } from '@/types/supabase'

export default function GalleryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null)

  // Get the gallery ID from the URL
  const id = params.id as string

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true)
      try {
        // Fetch gallery details
        const { data: galleryData, error: galleryError } = await supabase
          .from('galleries')
          .select('*')
          .eq('id', id)
          .single()

        if (galleryError) {
          console.error('Error fetching gallery:', galleryError)
          throw galleryError
        }

        // Fetch gallery images
        const { data: imagesData, error: imagesError } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('gallery_id', id)

        if (imagesError) {
          console.error('Error fetching gallery images:', imagesError)
          throw imagesError
        }

        if (imagesData && imagesData.length > 0) {
          // Detect what ordering column the database uses
          let orderedImagesData = imagesData
          if (imagesData[0].hasOwnProperty('order')) {
            orderedImagesData = [...imagesData].sort((a, b) => (a.order || 0) - (b.order || 0))
          } else if (imagesData[0].hasOwnProperty('display_order')) {
            orderedImagesData = [...imagesData].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          }
          setImages(orderedImagesData)
        } else {
          setImages([])
        }

        setGallery(galleryData)
      } catch (error) {
        console.error('Error fetching gallery:', error)
        setGallery(null)
        setImages([])
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchGallery()
    }
  }, [id])

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

  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('lv-LV', options)
  }

  // Get properly formatted image URL
  const getImageUrl = (url: string | null) => {
    return prepareImagePath(url)
  }

  // Handle keyboard events for image viewer
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

  // Loading state
  if (isLoading) {
    return (
      <MainLayout currentPage="GALLERY">
        <main className="flex-1">
          <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white min-h-[60vh]">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
                <span className="text-teal-700 font-medium">Ielādē galeriju...</span>
              </div>
            </div>
          </section>
        </main>
      </MainLayout>
    )
  }

  // Error state (gallery not found)
  if (!gallery) {
    return (
      <MainLayout currentPage="GALLERY">
        <main className="flex-1">
          <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white min-h-[60vh]">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="bg-teal-50 border border-teal-100 p-12 text-center max-w-lg mx-auto">
                <Images className="mx-auto h-16 w-16 text-teal-300 mb-4" />
                <p className="text-xl font-bold text-teal-800 mb-2">Galerija nav atrasta</p>
                <p className="text-teal-600 mb-6">Meklētā galerija neeksistē vai ir dzēsta.</p>
                <Link href="/gallery">
                  <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-700 px-5 py-2.5 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-800 shadow-lg hover:shadow-xl">
                    <span className="inline-flex skew-x-[12deg] transform items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Atpakaļ uz galerijām
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentPage="GALLERY">
      <main className="flex-1">
        {/* Hero header for gallery */}
        <section className="relative bg-gradient-to-b from-teal-900 to-teal-800 py-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-700/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-600/10 rounded-full translate-x-1/4 translate-y-1/4" />
          <div className="absolute top-1/2 right-10 w-1 h-20 bg-white/10 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Back button */}
            <Link href="/gallery" className="inline-flex items-center mb-8 group">
              <span className="inline-flex skew-x-[-12deg] transform items-center bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white/20">
                <span className="inline-flex skew-x-[12deg] transform items-center">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Visas galerijas
                </span>
              </span>
            </Link>

            {/* Gallery info */}
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 text-teal-200">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm font-medium">{formatDate(gallery.created_at || new Date().toISOString())}</span>
                </div>
                {images.length > 0 && (
                  <>
                    <span className="text-teal-400">•</span>
                    <div className="flex items-center gap-2 text-teal-200">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm font-medium">{images.length} foto</span>
                    </div>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                {gallery.title}
              </h1>

              {gallery.description && (
                <p className="text-lg text-teal-100/90 leading-relaxed max-w-2xl">
                  {gallery.description}
                </p>
              )}

              <div className="mt-6 h-1 w-24 bg-white/30 skew-x-[-12deg]" />
            </div>
          </div>
        </section>

        {/* Gallery images section */}
        <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
          <div className="absolute top-12 left-0 w-32 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute bottom-12 right-0 w-32 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Gallery grid */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative cursor-pointer overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500"
                    onClick={() => openImageViewer(index)}
                  >
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600 z-10" />

                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={getImageUrl(image.image_url)}
                        alt={image.caption || `Attēls ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-teal-900/0 group-hover:bg-teal-900/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                            <ZoomIn className="h-6 w-6 text-teal-700" />
                          </div>
                        </div>
                      </div>

                      {/* Image number badge */}
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {index + 1}/{images.length}
                      </div>
                    </div>

                    {/* Caption (if exists) */}
                    {image.caption && (
                      <div className="p-2 text-xs text-zinc-600 line-clamp-1 bg-white">
                        {image.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-teal-50 border border-teal-100 p-12 text-center max-w-lg mx-auto">
                <Images className="mx-auto h-16 w-16 text-teal-300 mb-4" />
                <p className="text-xl font-bold text-teal-800 mb-2">Nav attēlu</p>
                <p className="text-teal-600">Šajā galerijā pašlaik nav pievienotu attēlu.</p>
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
              className="absolute right-4 top-4 z-20 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition-all duration-300 hover:bg-white/20 hover:scale-110"
              aria-label="Aizvērt"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white font-medium">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>

            {/* Previous image button */}
            <button
              onClick={navigateToPreviousImage}
              className="absolute left-4 z-20 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition-all duration-300 hover:bg-white/20 hover:scale-110 md:left-8"
              aria-label="Iepriekšējais attēls"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            {/* Next image button */}
            <button
              onClick={navigateToNextImage}
              className="absolute right-4 z-20 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white transition-all duration-300 hover:bg-white/20 hover:scale-110 md:right-8"
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
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg text-center">
                  <p className="text-white">{images[currentImageIndex].caption}</p>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex gap-2 bg-black/40 backdrop-blur-sm p-2 rounded-lg max-w-3xl overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-black/50 scale-110'
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
