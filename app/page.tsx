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
import MainLayout from '@/components/layout/main-layout'
import { GridContainer } from '@/components/ui/grid-container'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { HeroSection } from '@/components/features/hero-section'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import { MapSection } from '@/components/features/map-section'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Article, Gallery, GalleryImage } from '@/types/supabase'
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
  const [scrollY, setScrollY] = useState(0)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [galleries, setGalleries] = useState<GalleryWithThumbnail[]>([])
  const [loadingGallery, setLoadingGallery] = useState(true)

  // Fallback news items if no articles are loaded
  const fallbackNewsItems: FallbackNewsItem[] = [
    {
      title: 'SEASON OPENER THIS SATURDAY',
      description: 'Join us for our first match of the season against local rivals.',
      image: '/placeholder.svg?height=1080&width=1920&text=Season Opener',
    },
    {
      title: 'NEW TRAINING SCHEDULE',
      description:
        'Coach Williams has announced the new training schedule for the upcoming season.',
      image: '/placeholder.svg?height=1080&width=1920&text=Training Schedule',
    },
    {
      title: 'COMMUNITY FUNDRAISER SUCCESS',
      description: 'Our recent community fundraiser raised over £2,000 for new training equipment.',
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
        const response = await fetch('/api/galleries')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()

        // Get up to 4 most recent galleries
        const recentGalleries = data.slice(0, 4)
        setGalleries(recentGalleries)
      } catch (error) {
        console.error('Error fetching galleries:', error)
      } finally {
        setLoadingGallery(false)
      }
    }

    fetchGalleries()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const itemsLength = articles.length > 0 ? articles.length : fallbackNewsItems.length
      setCurrentSlide((prev) => (prev === itemsLength - 1 ? 0 : prev + 1))
    }, 5000)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
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

  // Helper function to get the image URL
  const getImageUrl = (item: NewsItem): string => {
    if ('id' in item) {
      // This is an Article
      return item.image_url || '/placeholder.svg?height=1080&width=1920&text=Rugby News'
    }
    // This is a FallbackNewsItem
    return item.image
  }

  // Helper function to get description or content
  const getDescription = (item: NewsItem): string => {
    if ('id' in item) {
      // This is an Article
      return item.content.substring(0, 150) + '...'
    }
    // This is a FallbackNewsItem
    return item.description
  }

  // Helper function to check if item is an Article
  const isArticle = (item: NewsItem): item is Article => {
    return 'id' in item
  }

  // Helper function to check if item is a FallbackNewsItem
  const isFallbackNewsItem = (item: NewsItem): item is FallbackNewsItem => {
    return !('id' in item)
  }

  return (
    <MainLayout currentPage="HOME">
      <main className="flex-1">
        {/* Hero Section with News Carousel and Shapes */}
        <section className="relative h-[80vh] overflow-hidden">
          <div className="absolute inset-0 z-0">
            {articles.length > 0
              ? // Display real articles
                articles.map((article, index) => (
                  <div
                    key={article.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <NextImage
                      src={
                        article.image_url ||
                        '/placeholder.svg?height=1080&width=1920&text=Rugby News'
                      }
                      alt={article.title}
                      fill
                      className="object-cover brightness-90"
                      priority={index === 0}
                    />
                  </div>
                ))
              : // Display fallback news items
                fallbackNewsItems.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <NextImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover brightness-90"
                      priority={index === 0}
                    />
                  </div>
                ))}
          </div>

          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 to-transparent" />

          <div className="absolute inset-0 z-20 flex items-center justify-between px-4 sm:px-8">
            <button
              onClick={prevSlide}
              className="skew-x-[-12deg] transform bg-white/90 px-4 py-4 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900"
              aria-label="Previous slide"
            >
              <span className="inline-flex skew-x-[12deg] transform items-center">
                <ChevronLeft className="h-6 w-6" />
              </span>
            </button>
            <button
              onClick={nextSlide}
              className="skew-x-[-12deg] transform bg-white/90 px-4 py-4 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white hover:text-teal-900"
              aria-label="Next slide"
            >
              <span className="inline-flex skew-x-[12deg] transform items-center">
                <ChevronRight className="h-6 w-6" />
              </span>
            </button>
          </div>

          <div className="container relative z-10 mx-auto flex h-full flex-col items-start justify-center px-4 sm:px-6">
            <div className="clip-path-polygon relative rounded-none bg-white/80 p-6 backdrop-blur-sm sm:p-8">
              {/* Accent line */}
              <div className="absolute left-0 top-0 h-full w-1 bg-teal-800"></div>

              <h1 className="text-3xl font-extrabold uppercase leading-none tracking-tighter text-teal-900 sm:text-4xl md:text-5xl">
                {articles.length > 0 && currentSlide < articles.length
                  ? articles[currentSlide].title
                  : fallbackNewsItems[currentSlide % fallbackNewsItems.length].title}
              </h1>
              <p className="mt-4 max-w-xl text-base font-medium text-zinc-700 sm:text-lg">
                {articles.length > 0 && currentSlide < articles.length
                  ? articles[currentSlide].content.substring(0, 150) + '...'
                  : fallbackNewsItems[currentSlide % fallbackNewsItems.length].description}
              </p>
              <div className="mt-6">
                {articles.length > 0 && currentSlide < articles.length ? (
                  <Link href={`/news/${articles[currentSlide].id}`}>
                    <button className="skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                      <span className="inline-flex skew-x-[12deg] transform items-center">
                        READ MORE
                      </span>
                    </button>
                  </Link>
                ) : (
                  <button className="skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                    <span className="inline-flex skew-x-[12deg] transform items-center">
                      READ MORE
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
              {(articles.length > 0 ? articles : fallbackNewsItems).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-8 skew-x-[-12deg] transform transition-all duration-300 ${
                    index === currentSlide ? 'w-12 bg-teal-800' : 'bg-white/60 hover:bg-teal-50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Team Section with Parallax */}
        <SectionContainer className="overflow-hidden">
          <div
            className="absolute inset-0 top-[-40%] z-0 h-[180%]"
            style={{
              backgroundImage: "url('/AboutUs/parallax.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: 'transform 0.1s linear',
            }}
          />
          <div className="absolute inset-0 z-0 bg-white/85" />

          {/* Additional parallax elements */}

          <div className="relative z-10">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <SectionTitle title="ABOUT" titleHighlight="US" />
            </div>

            <GridContainer cols={2} gap="lg" className="items-center">
              <div
                className="transform overflow-hidden bg-white shadow-md transition-transform duration-300 hover:scale-[1.02]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 95% 100%, 0 100%)' }}
              >
                <NextImage
                  src={aboutUsData.imageUrl}
                  alt="Rugby Club Team"
                  width={800}
                  height={600}
                  className="h-auto w-full"
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold uppercase tracking-tight text-teal-900">
                  {aboutUsData.mission.title}
                </h3>
                <p className="mb-6 text-zinc-700">
                  {aboutUsData.mission.content.substring(0, 200)}...
                </p>
                <div className="mt-8">
                  <Link href="/about">
                    <button className="group skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                      <span className="inline-flex skew-x-[12deg] transform items-center">
                        LEARN MORE
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </GridContainer>
          </div>
        </SectionContainer>

        {/* Latest News Section */}
        <SectionContainer className="bg-gray-50">
          <div className="relative z-10">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <SectionTitle title="LATEST" titleHighlight="NEWS" />
            </div>

            <div className="mb-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {articles.length > 0
                ? // Display real articles
                  articles.slice(0, 3).map((article) => (
                    <Link href={`/news/${article.id}`} key={article.id} className="group block">
                      <div
                        className="flex h-full flex-col overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)' }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <NextImage
                            src={
                              article.image_url ||
                              '/placeholder.svg?height=600&width=900&text=Rugby News'
                            }
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                              {new Date(article.published_at).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          <h3 className="mt-2 text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700">
                            {article.title}
                          </h3>

                          <p className="mt-2 flex-1 text-sm text-zinc-600">
                            {article.content.length > 120
                              ? `${article.content.substring(0, 120)}...`
                              : article.content}
                          </p>

                          <div className="mt-4">
                            <span className="inline-flex items-center text-sm font-medium text-teal-800 group-hover:text-teal-600">
                              READ MORE
                              <svg
                                className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                : // Display fallback news items
                  fallbackNewsItems.slice(0, 3).map((item, index) => (
                    <Link href={`/news/${index + 1}`} key={index} className="group block">
                      <div
                        className="flex h-full flex-col overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)' }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <NextImage
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <CalendarDays className="h-4 w-4" />
                            <span>April 15, 2023</span>
                          </div>

                          <h3 className="mt-2 text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700">
                            {item.title}
                          </h3>

                          <p className="mt-2 flex-1 text-sm text-zinc-600">{item.description}</p>

                          <div className="mt-4">
                            <span className="inline-flex items-center text-sm font-medium text-teal-800 group-hover:text-teal-600">
                              READ MORE
                              <svg
                                className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>

            <div className="flex justify-center">
              <Link href="/news" className="group">
                <button className="skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    VIEW ALL NEWS
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </SectionContainer>

        {/* Gallery Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <SectionTitle title="PHOTO" titleHighlight="GALLERY" />
              <p className="mt-4 text-lg text-zinc-600">
                Explore our collections capturing the spirit and passion of our rugby club.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {loadingGallery ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-800 border-t-transparent"></div>
                </div>
              ) : galleries.length === 0 ? (
                <div className="col-span-full rounded-lg bg-teal-50 p-6 text-center">
                  <p className="text-lg text-teal-800">Check back soon for gallery updates!</p>
                </div>
              ) : (
                galleries.map((gallery) => (
                  <Link href={`/gallery/${gallery.id}`} key={gallery.id} className="group">
                    <div
                      className="relative transform cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 95%)' }}
                    >
                      {gallery.thumbnailUrl ? (
                        <NextImage
                          src={gallery.thumbnailUrl}
                          alt={gallery.title}
                          width={400}
                          height={300}
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
                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-teal-900/90 to-transparent p-4">
                        <h3 className="text-lg font-bold text-white">{gallery.title}</h3>
                        {gallery.description && (
                          <p className="line-clamp-2 text-sm text-teal-100">
                            {gallery.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-8 text-center">
              <Link href="/gallery" className="group">
                <button className="skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    VIEW ALL GALLERIES
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Matches Section */}
        <SectionContainer>
          <div className="mb-12 text-center">
            <SectionTitle title="UPCOMING" titleHighlight="MATCHES" />
          </div>

          <GridContainer cols={3} gap="md">
            {[1, 2, 3].map((match) => (
              <Card key={match} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2 text-teal-800">
                    <CalendarDays className="h-5 w-5" />
                    <span className="text-sm font-medium">Saturday, March 30th, 2024</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-teal-900">Riverside vs Eagles</h3>
                  <div className="mb-2 flex items-center gap-2 text-zinc-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Kick-off: 15:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Home Ground</span>
                  </div>
                  <button className="w-full skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                    <span className="inline-flex skew-x-[12deg] transform items-center">
                      MATCH DETAILS
                    </span>
                  </button>
                </CardContent>
              </Card>
            ))}
          </GridContainer>
        </SectionContainer>
      </main>
    </MainLayout>
  )
}
