'use client'

import { default as NextImage } from 'next/image'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ArrowRight,
  Camera,
  ImageIcon,
} from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { GridContainer } from '@/components/ui/grid-container'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { HeroSection } from '@/components/features/hero-section'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import { MapSection } from '@/components/features/map-section'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { prepareImagePath } from '@/lib/supabase'
import { Article, Gallery, GalleryImage, Fixture } from '@/types/supabase'
import { aboutUsData } from '@/data/about-us'

// Define a type for our fallback news items
interface FallbackNewsItem {
  title: string
  description: string
  image: string
}

// Define a type for the combined news items (either Article or FallbackNewsItem)
type NewsItem = Article | FallbackNewsItem

// Add a type for galleries with thumbnails
interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string | null
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [galleries, setGalleries] = useState<GalleryWithThumbnail[]>([])
  const [loadingGallery, setLoadingGallery] = useState(true)
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loadingFixtures, setLoadingFixtures] = useState(true)

  // Fallback news items if no articles are loaded
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

  // Fetch articles from Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(3) // Limit to 3 latest articles for the carousel

        if (error) throw error
        setArticles(data || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  // Fetch galleries from Supabase
  useEffect(() => {
    const fetchGalleries = async () => {
      setLoadingGallery(true)
      try {
        console.log('Fetching galleries directly from Supabase in home page')
        
        // Get galleries
        const { data: galleriesData, error: galleriesError } = await supabase
          .from('galleries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4) // Limit to 4 galleries for home page

        if (galleriesError) {
          console.error('Error fetching galleries in home page:', galleriesError)
          throw galleriesError
        }

        console.log(`Home page: Fetched ${galleriesData?.length || 0} galleries`)

        // For each gallery, get the first image
        const galleriesWithThumbnails = await Promise.all(
          (galleriesData || []).map(async (gallery) => {
            // Get first image for this gallery
            const { data: imagesData, error: imagesError } = await supabase
              .from('gallery_images')
              .select('*')
              .eq('gallery_id', gallery.id)
              .limit(1)

            if (imagesError) {
              console.error(`Home page: Error fetching images for gallery ${gallery.id}:`, imagesError)
              return {
                ...gallery,
                thumbnailUrl: '/placeholder.svg?height=300&width=400&text=Gallery'
              }
            }

            const thumbnailUrl = imagesData && imagesData.length > 0 
              ? prepareImagePath(imagesData[0].image_url) 
              : '/placeholder.svg?height=300&width=400&text=Gallery'

            return {
              ...gallery,
              thumbnailUrl
            }
          })
        )

        setGalleries(galleriesWithThumbnails)
      } catch (error) {
        console.error('Home page: Error in gallery fetching process:', error)
        setGalleries([])
      } finally {
        setLoadingGallery(false)
      }
    }

    fetchGalleries()
  }, [])

  // Fetch upcoming fixtures from Supabase
  useEffect(() => {
    const fetchFixtures = async () => {
      setLoadingFixtures(true)
      try {
        // Get today's date at midnight UTC
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        const { data, error } = await supabase
          .from('fixtures')
          .select('*')
          .gte('match_date', today.toISOString())
          .order('match_date', { ascending: true })
          .limit(3)

        if (error) {
          console.error('Error fetching fixtures:', error)
          throw error
        }

        setFixtures(data || [])
      } catch (error) {
        console.error('Error fetching fixtures:', error)
        setFixtures([])
      } finally {
        setLoadingFixtures(false)
      }
    }

    fetchFixtures()

    // Set up real-time subscription for fixtures
    const fixturesSubscription = supabase
      .channel('home-fixtures')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'fixtures'
        },
        () => {
          console.log('Fixtures changed, refreshing...')
          fetchFixtures()
        }
      )
      .subscribe()

    return () => {
      fixturesSubscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const itemsLength = articles.length > 0 ? articles.length : fallbackNewsItems.length
      setCurrentSlide((prev) => (prev === itemsLength - 1 ? 0 : prev + 1))
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [articles.length])

  const nextSlide = () => {
    const itemsLength = articles.length > 0 ? articles.length : fallbackNewsItems.length
    setCurrentSlide((prev) => (prev === itemsLength - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    const itemsLength = articles.length > 0 ? articles.length : fallbackNewsItems.length
    setCurrentSlide((prev) => (prev === 0 ? itemsLength - 1 : prev - 1))
  }

  // Use real articles or fallback to sample items
  const newsItems: NewsItem[] = articles.length > 0 ? articles : fallbackNewsItems

  // Helper function to check if a URL is an SVG
  const isSvgUrl = (url: string | null): boolean => {
    if (!url) return false
    return url.toLowerCase().endsWith('.svg') || url.includes('/svg')
  }

  // Helper function to get the image URL
  const getImageUrl = (item: NewsItem | string | null): string => {
    // Handle NewsItem type
    if (item && typeof item === 'object' && ('id' in item || 'image' in item)) {
      if ('id' in item) {
        // This is an Article
        return item.image_url || '/placeholder.svg?height=1080&width=1920&text=Rugby News'
      }
      // This is a FallbackNewsItem
      return item.image
    }

    // Handle string URL
    const url = item as string | null
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
      // Replace any problematic characters
      return url.replace(/\s/g, '%20')
    }

    // Default fallback
    return url
  }

  // Helper function to get description or content
  const getDescription = (item: NewsItem): string => {
    if ('id' in item) {
      // This is an Article
      const plainText = stripHtml(item.content)
      return plainText.substring(0, 150) + '...'
    }
    // This is a FallbackNewsItem
    return item.description
  }

  // Helper function to strip HTML tags
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Helper function to check if item is an Article
  const isArticle = (item: NewsItem): item is Article => {
    return 'id' in item
  }

  // Helper function to check if item is a FallbackNewsItem
  const isFallbackNewsItem = (item: NewsItem): item is FallbackNewsItem => {
    return !('id' in item)
  }

  // Helper function to format date for fixtures
  const formatMatchDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('lv-LV', options)
  }

  // Helper function to extract time from date for fixtures
  const extractTimeFromDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <MainLayout currentPage="HOME">
      <main className="flex-1">
        {/* Hero Section - Modern Split Layout */}
        <section className="relative min-h-[85vh] bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 overflow-hidden">
          {/* Blurred article image background */}
          <div className="absolute inset-0 z-0">
            {articles.length > 0
              ? articles.map((article, index) => (
                  <div
                    key={article.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <NextImage
                      src={article.image_url || '/placeholder.svg?height=1080&width=1920&text=Rugby'}
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
                ))
              : fallbackNewsItems.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <NextImage
                      src={item.image}
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
                  {articles.length > 0 && currentSlide < articles.length
                    ? articles[currentSlide].title
                    : fallbackNewsItems[currentSlide % fallbackNewsItems.length].title}
                </h1>

                {/* Description */}
                <p className="text-lg text-teal-100/80 leading-relaxed mb-8 max-w-lg">
                  {articles.length > 0 && currentSlide < articles.length
                    ? stripHtml(articles[currentSlide].content).substring(0, 180) + '...'
                    : fallbackNewsItems[currentSlide % fallbackNewsItems.length].description}
                </p>

                {/* CTA Button */}
                <div className="flex items-center gap-6">
                  <Link
                    href={articles.length > 0 && currentSlide < articles.length
                      ? `/news/${articles[currentSlide].id}`
                      : `/news/${currentSlide + 1}`}
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
                  <div className="hidden sm:flex items-center gap-2">
                    {(articles.length > 0 ? articles : fallbackNewsItems).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 skew-x-[-12deg] transform transition-all duration-300 ${
                          index === currentSlide
                            ? 'w-10 bg-teal-400'
                            : 'w-6 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
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
                    {String(currentSlide + 1).padStart(2, '0')} / {String((articles.length > 0 ? articles : fallbackNewsItems).length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Right Image */}
              <div className="order-1 lg:order-2">
                {/* Simple image frame */}
                <div className="relative overflow-hidden shadow-2xl border-b-4 border-teal-400">
                  {/* Image carousel */}
                  <div className="relative aspect-[4/3] bg-teal-800 hero-image-container">
                    {articles.length > 0
                      ? articles.map((article, index) => (
                          <div
                            key={article.id}
                            className={`absolute inset-0 transition-all duration-700 ${
                              index === currentSlide
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                            }`}
                          >
                            <NextImage
                              src={article.image_url || '/placeholder.svg?height=600&width=800&text=Rugby News'}
                              alt={article.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover"
                              priority={index === 0}
                              loading={index === 0 ? 'eager' : 'lazy'}
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLTtRuLC8iu7WVo54W3I6nkGtDg+RXOr6Xp9ze3E00NuiTSBmKIOc5ycY71SlTiqUWU7M51kXaij/9k="
                            />
                          </div>
                        ))
                      : fallbackNewsItems.map((item, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-700 ${
                              index === currentSlide
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                            }`}
                          >
                            <NextImage
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover"
                              priority={index === 0}
                              loading={index === 0 ? 'eager' : 'lazy'}
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzLTtRuLC8iu7WVo54W3I6nkGtDg+RXOr6Xp9ze3E00NuiTSBmKIOc5ycY71SlTiqUWU7M51kXaij/9k="
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
                <div className="flex sm:hidden items-center justify-center gap-2 mt-6">
                  {(articles.length > 0 ? articles : fallbackNewsItems).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 skew-x-[-12deg] transform transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-10 bg-teal-400'
                          : 'w-6 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* About Us Section with Parallax */}
        <section className="relative py-24 overflow-hidden">
          {/* Parallax Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/AboutUs/parallax.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/[0.97] via-white/[0.95] to-white/[0.97]" />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-300/50 to-transparent" />
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute bottom-20 right-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                <span className="text-sm font-bold uppercase tracking-widest text-teal-600">Iepazīsti mūs</span>
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-teal-900">PAR </span>
                <span className="text-teal-600 italic font-light">MUMS</span>
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <div className="relative group">
                {/* Main image container */}
                <div className="relative overflow-hidden shadow-2xl">
                  <NextImage
                    src={aboutUsData.imageUrl}
                    alt="Rugby Club Team"
                    width={800}
                    height={600}
                    className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-teal-600" />
                </div>

                {/* Floating stats card */}
                <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-white shadow-xl p-6 skew-x-[-6deg] transform border-l-4 border-teal-600">
                  <div className="skew-x-[6deg] transform text-center">
                    <div className="text-4xl font-extrabold text-teal-700">2005</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">Dibināts</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 lg:pl-4">
                {/* Label */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-0.5 bg-teal-600 skew-x-[-12deg]" />
                  <span className="text-sm font-bold uppercase tracking-widest text-teal-600">Mūsu Misija</span>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight text-teal-900 leading-tight">
                  {aboutUsData.mission.title}
                </h3>

                <p className="text-lg text-zinc-600 leading-relaxed">
                  {aboutUsData.mission.content.substring(0, 250)}...
                </p>

                {/* CTA */}
                <Link href="/about" className="inline-block group">
                  <button className="skew-x-[-12deg] transform bg-teal-700 px-8 py-4 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-teal-800 hover:shadow-xl">
                    <span className="inline-flex skew-x-[12deg] transform items-center">
                      UZZINĀT VAIRĀK
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
          <div className="absolute top-16 right-0 w-48 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                <span className="text-sm font-bold uppercase tracking-widest text-teal-600">Aktualitātes</span>
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-teal-900">JAUNĀKĀS </span>
                <span className="text-teal-600 italic font-light">ZIŅAS</span>
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
            </div>

            {/* News Grid */}
            <div className="mb-12 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {articles.length > 0
                ? articles.slice(0, 3).map((article, index) => (
                    <Link href={`/news/${article.id}`} key={article.id} className="group block">
                      <div className="relative h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-b-4 border-teal-700">
                        {/* Featured badge for first article */}
                        {index === 0 && (
                          <div className="absolute top-4 left-0 z-20 bg-teal-700 px-4 py-1 skew-x-[-12deg] -translate-x-1">
                            <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">Jaunākais</span>
                          </div>
                        )}

                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          <NextImage
                            src={article.image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Date overlay */}
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {new Date(article.published_at).toLocaleDateString('lv-LV', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="mt-3 text-sm text-zinc-600 line-clamp-3">
                            {(() => {
                              const plainText = stripHtml(article.content)
                              return plainText.length > 120 ? `${plainText.substring(0, 120)}...` : plainText
                            })()}
                          </p>

                          <div className="mt-5 flex items-center text-teal-700 font-semibold text-sm group-hover:text-teal-600 transition-colors">
                            <span>LASĪT VAIRĀK</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                : fallbackNewsItems.slice(0, 3).map((item, index) => (
                    <Link href={`/news/${index + 1}`} key={index} className="group block">
                      <div className="relative h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-b-4 border-teal-700">
                        {index === 0 && (
                          <div className="absolute top-4 left-0 z-20 bg-teal-700 px-4 py-1 skew-x-[-12deg] -translate-x-1">
                            <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">Jaunākais</span>
                          </div>
                        )}

                        <div className="relative h-56 overflow-hidden">
                          <NextImage
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-sm font-medium">2023. gada 15. apr.</span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm text-zinc-600 line-clamp-3">{item.description}</p>
                          <div className="mt-5 flex items-center text-teal-700 font-semibold text-sm group-hover:text-teal-600 transition-colors">
                            <span>LASĪT VAIRĀK</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link href="/news" className="group">
                <button className="skew-x-[-12deg] transform bg-teal-800 px-8 py-4 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-teal-900 hover:shadow-xl">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    SKATĪT VISAS ZIŅAS
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
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

            {/* Gallery Grid */}
            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {loadingGallery ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-700 border-t-transparent"></div>
                </div>
              ) : galleries.length === 0 ? (
                <div className="col-span-full bg-teal-50 border border-teal-100 p-8 text-center">
                  <Camera className="mx-auto h-12 w-12 text-teal-300 mb-3" />
                  <p className="text-lg font-medium text-teal-800">Drīzumā sekojiet galerijas atjauninājumiem!</p>
                </div>
              ) : (
                galleries.map((gallery, index) => (
                  <Link href={`/gallery/${gallery.id}`} key={gallery.id} className="group">
                    <div className={`relative overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl ${
                      index === 0 ? 'sm:col-span-2 sm:row-span-2 h-80 sm:h-full' : 'h-72'
                    }`}>
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
                          <h3 className={`font-bold text-white tracking-tight ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
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
                ))
              )}
            </div>

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

        {/* Upcoming Matches Section */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
          <div className="absolute top-16 right-0 w-40 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                <CalendarDays className="h-5 w-5 text-teal-600" />
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-teal-900">GAIDĀMĀS </span>
                <span className="text-teal-600 italic font-light">SPĒLES</span>
              </h2>
              <p className="mt-4 text-zinc-600 max-w-md mx-auto">
                Nākamās spēles un pasākumi, kuros varat mūs atbalstīt
              </p>
              <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
            </div>

            {loadingFixtures ? (
              <div className="flex justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-700 border-t-transparent"></div>
              </div>
            ) : fixtures.length === 0 ? (
              <div className="bg-teal-50 border border-teal-100 p-8 text-center max-w-md mx-auto">
                <CalendarDays className="mx-auto h-12 w-12 text-teal-300 mb-3" />
                <p className="text-lg font-medium text-teal-800">Šobrīd nav plānotas gaidāmās spēles.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {fixtures.map((fixture, index) => (
                  <div
                    key={fixture.id}
                    className={`group relative bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                      index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                    }`}
                  >
                    {/* Top gradient bar */}
                    <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500" />

                    {/* Next match badge for first fixture */}
                    {index === 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1 rounded-full shadow-md">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Nākamā</span>
                        </div>
                      </div>
                    )}

                    {/* Compact header with date and time */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-2.5 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-slate-700">
                          <CalendarDays className="h-4 w-4 text-teal-600" />
                          <span className="font-semibold text-sm">
                            {formatMatchDate(fixture.match_date)}
                          </span>
                        </div>
                        <div className="w-px h-4 bg-gray-300" />
                        <span className="text-sm text-slate-500 font-medium">
                          {extractTimeFromDate(fixture.match_date)}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      {/* Teams */}
                      <div className="flex items-center justify-between gap-3">
                        {/* Home team */}
                        <div className="flex-1 flex flex-col items-center text-center">
                          <div className="h-16 w-16 rounded-full bg-white shadow-md border-2 border-gray-100 p-1.5 overflow-hidden group-hover:border-teal-300 group-hover:shadow-lg transition-all duration-300 mb-2">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                              <NextImage
                                src={fixture.home_logo_url || "/Logo/fēniks_logo-removebg-preview.png"}
                                alt="RK Fēnikss"
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                          <span className="font-bold text-slate-800 text-xs leading-tight mb-0.5">
                            {fixture.is_home_game ? 'RK "Fēnikss"' : fixture.opponent}
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Mājas</span>
                        </div>

                        {/* VS badge */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-xs">VS</span>
                            </div>
                            <div className="absolute -inset-0.5 rounded-full border-2 border-teal-200 opacity-50" />
                          </div>
                        </div>

                        {/* Away team */}
                        <div className="flex-1 flex flex-col items-center text-center">
                          <div className="h-16 w-16 rounded-full bg-white shadow-md border-2 border-gray-100 p-1.5 overflow-hidden group-hover:border-teal-300 group-hover:shadow-lg transition-all duration-300 mb-2">
                            <div className="relative w-full h-full rounded-full overflow-hidden">
                              <NextImage
                                src={fixture.away_logo_url || "/placeholder.svg?height=48&width=48&text=Team"}
                                alt={fixture.opponent}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                          <span className="font-bold text-slate-800 text-xs leading-tight mb-0.5">
                            {fixture.is_home_game ? fixture.opponent : 'RK "Fēnikss"'}
                          </span>
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Viesi</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center justify-center gap-2 text-slate-500 mt-4 pt-3 border-t border-gray-100">
                        <MapPin className="h-3.5 w-3.5 text-teal-600" />
                        <span className="text-xs font-medium">
                          {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                        </span>
                      </div>

                      {/* CTA */}
                      <Link href="/fixtures" className="block mt-4">
                        <button className="w-full rounded-md bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-xs font-bold tracking-wide text-white transition-all duration-300 hover:from-teal-700 hover:to-teal-800 hover:shadow-md flex items-center justify-center gap-2">
                          SPĒLES DETAĻAS
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                      </Link>
                    </div>

                    {/* Subtle bottom accent on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                ))}
              </div>
            )}

            {fixtures.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Link href="/fixtures" className="group inline-block">
                  <button className="skew-x-[-12deg] transform bg-teal-800 px-8 py-4 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-teal-900 hover:shadow-xl">
                    <span className="inline-flex skew-x-[12deg] transform items-center">
                      SKATĪT VISAS SPĒLES
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Sponsors Section with Parallax */}
        <section className="relative py-20 overflow-hidden">
          {/* Parallax Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/AboutUs/parallax.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />
          {/* Dark overlay for contrast with logos */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-900/95 via-teal-800/90 to-teal-900/95" />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
          <div className="absolute top-10 left-10 w-24 h-0.5 bg-teal-400/30 skew-x-[-12deg]" />
          <div className="absolute bottom-10 right-10 w-24 h-0.5 bg-teal-400/30 skew-x-[-12deg]" />

          {/* Grey Logo Background */}
          <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
            <NextImage
              src="/Grey Logo.png"
              alt="Grey Logo Background"
              fill
              className="object-contain object-center"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                <span className="text-sm font-bold uppercase tracking-widest text-teal-300">Partneri</span>
                <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-white">MŪSU </span>
                <span className="text-teal-400 italic font-light">ATBALSTĪTĀJI</span>
              </h2>
              <div className="mx-auto mt-4 h-1 w-24 bg-teal-400 skew-x-[-12deg]" />
            </div>

            {/* Sponsor logos */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 items-center py-8">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={num}
                  className="group relative w-full max-w-[180px] h-[90px] flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 hover:bg-white/20 hover:scale-105 border border-white/10 hover:border-teal-400/50"
                >
                  <NextImage
                    src={num === 7
                      ? `/SponsorsImages/sponsoru_logo_7-removebg-preview.png`
                      : `/SponsorsImages/Sponsor${num === 1 ? '' : 'u'}_logo_${num}-removebg-preview.png`
                    }
                    alt={`Sponsor ${num}`}
                    width={160}
                    height={70}
                    className="object-contain max-h-full brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <p className="text-teal-100/80 mb-6 max-w-md mx-auto">
                Vēlies atbalstīt mūsu komandu un kļūt par partneri?
              </p>
              <Link href="/contact" className="group inline-block">
                <button className="skew-x-[-12deg] transform bg-teal-400 px-8 py-4 font-bold tracking-wide text-teal-900 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-teal-400/25">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    KĻŪT PAR ATBALSTĪTĀJU
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
