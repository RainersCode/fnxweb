'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock, MapPin, Trophy, ChevronDown, Loader2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import { Fixture } from '@/types/supabase'
import { supabase } from '@/lib/supabase'

export default function FixturesPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const [upcomingFixtures, setUpcomingFixtures] = useState<Fixture[]>([])
  const [pastFixtures, setPastFixtures] = useState<Fixture[]>([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [loadingPast, setLoadingPast] = useState(true)

  // Fetch upcoming fixtures directly from Supabase
  useEffect(() => {
    const fetchUpcomingFixtures = async () => {
      setLoadingUpcoming(true)
      try {
        // Get today's date at midnight UTC
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        const { data, error } = await supabase
          .from('fixtures')
          .select('*')
          .gte('match_date', today.toISOString())
          .order('match_date', { ascending: true })

        if (error) {
          console.error('Error fetching upcoming fixtures:', error)
          throw error
        }

        setUpcomingFixtures(data || [])
      } catch (error) {
        console.error('Error fetching upcoming fixtures:', error)
        setUpcomingFixtures([])
      } finally {
        setLoadingUpcoming(false)
      }
    }

    fetchUpcomingFixtures()

    // Set up real-time subscription for upcoming fixtures
    const upcomingSubscription = supabase
      .channel('upcoming-fixtures')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'fixtures',
          filter: `match_date.gte.${new Date().toISOString()}`
        },
        () => {
          console.log('Upcoming fixtures changed, refreshing...')
          fetchUpcomingFixtures()
        }
      )
      .subscribe()

    return () => {
      upcomingSubscription.unsubscribe()
    }
  }, [])

  // Fetch past fixtures directly from Supabase
  useEffect(() => {
    const fetchPastFixtures = async () => {
      setLoadingPast(true)
      try {
        // Get today's date at midnight UTC
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)

        const { data, error } = await supabase
          .from('fixtures')
          .select('*')
          .lt('match_date', today.toISOString())
          .order('match_date', { ascending: false })

        if (error) {
          console.error('Error fetching past fixtures:', error)
          throw error
        }

        setPastFixtures(data || [])
      } catch (error) {
        console.error('Error fetching past fixtures:', error)
        setPastFixtures([])
      } finally {
        setLoadingPast(false)
      }
    }

    fetchPastFixtures()

    // Set up real-time subscription for past fixtures
    const pastSubscription = supabase
      .channel('past-fixtures')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'fixtures',
          filter: `match_date.lt.${new Date().toISOString()}`
        },
        () => {
          console.log('Past fixtures changed, refreshing...')
          fetchPastFixtures()
        }
      )
      .subscribe()

    return () => {
      pastSubscription.unsubscribe()
    }
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
    // Create date object from the ISO string (it will be converted to local time)
    const date = new Date(dateString)
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString('lv-LV', options)
  }

  // Extract time from date
  const extractTime = (dateString: string): string => {
    // Create date object from the ISO string (it will be converted to local time)
    const date = new Date(dateString)
    
    return date.toLocaleTimeString('lv-LV', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  // Determine club name (using "Our Team" as placeholder)
  const clubName = 'RK "Fēnikss"'

  // Helper function to format image URLs
  const getImageUrl = (url: string | null) => {
    if (!url) return null

    // Check if it's an SVG URL - if so, use a placeholder instead
    if (url.toLowerCase().endsWith('.svg') || url.includes('/svg')) {
      return '/placeholder.svg?height=128&width=128&text=Team'
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
          title="SPĒLES"
          titleHighlight="& REZULTĀTI"
          subtitle="Sekojiet līdzi visām mūsu gaidāmajām spēlēm un nesenajiem rezultātiem."
          backgroundImage="/AboutUs/parallax.jpg"
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
                  Gaidāmās spēles
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
                  Iepriekšējie rezultāti
                </span>
              </button>
            </div>

            {/* Upcoming Matches */}
            {activeTab === 'upcoming' && (
              <div className="space-y-6">
                {loadingUpcoming ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    <span>Ielāde...</span>
                  </div>
                ) : upcomingFixtures.length === 0 ? (
                  <div className="min-h-[300px] rounded-lg bg-teal-50 p-6 text-center">
                    <p className="text-lg text-teal-800">
                      Šobrīd nav ieplānotu gaidāmo spēļu.
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
                          {/* Modern team vs team layout */}
                          <div className="flex items-center justify-between mb-6">
                            {/* Home team */}
                            <div className="flex-1">
                              <div className="flex flex-col items-center">
                                <div className="h-20 w-20 relative overflow-hidden rounded-md bg-white shadow-md mb-3 border border-gray-100">
                                  {fixture.home_logo_url ? (
                                    shouldUseImageComponent(fixture.home_logo_url) ? (
                                      <Image
                                        src={
                                          getImageUrl(fixture.home_logo_url) ||
                                          '/placeholder.svg?height=128&width=128&text=Team'
                                        }
                                        alt={fixture.is_home_game ? clubName : fixture.opponent}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-800 font-bold">
                                        {fixture.is_home_game ? clubName[0] : fixture.opponent[0]}
                                      </div>
                                    )
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-800 font-bold">
                                      {fixture.is_home_game ? clubName[0] : fixture.opponent[0]}
                                    </div>
                                  )}
                                </div>
                                <h4 className="text-center font-bold text-teal-900">
                                  {fixture.is_home_game ? clubName : fixture.opponent}
                                </h4>
                              </div>
                            </div>

                            {/* Center score or VS badge */}
                            <div className="flex-shrink-0 px-4">
                              {fixture.score ? (
                                <div className="bg-teal-800 text-white font-bold text-xl py-2 px-6 rounded-md shadow-md">
                                  {fixture.score}
                                </div>
                              ) : (
                                <div className="bg-teal-100 text-teal-800 font-bold text-lg h-14 w-14 flex items-center justify-center rounded-md shadow-md border border-teal-200">
                                  VS
                                </div>
                              )}
                              <div className="mt-2 text-xs text-center text-zinc-500">
                                {fixture.is_home_game ? 'Mājas' : 'Izbraukumā'}
                              </div>
                            </div>

                            {/* Away team */}
                            <div className="flex-1">
                              <div className="flex flex-col items-center">
                                <div className="h-20 w-20 relative overflow-hidden rounded-md bg-white shadow-md mb-3 border border-gray-100">
                                  {fixture.away_logo_url ? (
                                    shouldUseImageComponent(fixture.away_logo_url) ? (
                                      <Image
                                        src={
                                          getImageUrl(fixture.away_logo_url) ||
                                          '/placeholder.svg?height=128&width=128&text=Team'
                                        }
                                        alt={fixture.is_home_game ? fixture.opponent : clubName}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-800 font-bold">
                                        {fixture.is_home_game ? fixture.opponent[0] : clubName[0]}
                                      </div>
                                    )
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-800 font-bold">
                                      {fixture.is_home_game ? fixture.opponent[0] : clubName[0]}
                                    </div>
                                  )}
                                </div>
                                <h4 className="text-center font-bold text-teal-900">
                                  {fixture.is_home_game ? fixture.opponent : clubName}
                                </h4>
                              </div>
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
                            {expandedMatch === fixture.id ? 'Slēpt detaļas' : 'Rādīt detaļas'}
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
                                    Spēles piezīmes:
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
                    <span>Ielāde rezultātu...</span>
                  </div>
                ) : pastFixtures.length === 0 ? (
                  <div className="min-h-[300px] rounded-lg bg-teal-50 p-6 text-center">
                    <p className="text-lg text-teal-800">Nav iepriekšējo spēļu, ko parādīt.</p>
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
                                ? 'UZVARA'
                                : fixture.result === 'loss'
                                  ? 'ZAUDĒJUMS'
                                  : 'NEIZŠĶIRTS'}
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          {/* Modern team vs team layout */}
                          <div className="flex items-center justify-between mb-6">
                            {/* Home team */}
                            <div className="flex-1">
                              <div className="flex flex-col items-center">
                                <div className="h-20 w-20 relative overflow-hidden rounded-md bg-white shadow-md mb-3 border border-gray-100">
                                  {fixture.home_logo_url ? (
                                    shouldUseImageComponent(fixture.home_logo_url) ? (
                                      <Image
                                        src={
                                          getImageUrl(fixture.home_logo_url) ||
                                          '/placeholder.svg?height=128&width=128&text=Team'
                                        }
                                        alt={fixture.is_home_game ? clubName : fixture.opponent}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-800 font-bold">
                                        {fixture.is_home_game ? clubName[0] : fixture.opponent[0]}
                                      </div>
                                    )
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-800 font-bold">
                                      {fixture.is_home_game ? clubName[0] : fixture.opponent[0]}
                                    </div>
                                  )}
                                </div>
                                <h4 className="text-center font-bold text-teal-900">
                                  {fixture.is_home_game ? clubName : fixture.opponent}
                                </h4>
                              </div>
                            </div>

                            {/* Center score or VS badge */}
                            <div className="flex-shrink-0 px-4">
                              {fixture.score ? (
                                <div className="bg-teal-800 text-white font-bold text-xl py-2 px-6 rounded-md shadow-md">
                                  {fixture.score}
                                </div>
                              ) : (
                                <div className="bg-teal-100 text-teal-800 font-bold text-lg h-14 w-14 flex items-center justify-center rounded-md shadow-md border border-teal-200">
                                  VS
                                </div>
                              )}
                              <div className="mt-2 text-xs text-center text-zinc-500">
                                {fixture.is_home_game ? 'Mājas' : 'Izbraukumā'}
                              </div>
                            </div>

                            {/* Away team */}
                            <div className="flex-1">
                              <div className="flex flex-col items-center">
                                <div className="h-20 w-20 relative overflow-hidden rounded-md bg-white shadow-md mb-3 border border-gray-100">
                                  {fixture.away_logo_url ? (
                                    shouldUseImageComponent(fixture.away_logo_url) ? (
                                      <Image
                                        src={
                                          getImageUrl(fixture.away_logo_url) ||
                                          '/placeholder.svg?height=128&width=128&text=Team'
                                        }
                                        alt={fixture.is_home_game ? fixture.opponent : clubName}
                                        fill
                                        className="object-contain p-1"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-800 font-bold">
                                        {fixture.is_home_game ? fixture.opponent[0] : clubName[0]}
                                      </div>
                                    )
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-800 font-bold">
                                      {fixture.is_home_game ? fixture.opponent[0] : clubName[0]}
                                    </div>
                                  )}
                                </div>
                                <h4 className="text-center font-bold text-teal-900">
                                  {fixture.is_home_game ? fixture.opponent : clubName}
                                </h4>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-zinc-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {fixture.location ||
                                  (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleMatchDetails(fixture.id)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-teal-50 py-2 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100"
                          >
                            {expandedMatch === fixture.id ? 'Slēpt detaļas' : 'Rādīt detaļas'}
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
                                    Spēles piezīmes:
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
