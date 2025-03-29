'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import MainLayout from '@/components/layout/main-layout'
import { Gallery } from '@/types/supabase'
import { Loader2, ArrowRight, Image as ImageIcon } from 'lucide-react'

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
        <section className="relative overflow-hidden py-24">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=Rugby Gallery')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: 'transform 0.1s linear',
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-900/80 to-teal-700/80" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="text-white">CLUB</span>
                <span className="ml-2 font-light italic text-white">GALLERY</span>
              </h1>
              <div className="mx-auto mb-6 h-1 w-32 skew-x-[-12deg] transform bg-white"></div>
              <p className="text-xl text-teal-100">
                Explore our photo collections capturing the moments that define our club.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-teal-900">
              <span className="relative">
                Photo Collections
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
                  No photo galleries have been added yet. Check back soon!
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
                        <Image
                          src={gallery.thumbnailUrl}
                          alt={gallery.title}
                          width={800}
                          height={500}
                          className="h-64 w-full object-cover"
                        />
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
                            View Gallery
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
