'use client'

import { default as NextImage } from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { GridContainer } from '@/components/ui/grid-container'

interface NewsItem {
  id: number
  title: string
  description: string
  content: string
  image: string
  date: string
  author: string
}

export default function NewsPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Sample news data - in a real application, this would come from Supabase
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'SEASON OPENER THIS SATURDAY',
      description: 'Join us for our first match of the season against local rivals.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: '/placeholder.svg?height=600&width=900&text=Training Schedule',
      date: '2023-04-10',
      author: 'Team Manager',
    },
    {
      id: 3,
      title: 'COMMUNITY FUNDRAISER SUCCESS',
      description: 'Our recent community fundraiser raised over £2,000 for new training equipment.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: '/placeholder.svg?height=600&width=900&text=New Kit',
      date: '2023-03-25',
      author: 'Club Secretary',
    },
    {
      id: 6,
      title: 'JUNIOR RUGBY CAMP REGISTRATIONS OPEN',
      description: 'Summer rugby camp registrations are now open for children aged 7-14.',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: '/placeholder.svg?height=600&width=900&text=Junior Camp',
      date: '2023-03-20',
      author: 'Youth Development Officer',
    },
  ]

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('en-GB', options)
  }

  return (
    <MainLayout currentPage="NEWS">
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=Rugby News')",
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
                <span className="text-white">LATEST</span>
                <span className="ml-2 font-light italic text-white">NEWS</span>
              </h1>
              <div className="mx-auto mb-6 h-1 w-32 skew-x-[-12deg] transform bg-white"></div>
              <p className="text-xl text-teal-100">
                Stay up to date with the latest happenings from our club
              </p>
            </div>
          </div>
        </section>

        {/* News Articles Section */}
        <SectionContainer className="bg-white">
          <div className="relative z-10">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <SectionTitle title="CLUB" titleHighlight="NEWS" />
            </div>

            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item) => (
                <Link href={`/news/${item.id}`} key={item.id} className="group block h-full">
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
                        <span>{formatDate(item.date)}</span>
                      </div>

                      <h3 className="mt-2 text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700">
                        {item.title}
                      </h3>

                      <p className="mt-2 flex-1 text-sm text-zinc-600">{item.description}</p>

                      <div className="mt-4">
                        <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-teal-900">
                          <span className="inline-flex skew-x-[12deg] transform items-center">
                            READ MORE
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </SectionContainer>
      </main>
    </MainLayout>
  )
}
