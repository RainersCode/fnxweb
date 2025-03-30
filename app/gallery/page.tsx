'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Gallery } from '@/types/supabase'
import { Loader2, ArrowRight, Image as ImageIcon } from 'lucide-react'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'

interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string | null
}

export default function GalleryPage() {
  const [scrollY, setScrollY] = useState(0)
  const [galleries, setGalleries] = useState<GalleryWithThumbnail[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch galleries from Supabase
  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/galleries')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setGalleries(data || [])
      } catch (error) {
        console.error('Error fetching galleries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleries()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <MainLayout currentPage="GALLERY">
      <main className="flex-1">
        {/* Hero Section */}
        <ParallaxHeroSection
          title="KLUBA"
          titleHighlight="GALERIJA"
          subtitle="Izpētiet mūsu foto kolekcijas, kas iemūžina mūsu kluba īpašos mirkļus."
          backgroundImage="/AboutUs/parallax.jpg"
        />

        {/* Gallery Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-teal-900">
              <span className="relative">
                Foto kolekcijas
                <span className="absolute -bottom-2 left-0 right-0 h-1 w-32 skew-x-[-12deg] bg-gradient-to-r from-teal-500 to-teal-800"></span>
              </span>
            </h2>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-teal-800" />
              </div>
            )}

            {/* No Galleries State */}
            {!loading && galleries.length === 0 && (
              <div className="rounded-lg bg-teal-50 p-6 text-center">
                <p className="text-lg text-teal-800">
                  Pagaidām nav pievienotas fotogalerijas. Lūdzu, pārbaudiet vēlāk!
                </p>
              </div>
            )}

            {/* Galleries Grid */}
            {!loading && galleries.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {galleries.map((gallery) => (
                  <Link href={`/gallery/${gallery.id}`} key={gallery.id} className="group">
                    <div
                      className="relative transform cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 95%)' }}
                    >
                      {gallery.thumbnailUrl ? (
                        <div className="relative h-64 w-full">
                          <img
                            src={gallery.thumbnailUrl}
                            alt={gallery.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-64 w-full items-center justify-center bg-teal-100">
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-12 w-12 text-teal-800/50" />
                            <p className="mt-2 text-sm text-teal-800/70">{gallery.title}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-teal-900/90 to-transparent p-6">
                        <h3 className="mb-1 text-xl font-bold text-white">{gallery.title}</h3>
                        {gallery.description && (
                          <p className="line-clamp-2 text-sm text-teal-100">
                            {gallery.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-center text-white/90">
                          <span className="text-sm font-medium group-hover:underline">
                            Skatīt galeriju
                          </span>
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
