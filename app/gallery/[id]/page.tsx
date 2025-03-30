'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { SectionContainer } from '@/components/shared/section-container'
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
        console.log(`Fetching gallery with ID: ${id}`)
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

        console.log(`Successfully fetched gallery: ${galleryData.title}`)

        // Fetch gallery images
        console.log(`Fetching images for gallery ${id}`)
        const { data: imagesData, error: imagesError } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('gallery_id', id)
          
        if (imagesError) {
          console.error('Error fetching gallery images:', imagesError)
          throw imagesError
        }

        if (imagesData && imagesData.length > 0) {
          console.log('First image sample:', imagesData[0])
          // Detect what ordering column the database uses
          let orderedImagesData = imagesData;
          if (imagesData[0].hasOwnProperty('order')) {
            console.log('Database uses "order" column for ordering')
            orderedImagesData = [...imagesData].sort((a, b) => (a.order || 0) - (b.order || 0))
          } else if (imagesData[0].hasOwnProperty('display_order')) {
            console.log('Database uses "display_order" column for ordering')
            orderedImagesData = [...imagesData].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          }
          setImages(orderedImagesData)
        } else {
          console.log('No images found for gallery')
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
        <main className="flex-1 pb-16">
          <SectionContainer className="bg-white">
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-800 border-t-transparent"></div>
            </div>
          </SectionContainer>
        </main>
      </MainLayout>
    )
  }

  // Error state (gallery not found)
  if (!gallery) {
    return (
      <MainLayout currentPage="GALLERY">
        <main className="flex-1 pb-16">
          <SectionContainer className="bg-white">
            <div className="py-16 text-center">
              <h2 className="text-2xl font-bold text-gray-700">Galerija nav atrasta</h2>
              <p className="mt-4 text-gray-600">
                Meklētā galerija neeksistē vai ir dzēsta.
              </p>
              <Link href="/gallery" className="mt-8 inline-block">
                <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Atpakaļ uz galerijām
                  </span>
                </span>
              </Link>
            </div>
          </SectionContainer>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentPage="GALLERY">
      <main className="flex-1 pb-16">
        {/* Gallery detail */}
        <SectionContainer className="bg-white">
          <div className="mx-auto max-w-7xl">
            {/* Back button */}
            <Link href="/gallery" className="inline-flex items-center">
              <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-teal-900">
                <span className="inline-flex skew-x-[12deg] transform items-center">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Atpakaļ uz galerijām
                </span>
              </span>
            </Link>

            {/* Gallery details */}
            <div className="mt-8">
              <h1 className="text-3xl font-bold text-teal-900">{gallery.title}</h1>
              <p className="mt-2 text-zinc-500">
                {formatDate(gallery.created_at || new Date().toISOString())}
              </p>
              {gallery.description && (
                <p className="mt-4 text-zinc-700">{gallery.description}</p>
              )}
            </div>

            {/* Gallery grid */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                  onClick={() => openImageViewer(index)}
                >
                  <div className="relative aspect-square cursor-pointer overflow-hidden">
                    <img
                      src={getImageUrl(image.image_url)}
                      alt={image.caption || `Image ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {image.caption && (
                    <div className="p-2 text-sm text-zinc-700">{image.caption}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Message when no images */}
            {images.length === 0 && (
              <div className="mt-16 rounded-lg bg-gray-50 py-16 text-center">
                <p className="text-gray-500">Šajā galerijā pašlaik nav attēlu.</p>
              </div>
            )}
          </div>
        </SectionContainer>

        {/* Image viewer overlay */}
        {currentImageIndex !== null && images.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            {/* Close button */}
            <button
              onClick={closeImageViewer}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close image viewer"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Previous image button */}
            <button
              onClick={navigateToPreviousImage}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:left-8"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            {/* Next image button */}
            <button
              onClick={navigateToNextImage}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:right-8"
              aria-label="Next image"
            >
              <ArrowLeft className="h-6 w-6 rotate-180" />
            </button>

            {/* Image */}
            <div className="relative h-full w-full">
              <img
                src={getImageUrl(images[currentImageIndex].image_url)}
                alt={images[currentImageIndex].caption || `Image ${currentImageIndex + 1}`}
                className="mx-auto h-full max-h-screen object-contain p-4"
              />

              {/* Caption */}
              {images[currentImageIndex].caption && (
                <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4 text-center text-white">
                  {images[currentImageIndex].caption}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  )
}
