'use client'

import { default as NextImage } from 'next/image'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Facebook, Share2, User } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { SectionContainer } from '@/components/shared/section-container'

interface NewsItem {
  id: number
  title: string
  description: string
  content: string
  image: string
  date: string
  author: string
}

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  const id = params.id as string

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // This would be fetched from Supabase in a real application
  useEffect(() => {
    // Simulate API call
    setIsLoading(true)

    // Sample data - in a real app, this would be fetched from Supabase
    const mockNewsItems: NewsItem[] = [
      {
        id: 1,
        title: 'SEASON OPENER THIS SATURDAY',
        description: 'Join us for our first match of the season against local rivals.',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
        image: '/placeholder.svg?height=600&width=900&text=Season Opener',
        date: '2023-04-15',
        author: 'Coach Williams',
      },
      {
        id: 2,
        title: 'NEW TRAINING SCHEDULE',
        description:
          'Coach Williams has announced the new training schedule for the upcoming season.',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
        image: '/placeholder.svg?height=600&width=900&text=Training Schedule',
        date: '2023-04-10',
        author: 'Team Manager',
      },
      {
        id: 3,
        title: 'COMMUNITY FUNDRAISER SUCCESS',
        description:
          'Our recent community fundraiser raised over £2,000 for new training equipment.',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
        image: '/placeholder.svg?height=600&width=900&text=Fundraiser',
        date: '2023-04-05',
        author: 'Events Coordinator',
      },
      {
        id: 4,
        title: 'PLAYER OF THE MONTH ANNOUNCED',
        description:
          'Congratulations to James Thompson for being named Player of the Month for March!',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
        image: '/placeholder.svg?height=600&width=900&text=Player of the Month',
        date: '2023-04-01',
        author: 'Coaching Staff',
      },
      {
        id: 5,
        title: 'NEW TEAM KIT UNVEILED',
        description:
          'Check out our brand new team kit for the upcoming season, now available in the club shop.',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
        image: '/placeholder.svg?height=600&width=900&text=New Kit',
        date: '2023-03-25',
        author: 'Club Secretary',
      },
      {
        id: 6,
        title: 'JUNIOR RUGBY CAMP REGISTRATIONS OPEN',
        description: 'Summer rugby camp registrations are now open for children aged 7-14.',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
        image: '/placeholder.svg?height=600&width=900&text=Junior Camp',
        date: '2023-03-20',
        author: 'Youth Development Officer',
      },
    ]

    // Find the news item by ID
    const foundItem = mockNewsItems.find((item) => item.id === parseInt(id))

    if (foundItem) {
      setNewsItem(foundItem)
    }

    setIsLoading(false)
  }, [id])

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('en-GB', options)
  }

  // Handle Facebook sharing
  const handleShareToFacebook = () => {
    const url = window.location.href
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  }

  if (isLoading) {
    return (
      <MainLayout currentPage="NEWS">
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

  if (!newsItem) {
    return (
      <MainLayout currentPage="NEWS">
        <main className="flex-1 pb-16">
          <SectionContainer className="bg-white">
            <div className="py-16 text-center">
              <h2 className="text-2xl font-bold text-gray-700">News article not found</h2>
              <p className="mt-4 text-gray-600">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/news" className="mt-8 inline-block">
                <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to News
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
    <MainLayout currentPage="NEWS">
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${newsItem.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: 'transform 0.1s linear',
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-900/80 to-teal-700/80" />

          {/* Decorative elements */}
          <div className="absolute right-[10%] top-20 z-0 h-32 w-32 rounded-full bg-teal-500/20 blur-xl"></div>
          <div className="absolute bottom-20 left-[5%] z-0 h-64 w-64 rounded-full bg-teal-700/10 blur-xl"></div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="text-white">{newsItem.title}</span>
              </h1>
              <div className="mx-auto mb-6 h-1 w-32 skew-x-[-12deg] transform bg-white"></div>
              <div className="flex justify-center gap-4 text-teal-100">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-5 w-5" />
                  <span>{formatDate(newsItem.date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-5 w-5" />
                  <span>{newsItem.author}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <SectionContainer className="bg-white">
          <div className="relative z-10 -mt-16">
            <div
              className="mx-auto max-w-3xl overflow-hidden bg-white p-8 shadow-xl"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)' }}
            >
              {/* Back button */}
              <Link href="/news" className="inline-flex items-center">
                <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to News
                  </span>
                </span>
              </Link>

              {/* Article content */}
              <div className="prose prose-teal mt-8 max-w-none">
                {newsItem.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-zinc-700">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share buttons */}
              <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-6">
                <span className="font-medium text-zinc-700">Share this article:</span>
                <button
                  onClick={handleShareToFacebook}
                  className="inline-flex skew-x-[-12deg] transform items-center bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    <Facebook className="mr-1 h-4 w-4" /> Share on Facebook
                  </span>
                </button>
              </div>
            </div>
          </div>
        </SectionContainer>
      </main>
    </MainLayout>
  )
}
