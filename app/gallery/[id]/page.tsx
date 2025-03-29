'use client'

import { useState, useEffect, useCallback, TouchEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/main-layout'
import { Gallery, GalleryImage } from '@/types/supabase'
import { Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function GalleryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const galleryId = params.id as string

  const [scrollY, setScrollY] = useState(0)
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1)

  // For touch events
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Fetch gallery and its images
  useEffect(() => {
    const fetchGalleryWithImages = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/galleries/${galleryId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setGallery(data)
        setGalleryImages(data.images || [])
      } catch (error) {
        console.error('Error fetching gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    if (galleryId) {
      fetchGalleryWithImages()
    }
  }, [galleryId])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Get the first image URL or use a placeholder
  const heroImageUrl =
    galleryImages.length > 0
      ? galleryImages[0].image_url
      : '/placeholder.svg?height=1080&width=1920&text=Rugby Gallery'

  // Handle keyboard events for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return

      if (e.key === 'ArrowLeft') {
        navigateToPreviousImage()
      } else if (e.key === 'ArrowRight') {
        navigateToNextImage()
      } else if (e.key === 'Escape') {
        closeImageViewer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage, selectedImageIndex, galleryImages])

  // Function to open the lightbox with a specific image
  const openImageViewer = useCallback((imageUrl: string, index: number) => {
    setSelectedImage(imageUrl)
    setSelectedImageIndex(index)
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden'
  }, [])

  // Function to close the lightbox
  const closeImageViewer = useCallback(() => {
    setSelectedImage(null)
    setSelectedImageIndex(-1)
    // Restore scrolling
    document.body.style.overflow = 'auto'
  }, [])

  // Function to navigate to the next image
  const navigateToNextImage = useCallback(() => {
    if (galleryImages.length === 0 || selectedImageIndex === -1) return

    const nextIndex = (selectedImageIndex + 1) % galleryImages.length
    setSelectedImageIndex(nextIndex)
    setSelectedImage(galleryImages[nextIndex].image_url)
  }, [selectedImageIndex, galleryImages])

  // Function to navigate to the previous image
  const navigateToPreviousImage = useCallback(() => {
    if (galleryImages.length === 0 || selectedImageIndex === -1) return

    const prevIndex = (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length
    setSelectedImageIndex(prevIndex)
    setSelectedImage(galleryImages[prevIndex].image_url)
  }, [selectedImageIndex, galleryImages])

  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null) // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      navigateToNextImage()
    } else if (isRightSwipe) {
      navigateToPreviousImage()
    }
  }

  return (
    <MainLayout currentPage="GALLERY">
      <main className="flex-1">
        {/* Hero Section with Parallax Effect */}
        <section className="relative overflow-hidden py-24">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('${heroImageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: 'transform 0.1s linear',
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-900/80 to-teal-700/80" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center text-white">
              {loading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : (
                <>
                  <h1 className="mb-4 text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
                    {gallery?.title || 'Gallery'}
                  </h1>
                  <div className="mx-auto mb-6 h-1 w-32 skew-x-[-12deg] transform bg-white"></div>
                  {gallery?.description && (
                    <p className="text-xl text-teal-100">{gallery.description}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Back button */}
            <Link
              href="/gallery"
              className="mb-8 inline-flex items-center text-teal-800 hover:text-teal-600"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="ml-1">Back to Galleries</span>
            </Link>

            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-teal-800" />
              </div>
            )}

            {!loading && galleryImages.length === 0 && (
              <div className="rounded-lg bg-teal-50 p-6 text-center">
                <p className="text-lg text-teal-800">
                  No images have been added to this gallery yet.
                </p>
              </div>
            )}

            {!loading && galleryImages.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative transform cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 95%)' }}
                    onClick={() => openImageViewer(image.image_url, index)}
                  >
                    <Image
                      src={image.image_url || '/placeholder.svg'}
                      alt={image.caption || 'Gallery image'}
                      width={800}
                      height={600}
                      className="h-64 w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-teal-900/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {image.caption && <h3 className="font-bold text-white">{image.caption}</h3>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox for selected image with navigation */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeImageViewer}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Previous button */}
            <button
              className="absolute left-4 z-10 rounded-full bg-teal-800/80 p-2 text-white opacity-70 transition-opacity hover:opacity-100 focus:outline-none md:left-6 md:p-3"
              onClick={(e) => {
                e.stopPropagation()
                navigateToPreviousImage()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next button */}
            <button
              className="absolute right-4 z-10 rounded-full bg-teal-800/80 p-2 text-white opacity-70 transition-opacity hover:opacity-100 focus:outline-none md:right-6 md:p-3"
              onClick={(e) => {
                e.stopPropagation()
                navigateToNextImage()
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Close button */}
            <button
              className="absolute right-4 top-4 z-10 rounded-full bg-teal-800 p-2 text-white opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation()
                closeImageViewer()
              }}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            <div
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={galleryImages[selectedImageIndex]?.caption || 'Gallery image'}
                width={1200}
                height={800}
                className="max-h-[90vh] max-w-[90vw] object-contain"
              />

              {/* Image caption */}
              {galleryImages[selectedImageIndex]?.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-center text-white">
                  <p>{galleryImages[selectedImageIndex].caption}</p>
                </div>
              )}

              {/* Image counter */}
              <div className="absolute left-0 top-0 bg-black/60 px-4 py-2 text-sm text-white">
                {selectedImageIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  )
}
