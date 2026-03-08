'use client'

import { useState, useEffect } from 'react'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Fixture } from '@/types/supabase'

interface HomeFixturesSectionProps {
  initialFixtures: Fixture[]
}

const formatMatchDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('lv-LV', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

const extractTimeFromDate = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function HomeFixturesSection({ initialFixtures }: HomeFixturesSectionProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>(initialFixtures)

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
      if (!error && data) setFixtures(data)
    }

    const fixturesSubscription = supabase
      .channel('home-fixtures')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fixtures' }, () => {
        fetchFixtures()
      })
      .subscribe()

    return () => { fixturesSubscription.unsubscribe() }
  }, [])

  return (
    <section className="py-20 md:py-28 bg-[#bce8e4] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
        <div className="grid lg:grid-cols-[140px_1fr] gap-5 items-start">
          {/* Vertical text (desktop only) */}
          <div className="hidden lg:block">
            <span className="font-display text-[clamp(100px,12vw,160px)] font-bold uppercase text-teal-800 leading-none tracking-tighter [writing-mode:vertical-lr] rotate-180 sticky top-24">
              Spēles
            </span>
          </div>

          <div>
            {/* Header */}
            <div className="flex items-end justify-between mb-5">
              <h2 className="font-display text-[clamp(42px,5.5vw,80px)] font-bold uppercase text-teal-800 leading-[0.88] tracking-tight lg:hidden">
                Gaidāmās Spēles
              </h2>
              <Link href="/fixtures" className="ml-auto">
                <button className="hidden md:inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
                  Skatīt visas
                </button>
              </Link>
            </div>

            {fixtures.length === 0 ? (
              <div className="p-8 text-center max-w-md mx-auto">
                <div className="relative w-16 h-16 mx-auto mb-5 opacity-30">
                  <NextImage src="/Logo/fēniks_logo-removebg-preview.png" alt="Fēnikss" fill className="object-contain" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase text-teal-800/60 mb-2">Nav gaidāmo spēļu</h3>
                <p className="font-cond text-xs tracking-[2px] uppercase text-teal-800/40">Šobrīd nav plānotas gaidāmās spēles</p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {fixtures.map((fixture) => (
                  <div key={fixture.id} className="bg-white p-7 hover:-translate-y-1 transition-transform duration-300">
                    {/* Competition name */}
                    <div className="font-cond text-base font-bold tracking-[2px] uppercase text-[#111]">
                      {fixture.competition || 'Latvijas Čempionāts'}
                    </div>
                    {/* Location */}
                    <div className="font-cond text-xs font-medium tracking-[1.5px] uppercase text-[#888] flex items-center gap-1.5 mt-1.5">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-2 flex-shrink-0">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                    </div>
                    {/* Date & time */}
                    <div className="font-cond text-xs font-medium tracking-[1.5px] uppercase text-[#888] flex items-center gap-1.5 mt-1">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-2 flex-shrink-0">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="capitalize">{formatMatchDate(fixture.match_date)}</span> — {extractTimeFromDate(fixture.match_date)}
                    </div>

                    <div className="h-px bg-[#e5e5e5] my-4" />

                    {/* Teams */}
                    <div className="flex items-center justify-center gap-5 py-6">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto grid place-items-center">
                          <div className="relative w-16 h-16">
                            <NextImage
                              src={fixture.home_logo_url || "/Logo/fēniks_logo-removebg-preview.png"}
                              alt={fixture.is_home_game ? 'RK Fēnikss' : fixture.opponent}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="font-cond text-[11px] font-semibold tracking-[1px] uppercase text-[#444] mt-1">
                          {fixture.is_home_game ? 'Fēnikss' : fixture.opponent}
                        </div>
                      </div>
                      <span className="font-display text-2xl font-bold text-[#111]">V</span>
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto grid place-items-center">
                          <div className="relative w-16 h-16">
                            <NextImage
                              src={fixture.away_logo_url || "/placeholder.svg?height=48&width=48&text=Team"}
                              alt={fixture.is_home_game ? fixture.opponent : 'RK Fēnikss'}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                        <div className="font-cond text-[11px] font-semibold tracking-[1px] uppercase text-[#444] mt-1">
                          {fixture.is_home_game ? fixture.opponent : 'Fēnikss'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link href="/fixtures" className="block w-full">
                        <button className="w-full py-4 bg-[#111] text-white font-cond text-[13px] font-bold tracking-[2.5px] uppercase text-center hover:bg-teal-700 transition-colors duration-200">
                          Spēles Info
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile CTA */}
            <div className="md:hidden mt-8 text-center">
              <Link href="/fixtures">
                <button className="inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
                  Skatīt visas spēles
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
