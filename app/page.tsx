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
  const [scrollY, setScrollY] = useState(0)
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

  // Setup direct DOM access for the link button
  useEffect(() => {
    // Create a hidden link element that we can trigger programmatically
    const createDirectLink = () => {
      // Remove any existing link first
      const existingLink = document.getElementById('direct-read-more-link');
      if (existingLink) {
        existingLink.remove();
      }
      
      // Create new link
      const linkElement = document.createElement('a');
      linkElement.id = 'direct-read-more-link';
      linkElement.style.position = 'absolute';
      linkElement.style.bottom = '100px';
      linkElement.style.left = '50%';
      linkElement.style.transform = 'translateX(-50%) skew(-12deg)';
      linkElement.style.zIndex = '20';
      linkElement.style.backgroundColor = '#115e59';
      linkElement.style.color = 'white';
      // Responsive padding for different screen sizes
      linkElement.style.padding = window.innerWidth < 640 ? '10px 20px' : '12px 24px';
      // Responsive font size for different screen sizes
      linkElement.style.fontSize = window.innerWidth < 640 ? '14px' : '16px';
      linkElement.style.fontWeight = 'bold';
      linkElement.style.textDecoration = 'none';
      linkElement.style.display = 'inline-block';
      linkElement.style.cursor = 'pointer';
      linkElement.style.boxShadow = '0 0 10px rgba(20, 184, 166, 0.5)';
      linkElement.style.border = '2px solid transparent';
      linkElement.style.transition = 'all 0.3s ease';
      linkElement.style.animation = 'glow-border 2s infinite';
      
      // Set the link destination
      if (articles.length > 0 && currentSlide < articles.length) {
        linkElement.href = `/news/${articles[currentSlide].id}`;
      } else {
        linkElement.href = `/news/${currentSlide + 1}`;
      }
      
      // Create and append the inner span
      const spanElement = document.createElement('span');
      spanElement.style.display = 'inline-flex';
      spanElement.style.transform = 'skew(12deg)';
      spanElement.style.alignItems = 'center';
      spanElement.textContent = 'LASĪT VAIRĀK';
      linkElement.appendChild(spanElement);
      
      // Create and append animation keyframes
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes glow-border {
          0% { border-color: rgba(20, 184, 166, 0.2); box-shadow: 0 0 5px rgba(20, 184, 166, 0.2); }
          50% { border-color: rgba(20, 184, 166, 0.8); box-shadow: 0 0 20px rgba(20, 184, 166, 0.6); }
          100% { border-color: rgba(20, 184, 166, 0.2); box-shadow: 0 0 5px rgba(20, 184, 166, 0.2); }
        }
      `;
      document.head.appendChild(styleElement);
      
      // Add hover effects
      linkElement.onmouseover = function() {
        this.style.backgroundColor = '#134e4a';
        this.style.boxShadow = '0 0 15px rgba(20, 184, 166, 0.8)';
        this.style.transform = 'translateX(-50%) skew(-12deg) scale(1.05)';
      };
      
      linkElement.onmouseout = function() {
        this.style.backgroundColor = '#115e59';
        this.style.boxShadow = '0 0 10px rgba(20, 184, 166, 0.5)';
        this.style.transform = 'translateX(-50%) skew(-12deg)';
      };
      
      // Append to the hero section
      const heroSection = document.querySelector('.relative.h-\\[80vh\\]');
      if (heroSection) {
        heroSection.appendChild(linkElement);
      } else {
        document.body.appendChild(linkElement);
      }
    };
    
    // Call immediately
    createDirectLink();
    
    // Update whenever the slide changes
    return () => {
      const existingLink = document.getElementById('direct-read-more-link');
      if (existingLink) {
        existingLink.remove();
      }
      // Remove animation style
      const styleElement = document.querySelector('style');
      if (styleElement && styleElement.textContent.includes('glow-border')) {
        styleElement.remove();
      }
    };
  }, [currentSlide, articles.length, articles]);

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
              className="skew-x-[-12deg] transform bg-white/30 px-4 py-4 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white/50 hover:text-teal-900"
              aria-label="Previous slide"
            >
              <span className="inline-flex skew-x-[12deg] transform items-center">
                <ChevronLeft className="h-6 w-6" />
              </span>
            </button>
            <button
              onClick={nextSlide}
              className="skew-x-[-12deg] transform bg-white/30 px-4 py-4 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-white/50 hover:text-teal-900"
              aria-label="Next slide"
            >
              <span className="inline-flex skew-x-[12deg] transform items-center">
                <ChevronRight className="h-6 w-6" />
              </span>
            </button>
          </div>

          <div className="container relative z-10 mx-auto flex h-full flex-col items-start justify-center px-4 sm:px-6">
            {/* Content box with same skew as button */}
            <div className="bg-white/80 backdrop-blur-sm max-w-2xl skew-x-[-12deg] transform" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}>
              {/* Header Box */}
              <div className="relative border-l-4 border-teal-800 p-4 sm:p-6">
                <h1 className="text-2xl font-extrabold uppercase leading-tight tracking-tighter text-teal-900 sm:text-4xl md:text-5xl skew-x-[12deg] transform">
                  {articles.length > 0 && currentSlide < articles.length
                    ? articles[currentSlide].title
                    : fallbackNewsItems[currentSlide % fallbackNewsItems.length].title}
                </h1>
                
                <p className="mt-2 sm:mt-4 max-w-xl text-sm font-medium text-zinc-700 sm:text-lg skew-x-[12deg] transform">
                  {articles.length > 0 && currentSlide < articles.length
                    ? stripHtml(articles[currentSlide].content).substring(0, 150) + '...'
                    : fallbackNewsItems[currentSlide % fallbackNewsItems.length].description}
                </p>
              </div>
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
              <SectionTitle title="PAR" titleHighlight="MUMS" />
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
                        UZZINĀT VAIRĀK
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
              <SectionTitle title="JAUNĀKĀS" titleHighlight="ZIŅAS" />
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
                            {(() => {
                              const plainText = stripHtml(article.content)
                              return plainText.length > 120
                                ? `${plainText.substring(0, 120)}...`
                                : plainText
                            })()}
                          </p>

                          <div className="mt-4">
                            <span className="inline-flex items-center text-sm font-medium text-teal-800 group-hover:text-teal-600">
                              LASĪT VAIRĀK
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
                              LASĪT VAIRĀK
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
                    SKATĪT VISAS ZIŅAS
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
              <SectionTitle title="FOTO" titleHighlight="GALERIJA" />
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {loadingGallery ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-800 border-t-transparent"></div>
                </div>
              ) : galleries.length === 0 ? (
                <div className="col-span-full rounded-lg bg-teal-50 p-6 text-center">
                  <p className="text-lg text-teal-800">Drīzumā sekojiet galerijas atjauninājumiem!</p>
                </div>
              ) : (
                galleries.map((gallery) => (
                  <Link href={`/gallery/${gallery.id}`} key={gallery.id} className="group">
                    <div
                      className="relative transform cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                      style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 95%)' }}
                    >
                      {gallery.thumbnailUrl ? (
                        isSvgUrl(gallery.thumbnailUrl) ? (
                          <div className="flex h-64 w-full items-center justify-center bg-teal-100">
                            <div className="text-center">
                              <ImageIcon className="mx-auto h-12 w-12 text-teal-800/50" />
                              <p className="mt-2 text-sm text-teal-800/70">{gallery.title}</p>
                            </div>
                          </div>
                        ) : (
                          <NextImage
                            src={getImageUrl(gallery.thumbnailUrl)}
                            alt={gallery.title}
                            width={400}
                            height={300}
                            className="h-64 w-full object-cover"
                          />
                        )
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
                    SKATĪT VISAS GALERIJAS
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
            <SectionTitle title="GAIDĀMĀS" titleHighlight="SPĒLES" />
          </div>

          {loadingFixtures ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-800 border-t-transparent"></div>
            </div>
          ) : fixtures.length === 0 ? (
            <div className="rounded-lg bg-teal-50 p-6 text-center">
              <p className="text-lg text-teal-800">Šobrīd nav plānotas gaidāmās spēles.</p>
            </div>
          ) : (
            <GridContainer cols={3} gap="md">
              {fixtures.map((fixture) => (
                <Card key={fixture.id} className="relative overflow-hidden bg-white">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2 text-teal-800">
                      <CalendarDays className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {formatMatchDate(fixture.match_date)}
                      </span>
                    </div>
                    
                    {/* Modern team vs team display */}
                    <div className="mb-5 flex items-center justify-between">
                      {/* Home team */}
                      <div className="flex flex-col items-center gap-2 w-2/5">
                        <div className="h-16 w-16 relative overflow-hidden rounded-md bg-white shadow-md border border-gray-100">
                          <NextImage
                            src={fixture.home_logo_url || "/Logo/fēniks_logo-removebg-preview.png"}
                            alt="RK Fēnikss"
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <span className="text-center font-bold text-teal-900 text-sm">
                          {fixture.is_home_game ? 'RK "Fēnikss"' : fixture.opponent}
                        </span>
                      </div>
                      
                      {/* VS badge */}
                      <div className="w-1/5 flex-shrink-0">
                        <div className="bg-teal-100 text-teal-800 font-bold text-xs rounded-md h-10 w-10 flex items-center justify-center mx-auto shadow-sm border border-teal-200">
                          VS
                        </div>
                      </div>
                      
                      {/* Away team */}
                      <div className="flex flex-col items-center gap-2 w-2/5">
                        <div className="h-16 w-16 relative overflow-hidden rounded-md bg-white shadow-md border border-gray-100">
                          <NextImage
                            src={fixture.away_logo_url || "/placeholder.svg?height=48&width=48&text=Team"}
                            alt={fixture.opponent}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <span className="text-center font-bold text-teal-900 text-sm">
                          {fixture.is_home_game ? fixture.opponent : 'RK "Fēnikss"'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Clock className="h-4 w-4 text-teal-700" />
                        <span className="text-sm">
                          Sākums: {extractTimeFromDate(fixture.match_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600">
                        <MapPin className="h-4 w-4 text-teal-700" />
                        <span className="text-sm">
                          {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                        </span>
                      </div>
                    </div>
                    
                    <Link href="/fixtures" className="mt-5 block">
                      <button className="w-full skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                        <span className="inline-flex skew-x-[12deg] transform items-center justify-center">
                          SPĒLES DETAĻAS
                        </span>
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </GridContainer>
          )}
          {fixtures.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Link href="/fixtures" className="group">
                <button className="skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    SKATĪT VISAS SPĒLES
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          )}
        </SectionContainer>

        {/* Sponsors Section */}
        <SectionContainer withBackground={true} className="relative overflow-hidden">
          {/* Grey Logo Background */}
          <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
            <NextImage
              src="/Grey Logo.png"
              alt="Grey Logo Background"
              fill
              className="object-contain object-center"
            />
          </div>
          
          <div className="mb-12 text-center relative z-10">
            <SectionTitle title="MŪSU" titleHighlight="ATBALSTĪTĀJI" />
          </div>

          <div className="flex flex-wrap justify-center gap-8 items-center relative z-10">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <div 
                key={num} 
                className="relative w-full max-w-[200px] h-[100px] flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
              >
                <NextImage
                  src={num === 7 
                    ? `/SponsorsImages/sponsoru_logo_7-removebg-preview.png`
                    : `/SponsorsImages/Sponsor${num === 1 ? '' : 'u'}_logo_${num}-removebg-preview.png`
                  }
                  alt={`Sponsor ${num}`}
                  width={180}
                  height={80}
                  className="object-contain max-h-full"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center relative z-10">
           
            <Link href="/contact" className="group">
              <button className="skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                <span className="inline-flex skew-x-[12deg] transform items-center">
                  KĻŪT PAR ATBALSTĪTĀJU
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </Link>
          </div>
        </SectionContainer>
      </main>
    </MainLayout>
  )
}
