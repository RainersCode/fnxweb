'use client'

import { useState, useEffect } from 'react'
import { default as NextImage } from 'next/image'
import { CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Fixture } from '@/types/supabase'

interface HomeFixturesSectionProps {
  initialFixtures: Fixture[]
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

export function HomeFixturesSection({ initialFixtures }: HomeFixturesSectionProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures)

  // Set up real-time subscription for fixtures
  useEffect(() => {
    const fetchFixtures = async () => {
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .gte('match_date', today.toISOString())
        .order('match_date', { ascending: true })
        .limit(3)

      if (!error && data) {
        setFixtures(data)
      }
    }

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

  return (
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

        {fixtures.length === 0 ? (
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
  )
}
