'use client'

import { useState, useEffect } from 'react'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Fixture } from '@/types/supabase'

interface HomeFixturesSectionProps {
  initialFixtures: Fixture[]
  recentResults: Fixture[]
}

const CLUB_LOGO = '/Logo/fēniks_logo-removebg-preview.png'

// Pin the timezone so server and browser render the same kick-off time
const formatMatchDate = (dateString: string): string => {
  const date = new Date(dateString).toLocaleDateString('lv-LV', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Riga',
  })
  // Capitalise only the weekday ("Sestdiena, 2025. gada 5. aprīlis")
  return date.charAt(0).toUpperCase() + date.slice(1)
}

const extractTimeFromDate = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('lv-LV', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Riga',
  })
}

// The fixtures table has no competition column yet, so this is always the fallback
const getCompetition = (fixture: Fixture): string =>
  (fixture as Fixture & { competition?: string }).competition || 'Latvijas Čempionāts'

export function HomeFixturesSection({ initialFixtures, recentResults }: HomeFixturesSectionProps) {
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

  // With nothing scheduled, show the latest results instead of an empty block
  const showResults = fixtures.length === 0 && recentResults.length > 0
  const items = showResults ? recentResults : fixtures
  const heading = showResults ? 'Pēdējie Rezultāti' : 'Gaidāmās Spēles'

  if (items.length === 0) {
    return (
      <section className="py-12 bg-club-pale">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase text-club leading-[1.15] tracking-tight">
            Spēles
          </h2>
          <p className="font-cond text-sm font-semibold tracking-[2px] uppercase text-club/70">
            Šobrīd nav plānotu spēļu — sekojiet līdzi spēļu kalendāram
          </p>
          <Link
            href="/fixtures"
            className="sm:ml-auto inline-flex self-start sm:self-auto items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-club transition-colors duration-200"
          >
            Spēļu kalendārs
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-28 bg-club-pale relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
        <div className="grid lg:grid-cols-[140px_1fr] gap-5 items-start">
          {/* Vertical text (desktop only) */}
          <div className="hidden lg:block">
            <span className="font-display text-[clamp(100px,12vw,160px)] font-bold uppercase text-club leading-none tracking-tighter [writing-mode:vertical-lr] rotate-180 sticky top-24">
              Spēles
            </span>
          </div>

          <div>
            {/* Header */}
            <div className="flex items-end justify-between mb-5">
              <h2 className="font-display text-[clamp(34px,4vw,56px)] font-bold uppercase text-club leading-[1.15] tracking-tight lg:hidden">
                {heading}
              </h2>
              <span className="hidden lg:block font-cond text-sm font-bold tracking-[3px] uppercase text-club">
                {heading}
              </span>
              <Link href="/fixtures" className="ml-auto">
                <button className="hidden md:inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-club transition-colors duration-200">
                  Skatīt visas
                </button>
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} isResult={showResults} />
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="md:hidden mt-8 text-center">
              <Link href="/fixtures">
                <button className="inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-club transition-colors duration-200">
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

function FixtureCard({ fixture, isResult }: { fixture: Fixture; isResult: boolean }) {
  const isWin = isResult && fixture.result === 'win'
  const isLoss = isResult && fixture.result === 'loss'
  const homeName = fixture.is_home_game ? 'Fēnikss' : fixture.opponent
  const awayName = fixture.is_home_game ? fixture.opponent : 'Fēnikss'
  const metaColor = isWin ? 'text-white/50' : 'text-[#777]'

  return (
    <div className={`p-7 hover:-translate-y-1 transition-transform duration-300 ${isWin ? 'bg-club' : 'bg-white'}`}>
      {/* Competition name */}
      <div className={`font-cond text-base font-bold tracking-[2px] uppercase ${isWin ? 'text-white' : 'text-[#111]'}`}>
        {getCompetition(fixture)}
      </div>
      {/* Location */}
      <div className={`font-cond text-xs font-medium tracking-[1.5px] uppercase flex items-center gap-1.5 mt-1.5 ${metaColor}`}>
        <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-2 flex-shrink-0">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
      </div>
      {/* Date & time */}
      <div className={`font-cond text-xs font-medium tracking-[1.5px] uppercase flex items-center gap-1.5 mt-1 ${metaColor}`}>
        <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none stroke-2 flex-shrink-0">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{formatMatchDate(fixture.match_date)}</span> — {extractTimeFromDate(fixture.match_date)}
      </div>

      <div className={`h-px my-4 ${isWin ? 'bg-white/10' : 'bg-[#e5e5e5]'}`} />

      {/* Teams */}
      <div className="flex items-center justify-center gap-5 py-6">
        <TeamBadge name={homeName} logo={fixture.home_logo_url || (fixture.is_home_game ? CLUB_LOGO : undefined)} dark={isWin} />
        {isResult && fixture.score ? (
          <span className={`font-display text-3xl font-bold tracking-wider ${isWin ? 'text-club-mint' : isLoss ? 'text-[#999]' : 'text-[#111]'}`}>
            {fixture.score}
          </span>
        ) : (
          <span className={`font-display text-2xl font-bold ${isWin ? 'text-white' : 'text-[#111]'}`}>V</span>
        )}
        <TeamBadge name={awayName} logo={fixture.away_logo_url || (fixture.is_home_game ? undefined : CLUB_LOGO)} dark={isWin} />
      </div>

      {isResult ? (
        fixture.result && (
          <div className={`font-cond text-[13px] font-bold tracking-[2.5px] uppercase text-center pt-2 ${
            isWin ? 'text-club-mint' : isLoss ? 'text-[#999]' : 'text-[#666]'
          }`}>
            {isWin ? 'Uzvara' : isLoss ? 'Zaudējums' : 'Neizšķirts'}
          </div>
        )
      ) : (
        <Link href="/fixtures" className="block w-full">
          <button className="w-full py-4 bg-[#111] text-white font-cond text-[13px] font-bold tracking-[2.5px] uppercase text-center hover:bg-club transition-colors duration-200">
            Spēles Info
          </button>
        </Link>
      )}
    </div>
  )
}

function TeamBadge({ name, logo, dark }: { name: string; logo?: string; dark: boolean }) {
  return (
    <div className="text-center w-24">
      <div className="w-20 h-20 mx-auto grid place-items-center">
        {logo ? (
          <div className="relative w-16 h-16">
            <NextImage src={logo} alt={name} fill sizes="64px" className="object-contain" />
          </div>
        ) : (
          // No logo uploaded: show the team's initial instead of a grey placeholder box
          <div className={`w-16 h-16 grid place-items-center font-display text-2xl font-bold uppercase ${dark ? 'bg-white/10 text-white' : 'bg-[#f0f0f0] text-[#444]'}`}>
            {name.charAt(0)}
          </div>
        )}
      </div>
      <div className={`font-cond text-[11px] font-semibold tracking-[1px] uppercase mt-1 ${dark ? 'text-white/70' : 'text-[#444]'}`}>
        {name}
      </div>
    </div>
  )
}
