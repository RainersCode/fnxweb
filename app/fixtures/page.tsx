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
                  <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-700 shadow-2xl overflow-hidden max-w-md mx-auto">
                    <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />
                    <div className="p-8 text-center relative">
                      <div className="absolute top-4 left-0 w-8 h-0.5 bg-white/20 skew-x-[-12deg]" />
                      <div className="absolute bottom-4 right-0 w-8 h-0.5 bg-white/20 skew-x-[-12deg]" />
                      <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-6 h-0.5 bg-white/40 skew-x-[-12deg]" />
                        <CalendarDays className="h-8 w-8 text-white/80" />
                        <div className="w-6 h-0.5 bg-white/40 skew-x-[-12deg]" />
                      </div>
                      <h3 className="text-xl font-extrabold tracking-tight mb-1">
                        <span className="text-white">NAV </span>
                        <span className="text-teal-200 italic font-light">SPĒĻU</span>
                      </h3>
                      <div className="mx-auto mt-2 mb-3 h-0.5 w-12 bg-white/50 skew-x-[-12deg]" />
                      <p className="text-sm text-white/80">Šobrīd nav ieplānotu gaidāmo spēļu.</p>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />
                  </div>
                ) : (
                  upcomingFixtures.map((fixture, index) => (
                    <div
                      key={fixture.id}
                      className="group relative bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      {/* Top gradient bar */}
                      <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500" />

                      {/* Next match badge */}
                      {index === 0 && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1 rounded-full shadow-md">
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                              Nākamā spēle
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Compact header with date and time */}
                      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-slate-700">
                              <CalendarDays className="h-4 w-4 text-teal-600" />
                              <span className="font-semibold text-sm capitalize">
                                {formatDate(fixture.match_date)}
                              </span>
                            </div>
                            <div className="w-px h-4 bg-gray-300" />
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="text-sm font-medium">{extractTime(fixture.match_date)}</span>
                            </div>
                          </div>
                          <div className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            fixture.is_home_game
                              ? 'bg-teal-100 text-teal-700'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {fixture.is_home_game ? 'Mājas' : 'Izbraukumā'}
                          </div>
                        </div>
                      </div>

                      {/* Main content - Teams matchup */}
                      <div className="px-5 py-6">
                        <div className="flex items-center justify-between gap-4">
                          {/* Home team */}
                          <div className="flex-1 flex flex-col items-center text-center">
                            <div className="relative mb-3">
                              <div className="h-20 w-20 rounded-full bg-white shadow-md border-2 border-gray-100 p-2 overflow-hidden group-hover:border-teal-300 group-hover:shadow-lg transition-all duration-300">
                                {fixture.home_logo_url && shouldUseImageComponent(fixture.home_logo_url) ? (
                                  <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                      src={getImageUrl(fixture.home_logo_url) || '/placeholder.svg?height=128&width=128&text=Team'}
                                      alt={fixture.is_home_game ? clubName : fixture.opponent}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-xl font-bold">
                                    {fixture.is_home_game ? 'F' : fixture.opponent[0]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">
                              {fixture.is_home_game ? clubName : fixture.opponent}
                            </h4>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Mājas
                            </span>
                          </div>

                          {/* VS badge - centered */}
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="relative">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">VS</span>
                              </div>
                              <div className="absolute -inset-1 rounded-full border-2 border-teal-200 opacity-50" />
                            </div>
                          </div>

                          {/* Away team */}
                          <div className="flex-1 flex flex-col items-center text-center">
                            <div className="relative mb-3">
                              <div className="h-20 w-20 rounded-full bg-white shadow-md border-2 border-gray-100 p-2 overflow-hidden group-hover:border-teal-300 group-hover:shadow-lg transition-all duration-300">
                                {fixture.away_logo_url && shouldUseImageComponent(fixture.away_logo_url) ? (
                                  <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                      src={getImageUrl(fixture.away_logo_url) || '/placeholder.svg?height=128&width=128&text=Team'}
                                      alt={fixture.is_home_game ? fixture.opponent : clubName}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-600 text-white text-xl font-bold">
                                    {fixture.is_home_game ? fixture.opponent[0] : 'F'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">
                              {fixture.is_home_game ? fixture.opponent : clubName}
                            </h4>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              Viesi
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer with location */}
                      <div className="bg-slate-50 px-5 py-3 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-teal-600" />
                          <span className="text-xs font-medium">
                            {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                          </span>
                        </div>
                      </div>

                      {/* Details section */}
                      {fixture.description && (
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => toggleMatchDetails(fixture.id)}
                            className="flex w-full items-center justify-center gap-2 py-2.5 text-xs font-semibold text-teal-700 bg-teal-50/50 hover:bg-teal-50 transition-colors"
                          >
                            {expandedMatch === fixture.id ? 'SLĒPT DETAĻAS' : 'RĀDĪT DETAĻAS'}
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                                expandedMatch === fixture.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {expandedMatch === fixture.id && (
                            <div className="px-5 py-4 bg-slate-50 border-t border-gray-100">
                              <p className="text-sm text-slate-600 leading-relaxed">{fixture.description}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Subtle bottom accent on hover */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
                  <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-teal-700 shadow-2xl overflow-hidden max-w-md mx-auto">
                    <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />
                    <div className="p-8 text-center relative">
                      <div className="absolute top-4 left-0 w-8 h-0.5 bg-white/20 skew-x-[-12deg]" />
                      <div className="absolute bottom-4 right-0 w-8 h-0.5 bg-white/20 skew-x-[-12deg]" />
                      <div className="inline-flex items-center gap-2 mb-3">
                        <div className="w-6 h-0.5 bg-white/40 skew-x-[-12deg]" />
                        <Trophy className="h-8 w-8 text-white/80" />
                        <div className="w-6 h-0.5 bg-white/40 skew-x-[-12deg]" />
                      </div>
                      <h3 className="text-xl font-extrabold tracking-tight mb-1">
                        <span className="text-white">NAV </span>
                        <span className="text-teal-200 italic font-light">REZULTĀTU</span>
                      </h3>
                      <div className="mx-auto mt-2 mb-3 h-0.5 w-12 bg-white/50 skew-x-[-12deg]" />
                      <p className="text-sm text-white/80">Nav iepriekšējo spēļu, ko parādīt.</p>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />
                  </div>
                ) : (
                  pastFixtures.map((fixture) => {
                    const resultLabel = fixture.result === 'win'
                      ? 'Uzvara'
                      : fixture.result === 'loss'
                        ? 'Zaudējums'
                        : 'Neizšķirts'
                    const resultAccent = fixture.result === 'win'
                      ? 'bg-emerald-400'
                      : fixture.result === 'loss'
                        ? 'bg-red-400'
                        : 'bg-amber-400'

                    return (
                      <div
                        key={fixture.id}
                        className="group relative bg-gradient-to-br from-teal-700 via-teal-600 to-teal-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      >
                        {/* Top gradient line */}
                        <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />

                        {/* Decorative accents */}
                        <div className="absolute top-3 left-0 w-6 h-0.5 bg-white/15 skew-x-[-12deg]" />
                        <div className="absolute bottom-3 right-0 w-6 h-0.5 bg-white/15 skew-x-[-12deg]" />

                        {/* Background decorative logos - hidden on mobile */}
                        <div
                          className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 h-28 w-28 -ml-4 opacity-[0.15] pointer-events-none"
                          style={{ maskImage: 'linear-gradient(to right, white 0%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to right, white 0%, transparent 80%)' }}
                        >
                          {fixture.home_logo_url && shouldUseImageComponent(fixture.home_logo_url) ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={getImageUrl(fixture.home_logo_url) || '/placeholder.svg?height=128&width=128&text=Team'}
                                alt=""
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-white text-5xl font-extrabold">
                              {fixture.is_home_game ? 'F' : fixture.opponent[0]}
                            </div>
                          )}
                        </div>
                        <div
                          className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 h-28 w-28 -mr-4 opacity-[0.15] pointer-events-none"
                          style={{ maskImage: 'linear-gradient(to left, white 0%, transparent 80%)', WebkitMaskImage: 'linear-gradient(to left, white 0%, transparent 80%)' }}
                        >
                          {fixture.away_logo_url && shouldUseImageComponent(fixture.away_logo_url) ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={getImageUrl(fixture.away_logo_url) || '/placeholder.svg?height=128&width=128&text=Team'}
                                alt=""
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-white text-5xl font-extrabold">
                              {fixture.is_home_game ? fixture.opponent[0] : 'F'}
                            </div>
                          )}
                        </div>

                        {/* Header row: date + home/away + result */}
                        <div className="px-3 sm:px-5 pt-2.5 sm:pt-3 pb-1 flex flex-wrap items-center justify-between gap-y-1">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/50" />
                            <span className="text-[11px] sm:text-xs text-white/70 font-medium capitalize">
                              {formatDate(fixture.match_date)}
                            </span>
                            <span className="text-white/30">·</span>
                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-teal-200/80">
                              {fixture.is_home_game ? 'Mājas' : 'Izbraukumā'}
                            </span>
                          </div>
                          {fixture.result && (
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${resultAccent}`} />
                              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/80">
                                {resultLabel}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Teams + Score row */}
                        <div className="px-3 sm:px-5 py-2.5 sm:py-3">
                          <div className="flex items-center justify-between gap-2 sm:gap-3">
                            {/* Home team */}
                            <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
                              <div className="h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0 rounded-full bg-white/10 border border-white/20 p-1 sm:p-1.5 overflow-hidden">
                                {fixture.home_logo_url && shouldUseImageComponent(fixture.home_logo_url) ? (
                                  <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                      src={getImageUrl(fixture.home_logo_url) || '/placeholder.svg?height=64&width=64&text=Team'}
                                      alt={fixture.is_home_game ? clubName : fixture.opponent}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white/20 text-white text-xs sm:text-sm font-bold">
                                    {fixture.is_home_game ? 'F' : fixture.opponent[0]}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-white text-xs sm:text-sm leading-tight truncate">
                                  {fixture.is_home_game ? clubName : fixture.opponent}
                                </h4>
                                <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-white/50">
                                  Mājas
                                </span>
                              </div>
                            </div>

                            {/* Score */}
                            <div className="flex-shrink-0 px-1 sm:px-4">
                              <div className="skew-x-[-6deg] bg-white/10 border border-white/20 px-2.5 sm:px-4 py-1 sm:py-1.5">
                                <span className="inline-block skew-x-[6deg] text-white font-extrabold text-base sm:text-lg tracking-wider">
                                  {fixture.score || '-:-'}
                                </span>
                              </div>
                            </div>

                            {/* Away team */}
                            <div className="flex-1 flex items-center gap-2 sm:gap-3 justify-end text-right min-w-0">
                              <div className="min-w-0">
                                <h4 className="font-bold text-white text-xs sm:text-sm leading-tight truncate">
                                  {fixture.is_home_game ? fixture.opponent : clubName}
                                </h4>
                                <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-white/50">
                                  Viesi
                                </span>
                              </div>
                              <div className="h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0 rounded-full bg-white/10 border border-white/20 p-1 sm:p-1.5 overflow-hidden">
                                {fixture.away_logo_url && shouldUseImageComponent(fixture.away_logo_url) ? (
                                  <div className="relative w-full h-full rounded-full overflow-hidden">
                                    <Image
                                      src={getImageUrl(fixture.away_logo_url) || '/placeholder.svg?height=64&width=64&text=Team'}
                                      alt={fixture.is_home_game ? fixture.opponent : clubName}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white/20 text-white text-xs sm:text-sm font-bold">
                                    {fixture.is_home_game ? fixture.opponent[0] : 'F'}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer: location */}
                        <div className="px-3 sm:px-5 pb-2.5 sm:pb-3 pt-0 flex items-center justify-center gap-1.5">
                          <MapPin className="h-3 w-3 text-white/40" />
                          <span className="text-[10px] sm:text-[11px] text-white/50 font-medium">
                            {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                          </span>
                        </div>

                        {/* Details section */}
                        {fixture.description && (
                          <div className="border-t border-white/10">
                            <button
                              onClick={() => toggleMatchDetails(fixture.id)}
                              className="flex w-full items-center justify-center gap-2 py-2 text-[11px] font-semibold text-white/60 hover:text-white/90 transition-colors"
                            >
                              {expandedMatch === fixture.id ? 'SLĒPT DETAĻAS' : 'RĀDĪT DETAĻAS'}
                              <ChevronDown
                                className={`h-3 w-3 transition-transform duration-300 ${
                                  expandedMatch === fixture.id ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            {expandedMatch === fixture.id && (
                              <div className="px-3 sm:px-5 py-3 bg-white/5 border-t border-white/10">
                                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{fixture.description}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Bottom gradient line */}
                        <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
