'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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

  useEffect(() => {
    const fetchUpcomingFixtures = async () => {
      setLoadingUpcoming(true)
      try {
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

    const upcomingSubscription = supabase
      .channel('upcoming-fixtures')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fixtures',
          filter: `match_date.gte.${new Date().toISOString()}`,
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

  useEffect(() => {
    const fetchPastFixtures = async () => {
      setLoadingPast(true)
      try {
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

    const pastSubscription = supabase
      .channel('past-fixtures')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fixtures',
          filter: `match_date.lt.${new Date().toISOString()}`,
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString('lv-LV', options)
  }

  const extractTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('lv-LV', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const clubName = 'RK "Fēnikss"'

  const getImageUrl = (url: string | null) => {
    if (!url) return null
    if (url.toLowerCase().endsWith('.svg') || url.includes('/svg')) {
      return '/placeholder.svg?height=128&width=128&text=Team'
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    if (url.includes('supabase')) {
      return url.replace(/\s/g, '%20')
    }
    return url
  }

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
                <CalendarDays className="h-5 w-5 text-teal-600" />
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-teal-900">SPĒĻU </span>
                <span className="text-teal-600 italic font-light">KALENDĀRS</span>
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
            </div>

            {/* Tabs */}
            <div className="mb-12 flex flex-wrap justify-center gap-4">
              <button
                className={`relative h-14 px-8 shadow-md border-b-4 transition-all duration-300 skew-x-[-6deg] ${
                  activeTab === 'upcoming'
                    ? 'bg-teal-800 text-white border-teal-600 shadow-lg'
                    : 'bg-white text-teal-800 border-transparent hover:border-teal-300 hover:shadow-lg'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                <span className="inline-flex skew-x-[6deg] items-center gap-2 font-bold tracking-wide">
                  <CalendarDays className="h-5 w-5" />
                  GAIDĀMĀS SPĒLES
                </span>
              </button>
              <button
                className={`relative h-14 px-8 shadow-md border-b-4 transition-all duration-300 skew-x-[-6deg] ${
                  activeTab === 'past'
                    ? 'bg-teal-800 text-white border-teal-600 shadow-lg'
                    : 'bg-white text-teal-800 border-transparent hover:border-teal-300 hover:shadow-lg'
                }`}
                onClick={() => setActiveTab('past')}
              >
                <span className="inline-flex skew-x-[6deg] items-center gap-2 font-bold tracking-wide">
                  <Trophy className="h-5 w-5" />
                  REZULTĀTI
                </span>
              </button>
            </div>

            {/* Upcoming Matches */}
            {activeTab === 'upcoming' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {loadingUpcoming ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
                      <span className="text-teal-700 font-medium">Ielādē spēles...</span>
                    </div>
                  </div>
                ) : upcomingFixtures.length === 0 ? (
                  <div className="bg-teal-50 border border-teal-100 p-12 text-center">
                    <CalendarDays className="mx-auto h-16 w-16 text-teal-300 mb-4" />
                    <p className="text-xl font-bold text-teal-800 mb-2">Nav gaidāmo spēļu</p>
                    <p className="text-teal-600">Šobrīd nav ieplānotu gaidāmo spēļu.</p>
                  </div>
                ) : (
                  upcomingFixtures.map((fixture, index) => (
                    <div
                      key={fixture.id}
                      className="group relative bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    >
                      {/* Top accent */}
                      <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                      {/* Next match badge */}
                      {index === 0 && (
                        <div className="absolute top-6 right-0 z-10">
                          <div className="skew-x-[-12deg] transform bg-teal-600 px-4 py-1 shadow-lg translate-x-1">
                            <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">
                              Nākamā spēle
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Date header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-teal-50 flex items-center justify-center skew-x-[-6deg]">
                            <CalendarDays className="h-6 w-6 text-teal-600 skew-x-[6deg]" />
                          </div>
                          <div>
                            <p className="font-bold text-teal-900 capitalize">
                              {formatDate(fixture.match_date)}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-zinc-500">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{extractTime(fixture.match_date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="skew-x-[-6deg] bg-teal-100 px-3 py-1">
                          <span className="skew-x-[6deg] inline-block text-xs font-bold text-teal-700 uppercase">
                            {fixture.is_home_game ? 'Mājas' : 'Izbraukumā'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 md:p-8">
                        {/* Teams layout */}
                        <div className="flex items-center justify-between">
                          {/* Home team */}
                          <div className="flex-1">
                            <div className="flex flex-col items-center">
                              <div className="h-24 w-24 relative overflow-hidden bg-white shadow-lg mb-4 border-2 border-gray-100 p-2 group-hover:border-teal-200 transition-colors">
                                {fixture.home_logo_url && shouldUseImageComponent(fixture.home_logo_url) ? (
                                  <Image
                                    src={getImageUrl(fixture.home_logo_url) || '/placeholder.svg?height=128&width=128&text=Team'}
                                    alt={fixture.is_home_game ? clubName : fixture.opponent}
                                    fill
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-800 text-2xl font-bold">
                                    {fixture.is_home_game ? 'F' : fixture.opponent[0]}
                                  </div>
                                )}
                              </div>
                              <h4 className="text-center font-bold text-teal-900 text-lg">
                                {fixture.is_home_game ? clubName : fixture.opponent}
                              </h4>
                            </div>
                          </div>

                          {/* VS badge */}
                          <div className="flex-shrink-0 px-6">
                            <div className="bg-teal-700 text-white font-bold text-lg skew-x-[-12deg] h-14 w-14 flex items-center justify-center shadow-lg">
                              <span className="skew-x-[12deg]">VS</span>
                            </div>
                          </div>

                          {/* Away team */}
                          <div className="flex-1">
                            <div className="flex flex-col items-center">
                              <div className="h-24 w-24 relative overflow-hidden bg-white shadow-lg mb-4 border-2 border-gray-100 p-2 group-hover:border-teal-200 transition-colors">
                                {fixture.away_logo_url && shouldUseImageComponent(fixture.away_logo_url) ? (
                                  <Image
                                    src={getImageUrl(fixture.away_logo_url) || '/placeholder.svg?height=128&width=128&text=Team'}
                                    alt={fixture.is_home_game ? fixture.opponent : clubName}
                                    fill
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-800 text-2xl font-bold">
                                    {fixture.is_home_game ? fixture.opponent[0] : 'F'}
                                  </div>
                                )}
                              </div>
                              <h4 className="text-center font-bold text-teal-900 text-lg">
                                {fixture.is_home_game ? fixture.opponent : clubName}
                              </h4>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-zinc-600 py-3 border-t border-gray-100">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-medium">
                            {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                          </span>
                        </div>

                        {/* Details button */}
                        {fixture.description && (
                          <>
                            <button
                              onClick={() => toggleMatchDetails(fixture.id)}
                              className="mt-4 flex w-full items-center justify-center gap-2 skew-x-[-6deg] bg-teal-50 py-3 text-sm font-bold text-teal-800 transition-all hover:bg-teal-100"
                            >
                              <span className="skew-x-[6deg] inline-flex items-center gap-2">
                                {expandedMatch === fixture.id ? 'SLĒPT DETAĻAS' : 'RĀDĪT DETAĻAS'}
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-300 ${
                                    expandedMatch === fixture.id ? 'rotate-180' : ''
                                  }`}
                                />
                              </span>
                            </button>

                            {expandedMatch === fixture.id && (
                              <div className="mt-4 bg-zinc-50 p-4 border-l-4 border-teal-600">
                                <h5 className="mb-2 text-sm font-bold text-teal-900 uppercase tracking-wide">
                                  Spēles piezīmes
                                </h5>
                                <p className="text-sm text-zinc-600 leading-relaxed">{fixture.description}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Bottom accent on hover */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Past Results */}
            {activeTab === 'past' && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {loadingPast ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <div className="text-center">
                      <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
                      <span className="text-teal-700 font-medium">Ielādē rezultātus...</span>
                    </div>
                  </div>
                ) : pastFixtures.length === 0 ? (
                  <div className="bg-teal-50 border border-teal-100 p-12 text-center">
                    <Trophy className="mx-auto h-16 w-16 text-teal-300 mb-4" />
                    <p className="text-xl font-bold text-teal-800 mb-2">Nav rezultātu</p>
                    <p className="text-teal-600">Nav iepriekšējo spēļu, ko parādīt.</p>
                  </div>
                ) : (
                  pastFixtures.map((fixture) => (
                    <div
                      key={fixture.id}
                      className="group relative bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    >
                      {/* Top accent - color based on result */}
                      <div
                        className={`h-1.5 ${
                          fixture.result === 'win'
                            ? 'bg-gradient-to-r from-green-600 via-green-500 to-green-600'
                            : fixture.result === 'loss'
                              ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600'
                              : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600'
                        }`}
                      />

                      {/* Date header */}
                      <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-teal-50 flex items-center justify-center skew-x-[-6deg]">
                            <CalendarDays className="h-6 w-6 text-teal-600 skew-x-[6deg]" />
                          </div>
                          <div>
                            <p className="font-bold text-teal-900 capitalize">
                              {formatDate(fixture.match_date)}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {fixture.is_home_game ? 'Mājas spēle' : 'Izbraukuma spēle'}
                            </p>
                          </div>
                        </div>
                        {fixture.result && (
                          <div
                            className={`skew-x-[-6deg] px-4 py-2 ${
                              fixture.result === 'win'
                                ? 'bg-green-600'
                                : fixture.result === 'loss'
                                  ? 'bg-red-600'
                                  : 'bg-amber-600'
                            }`}
                          >
                            <span className="skew-x-[6deg] inline-block text-sm font-bold text-white uppercase tracking-wider">
                              {fixture.result === 'win'
                                ? 'UZVARA'
                                : fixture.result === 'loss'
                                  ? 'ZAUDĒJUMS'
                                  : 'NEIZŠĶIRTS'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6 md:p-8">
                        {/* Teams layout */}
                        <div className="flex items-center justify-between">
                          {/* Home team */}
                          <div className="flex-1">
                            <div className="flex flex-col items-center">
                              <div className="h-24 w-24 relative overflow-hidden bg-white shadow-lg mb-4 border-2 border-gray-100 p-2 group-hover:border-teal-200 transition-colors">
                                {fixture.home_logo_url && shouldUseImageComponent(fixture.home_logo_url) ? (
                                  <Image
                                    src={getImageUrl(fixture.home_logo_url) || '/placeholder.svg?height=128&width=128&text=Team'}
                                    alt={fixture.is_home_game ? clubName : fixture.opponent}
                                    fill
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-800 text-2xl font-bold">
                                    {fixture.is_home_game ? 'F' : fixture.opponent[0]}
                                  </div>
                                )}
                              </div>
                              <h4 className="text-center font-bold text-teal-900 text-lg">
                                {fixture.is_home_game ? clubName : fixture.opponent}
                              </h4>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="flex-shrink-0 px-6">
                            {fixture.score ? (
                              <div
                                className={`skew-x-[-12deg] text-white font-extrabold text-2xl py-3 px-6 shadow-lg ${
                                  fixture.result === 'win'
                                    ? 'bg-green-600'
                                    : fixture.result === 'loss'
                                      ? 'bg-red-600'
                                      : 'bg-amber-600'
                                }`}
                              >
                                <span className="skew-x-[12deg] inline-block">{fixture.score}</span>
                              </div>
                            ) : (
                              <div className="bg-teal-700 text-white font-bold text-lg skew-x-[-12deg] h-14 w-14 flex items-center justify-center shadow-lg">
                                <span className="skew-x-[12deg]">-</span>
                              </div>
                            )}
                          </div>

                          {/* Away team */}
                          <div className="flex-1">
                            <div className="flex flex-col items-center">
                              <div className="h-24 w-24 relative overflow-hidden bg-white shadow-lg mb-4 border-2 border-gray-100 p-2 group-hover:border-teal-200 transition-colors">
                                {fixture.away_logo_url && shouldUseImageComponent(fixture.away_logo_url) ? (
                                  <Image
                                    src={getImageUrl(fixture.away_logo_url) || '/placeholder.svg?height=128&width=128&text=Team'}
                                    alt={fixture.is_home_game ? fixture.opponent : clubName}
                                    fill
                                    className="object-contain"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-800 text-2xl font-bold">
                                    {fixture.is_home_game ? fixture.opponent[0] : 'F'}
                                  </div>
                                )}
                              </div>
                              <h4 className="text-center font-bold text-teal-900 text-lg">
                                {fixture.is_home_game ? fixture.opponent : clubName}
                              </h4>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-zinc-600 py-3 border-t border-gray-100">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-medium">
                            {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                          </span>
                        </div>

                        {/* Details button */}
                        {fixture.description && (
                          <>
                            <button
                              onClick={() => toggleMatchDetails(fixture.id)}
                              className="mt-4 flex w-full items-center justify-center gap-2 skew-x-[-6deg] bg-teal-50 py-3 text-sm font-bold text-teal-800 transition-all hover:bg-teal-100"
                            >
                              <span className="skew-x-[6deg] inline-flex items-center gap-2">
                                {expandedMatch === fixture.id ? 'SLĒPT DETAĻAS' : 'RĀDĪT DETAĻAS'}
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-300 ${
                                    expandedMatch === fixture.id ? 'rotate-180' : ''
                                  }`}
                                />
                              </span>
                            </button>

                            {expandedMatch === fixture.id && (
                              <div className="mt-4 bg-zinc-50 p-4 border-l-4 border-teal-600">
                                <h5 className="mb-2 text-sm font-bold text-teal-900 uppercase tracking-wide">
                                  Spēles piezīmes
                                </h5>
                                <p className="text-sm text-zinc-600 leading-relaxed">{fixture.description}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Bottom accent on hover */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                          fixture.result === 'win'
                            ? 'bg-green-600'
                            : fixture.result === 'loss'
                              ? 'bg-red-600'
                              : 'bg-amber-600'
                        }`}
                      />
                    </div>
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
