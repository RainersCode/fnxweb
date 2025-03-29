'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock, MapPin, Trophy, ChevronDown, Loader2 } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import { Fixture } from '@/types/supabase'

export default function FixturesPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const [upcomingFixtures, setUpcomingFixtures] = useState<Fixture[]>([])
  const [pastFixtures, setPastFixtures] = useState<Fixture[]>([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [loadingPast, setLoadingPast] = useState(true)

  // Fetch upcoming fixtures
  useEffect(() => {
    const fetchUpcomingFixtures = async () => {
      setLoadingUpcoming(true)
      try {
        const response = await fetch('/api/fixtures?type=upcoming')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setUpcomingFixtures(data || [])
      } catch (error) {
        console.error('Error fetching upcoming fixtures:', error)
      } finally {
        setLoadingUpcoming(false)
      }
    }

    fetchUpcomingFixtures()
  }, [])

  // Fetch past fixtures
  useEffect(() => {
    const fetchPastFixtures = async () => {
      setLoadingPast(true)
      try {
        const response = await fetch('/api/fixtures?type=past')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setPastFixtures(data || [])
      } catch (error) {
        console.error('Error fetching past fixtures:', error)
      } finally {
        setLoadingPast(false)
      }
    }

    fetchPastFixtures()
  }, [])

  const toggleMatchDetails = (id: string) => {
    if (expandedMatch === id) {
      setExpandedMatch(null)
    } else {
      setExpandedMatch(id)
    }
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('en-GB', options)
  }

  // Extract time from date
  const extractTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  // Determine club name (using "Our Team" as placeholder)
  const clubName = 'Our Team'

  // Helper function to format image URLs
  const getImageUrl = (url: string | null) => {
    if (!url) return null

    // Check if it's an SVG URL - if so, use a placeholder instead
    if (url.toLowerCase().endsWith('.svg') || url.includes('/svg')) {
      return '/placeholder.svg?height=64&width=64&text=Team'
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

  // Simple function to determine if we should use the Image component or a div
  const shouldUseImageComponent = (url: string | null) => {
    if (!url) return false
    if (url.toLowerCase().endsWith('.svg') || url.includes('/svg')) return false
    return true
  }

  return (
    <MainLayout currentPage="FIXTURES">
      <main className="flex-1">
        <ParallaxHeroSection
          title="FIXTURES"
          titleHighlight="& RESULTS"
          subtitle="Stay up to date with all our upcoming matches and recent results."
          backgroundImage="/placeholder.svg?height=1080&width=1920&text=Rugby Match"
        />

        {/* Fixtures Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Tabs */}
            <div className="mb-12 flex flex-wrap justify-center gap-4">
              <button
                className={`skew-x-[-12deg] transform px-6 py-3 font-medium tracking-wide transition-all duration-300 ${
                  activeTab === 'upcoming'
                    ? 'bg-teal-800 text-white'
                    : 'border border-teal-800 bg-white text-teal-800 hover:bg-teal-50'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                <span className="inline-flex skew-x-[12deg] transform items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Upcoming Matches
                </span>
              </button>
              <button
                className={`skew-x-[-12deg] transform px-6 py-3 font-medium tracking-wide transition-all duration-300 ${
                  activeTab === 'past'
                    ? 'bg-teal-800 text-white'
                    : 'border border-teal-800 bg-white text-teal-800 hover:bg-teal-50'
                }`}
                onClick={() => setActiveTab('past')}
              >
                <span className="inline-flex skew-x-[12deg] transform items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Past Results
                </span>
              </button>
            </div>

            {/* Upcoming Matches */}
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                {loadingUpcoming ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span>Loading fixtures...</span>
                  </div>
                ) : upcomingFixtures.length === 0 ? (
                  <div className="min-h-[300px] rounded-lg bg-teal-50 p-6 text-center">
                    <p className="text-lg text-teal-800">
                      No upcoming matches scheduled at the moment.
                    </p>
                  </div>
                ) : (
                  upcomingFixtures.map((fixture) => (
                    <Card
                      key={fixture.id}
                      className="overflow-hidden border-none bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between bg-teal-800 p-3 text-white">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {formatDate(fixture.match_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {extractTime(fixture.match_date)}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-1 flex-col items-center">
                              <div className="relative h-16 w-16 rotate-45 transform overflow-hidden bg-zinc-100">
                                <div className="absolute inset-0 flex -rotate-45 transform items-center justify-center">
                                  {fixture.home_logo_url ? (
                                    shouldUseImageComponent(fixture.home_logo_url) ? (
                                      <Image
                                        src={
                                          getImageUrl(fixture.home_logo_url) ||
                                          '/placeholder.svg?height=64&width=64&text=Team'
                                        }
                                        alt={fixture.is_home_game ? clubName : fixture.opponent}
                                        width={64}
                                        height={64}
                                        className="h-12 w-12 object-contain"
                                      />
                                    ) : (
                                      <div className="flex h-12 w-12 items-center justify-center bg-zinc-200 text-zinc-500">
                                        {fixture.is_home_game ? clubName[0] : fixture.opponent[0]}
                                      </div>
                                    )
                                  ) : (
                                    <span className="text-center text-xs font-medium text-zinc-500">
                                      {fixture.is_home_game ? clubName : fixture.opponent}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <h4 className="mt-4 text-center text-sm font-medium text-zinc-800">
                                {fixture.is_home_game ? clubName : fixture.opponent}
                              </h4>
                            </div>

                            <div className="flex flex-col items-center px-4">
                              <div className="flex items-baseline space-x-1">
                                <span className="text-2xl font-bold text-teal-900">VS</span>
                              </div>
                              <div className="mt-1 text-xs text-zinc-500">
                                {fixture.is_home_game ? 'Home' : 'Away'}
                              </div>
                            </div>

                            <div className="flex flex-1 flex-col items-center">
                              <div className="relative h-16 w-16 rotate-45 transform overflow-hidden bg-zinc-100">
                                <div className="absolute inset-0 flex -rotate-45 transform items-center justify-center">
                                  {fixture.away_logo_url ? (
                                    shouldUseImageComponent(fixture.away_logo_url) ? (
                                      <Image
                                        src={
                                          getImageUrl(fixture.away_logo_url) ||
                                          '/placeholder.svg?height=64&width=64&text=Team'
                                        }
                                        alt={fixture.is_home_game ? fixture.opponent : clubName}
                                        width={64}
                                        height={64}
                                        className="h-12 w-12 object-contain"
                                      />
                                    ) : (
                                      <div className="flex h-12 w-12 items-center justify-center bg-zinc-200 text-zinc-500">
                                        {fixture.is_home_game ? fixture.opponent[0] : clubName[0]}
                                      </div>
                                    )
                                  ) : (
                                    <span className="text-center text-xs font-medium text-zinc-500">
                                      {fixture.is_home_game ? fixture.opponent : clubName}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <h4 className="mt-4 text-center text-sm font-medium text-zinc-800">
                                {fixture.is_home_game ? fixture.opponent : clubName}
                              </h4>
                            </div>
                          </div>

                          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-zinc-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {fixture.location ||
                                  (fixture.is_home_game ? 'Home Ground' : 'Away')}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleMatchDetails(fixture.id)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-teal-50 py-2 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100"
                          >
                            {expandedMatch === fixture.id ? 'Hide Details' : 'Show Details'}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedMatch === fixture.id ? 'rotate-180 transform' : ''
                              }`}
                            />
                          </button>

                          {expandedMatch === fixture.id && (
                            <div className="mt-4 rounded-md bg-zinc-50 p-4">
                              {fixture.description && (
                                <div className="mb-3">
                                  <h5 className="mb-1 text-sm font-medium text-zinc-800">
                                    Match Notes:
                                  </h5>
                                  <p className="text-sm text-zinc-600">{fixture.description}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Past Results */}
            {activeTab === 'past' && (
              <div className="space-y-6">
                {loadingPast ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span>Loading results...</span>
                  </div>
                ) : pastFixtures.length === 0 ? (
                  <div className="min-h-[300px] rounded-lg bg-teal-50 p-6 text-center">
                    <p className="text-lg text-teal-800">No past matches to display.</p>
                  </div>
                ) : (
                  pastFixtures.map((fixture) => (
                    <Card
                      key={fixture.id}
                      className="overflow-hidden border-none bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between bg-teal-800 p-3 text-white">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {formatDate(fixture.match_date)}
                            </span>
                          </div>
                          {fixture.result && (
                            <div
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                fixture.result === 'win'
                                  ? 'bg-green-600'
                                  : fixture.result === 'loss'
                                    ? 'bg-red-600'
                                    : 'bg-amber-600'
                              }`}
                            >
                              {fixture.result === 'win'
                                ? 'WIN'
                                : fixture.result === 'loss'
                                  ? 'LOSS'
                                  : 'DRAW'}
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-1 flex-col items-center">
                              <div className="relative h-16 w-16 rotate-45 transform overflow-hidden bg-zinc-100">
                                <div className="absolute inset-0 flex -rotate-45 transform items-center justify-center">
                                  {fixture.home_logo_url ? (
                                    shouldUseImageComponent(fixture.home_logo_url) ? (
                                      <Image
                                        src={
                                          getImageUrl(fixture.home_logo_url) ||
                                          '/placeholder.svg?height=64&width=64&text=Team'
                                        }
                                        alt={fixture.is_home_game ? clubName : fixture.opponent}
                                        width={64}
                                        height={64}
                                        className="h-12 w-12 object-contain"
                                      />
                                    ) : (
                                      <div className="flex h-12 w-12 items-center justify-center bg-zinc-200 text-zinc-500">
                                        {fixture.is_home_game ? clubName[0] : fixture.opponent[0]}
                                      </div>
                                    )
                                  ) : (
                                    <span className="text-center text-xs font-medium text-zinc-500">
                                      {fixture.is_home_game ? clubName : fixture.opponent}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <h4 className="mt-4 text-center text-sm font-medium text-zinc-800">
                                {fixture.is_home_game ? clubName : fixture.opponent}
                              </h4>
                            </div>

                            <div className="flex flex-col items-center px-4">
                              {fixture.score ? (
                                <div className="flex items-baseline space-x-1">
                                  <span className="text-2xl font-bold text-teal-900">
                                    {fixture.score}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-baseline space-x-1">
                                  <span className="text-2xl font-bold text-teal-900">VS</span>
                                </div>
                              )}
                              <div className="mt-1 text-xs text-zinc-500">
                                {fixture.is_home_game ? 'Home' : 'Away'}
                              </div>
                            </div>

                            <div className="flex flex-1 flex-col items-center">
                              <div className="relative h-16 w-16 rotate-45 transform overflow-hidden bg-zinc-100">
                                <div className="absolute inset-0 flex -rotate-45 transform items-center justify-center">
                                  {fixture.away_logo_url ? (
                                    shouldUseImageComponent(fixture.away_logo_url) ? (
                                      <Image
                                        src={
                                          getImageUrl(fixture.away_logo_url) ||
                                          '/placeholder.svg?height=64&width=64&text=Team'
                                        }
                                        alt={fixture.is_home_game ? fixture.opponent : clubName}
                                        width={64}
                                        height={64}
                                        className="h-12 w-12 object-contain"
                                      />
                                    ) : (
                                      <div className="flex h-12 w-12 items-center justify-center bg-zinc-200 text-zinc-500">
                                        {fixture.is_home_game ? fixture.opponent[0] : clubName[0]}
                                      </div>
                                    )
                                  ) : (
                                    <span className="text-center text-xs font-medium text-zinc-500">
                                      {fixture.is_home_game ? fixture.opponent : clubName}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <h4 className="mt-4 text-center text-sm font-medium text-zinc-800">
                                {fixture.is_home_game ? fixture.opponent : clubName}
                              </h4>
                            </div>
                          </div>

                          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-zinc-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {fixture.location ||
                                  (fixture.is_home_game ? 'Home Ground' : 'Away')}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleMatchDetails(fixture.id)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-teal-50 py-2 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100"
                          >
                            {expandedMatch === fixture.id ? 'Hide Details' : 'Show Details'}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedMatch === fixture.id ? 'rotate-180 transform' : ''
                              }`}
                            />
                          </button>

                          {expandedMatch === fixture.id && (
                            <div className="mt-4 rounded-md bg-zinc-50 p-4">
                              {fixture.description && (
                                <div className="mb-3">
                                  <h5 className="mb-1 text-sm font-medium text-zinc-800">
                                    Match Notes:
                                  </h5>
                                  <p className="text-sm text-zinc-600">{fixture.description}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
