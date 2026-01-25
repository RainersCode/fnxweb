'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Gallery, GalleryImage } from '@/types/supabase'
import { ArrowRight, Image as ImageIcon, Camera, Images, CalendarDays } from 'lucide-react'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import { supabase } from '@/lib/supabase'
import { prepareImagePath } from '@/lib/supabase'

interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string | null
  imageCount?: number
}

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<GalleryWithThumbnail[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch galleries directly from Supabase
  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true)
      try {
        // Get galleries
        const { data: galleriesData, error: galleriesError } = await supabase
          .from('galleries')
          .select('*')
          .order('created_at', { ascending: false })

        if (galleriesError) {
          console.error('Error fetching galleries:', galleriesError)
          throw galleriesError
        }

        // For each gallery, get the first image and count
        const galleriesWithThumbnails = await Promise.all(
          (galleriesData || []).map(async (gallery) => {
            // Get images for this gallery
            const { data: imagesData, error: imagesError, count } = await supabase
              .from('gallery_images')
              .select('*', { count: 'exact' })
              .eq('gallery_id', gallery.id)

            if (imagesError) {
              console.error(`Error fetching images for gallery ${gallery.id}:`, imagesError)
              return {
                ...gallery,
                thumbnailUrl: null,
                imageCount: 0
              }
            }

            const thumbnailUrl = imagesData && imagesData.length > 0
              ? prepareImagePath(imagesData[0].image_url)
              : null

            return {
              ...gallery,
              thumbnailUrl,
              imageCount: imagesData?.length || 0
            }
          })
        )

        setGalleries(galleriesWithThumbnails)
      } catch (error) {
        console.error('Error in gallery fetching process:', error)
        setGalleries([])
      } finally {
        setLoading(false)
      }
    }

    fetchGalleries()
  }, [])

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('lv-LV', options)
  }

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
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                <Camera className="h-5 w-5 text-teal-600" />
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-teal-900">FOTO </span>
                <span className="text-teal-600 italic font-light">KOLEKCIJAS</span>
              </h2>
              <p className="mt-4 text-zinc-600 max-w-md mx-auto">
                Iemūžinātie mirkļi no spēlēm, treniņiem un kluba pasākumiem
              </p>
              <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
                  <span className="text-teal-700 font-medium">Ielādē galerijas...</span>
                </div>
              </div>
            )}

            {/* No Galleries State */}
            {!loading && galleries.length === 0 && (
              <div className="bg-teal-50 border border-teal-100 p-12 text-center max-w-lg mx-auto">
                <Images className="mx-auto h-16 w-16 text-teal-300 mb-4" />
                <p className="text-xl font-bold text-teal-800 mb-2">Nav galeriju</p>
                <p className="text-teal-600">Pagaidām nav pievienotas fotogalerijas. Lūdzu, pārbaudiet vēlāk!</p>
              </div>
            )}

            {/* Featured Gallery (first one) */}
            {!loading && galleries.length > 0 && (
              <>
                <Link href={`/gallery/${galleries[0].id}`} className="group block mb-12">
                  <div className="relative bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                    <div className="grid md:grid-cols-2">
                      {/* Image */}
                      <div className="relative h-64 md:h-96 overflow-hidden">
                        {galleries[0].thumbnailUrl ? (
                          <img
                            src={galleries[0].thumbnailUrl}
                            alt={galleries[0].title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50">
                            <ImageIcon className="h-20 w-20 text-teal-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/20" />

                        {/* Featured badge */}
                        <div className="absolute top-4 left-0 z-10">
                          <div className="skew-x-[-12deg] transform bg-teal-600 px-4 py-2 shadow-lg -translate-x-1">
                            <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">
                              Jaunākā galerija
                            </span>
                          </div>
                        </div>

                        {/* Image count badge */}
                        {galleries[0].imageCount !== undefined && galleries[0].imageCount > 0 && (
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Camera className="h-4 w-4 text-white" />
                            <span className="text-sm font-medium text-white">{galleries[0].imageCount} foto</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-sm text-teal-600 mb-4">
                          <CalendarDays className="h-4 w-4" />
                          <span className="font-medium">{formatDate(galleries[0].created_at || new Date().toISOString())}</span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors mb-4">
                          {galleries[0].title}
                        </h3>

                        {galleries[0].description && (
                          <p className="text-zinc-600 leading-relaxed mb-6 line-clamp-3">
                            {galleries[0].description}
                          </p>
                        )}

                        <div className="flex items-center text-teal-700 font-bold group-hover:text-teal-600 transition-colors">
                          <span>SKATĪT GALERIJU</span>
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </Link>

                {/* Rest of galleries grid */}
                {galleries.length > 1 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {galleries.slice(1).map((gallery) => (
                      <Link href={`/gallery/${gallery.id}`} key={gallery.id} className="group block">
                        <div className="relative h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                          {/* Top accent */}
                          <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                          {/* Image */}
                          <div className="relative h-56 overflow-hidden">
                            {gallery.thumbnailUrl ? (
                              <img
                                src={gallery.thumbnailUrl}
                                alt={gallery.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-100 to-teal-50">
                                <ImageIcon className="h-16 w-16 text-teal-300" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Image count badge */}
                            {gallery.imageCount !== undefined && gallery.imageCount > 0 && (
                              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                <Camera className="h-3.5 w-3.5 text-white" />
                                <span className="text-xs font-medium text-white">{gallery.imageCount}</span>
                              </div>
                            )}

                            {/* Date overlay */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                              <CalendarDays className="h-4 w-4" />
                              <span className="text-sm font-medium">{formatDate(gallery.created_at || new Date().toISOString())}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-2 mb-3">
                              {gallery.title}
                            </h3>

                            {gallery.description && (
                              <p className="text-sm text-zinc-600 line-clamp-2 mb-4">
                                {gallery.description}
                              </p>
                            )}

                            <div className="flex items-center text-teal-700 font-semibold text-sm group-hover:text-teal-600 transition-colors">
                              <span>SKATĪT GALERIJU</span>
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                            </div>
                          </div>

                          {/* Bottom accent on hover */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
