'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MainLayout } from '@/components/layout/main-layout'
import { Fixture } from '@/types/supabase'

interface FixturesClientProps {
  upcomingFixtures: Fixture[]
  pastFixtures: Fixture[]
}

export function FixturesClient({ upcomingFixtures, pastFixtures }: FixturesClientProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const formatDateShort = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  const extractTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('lv-LV', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const clubName = 'Fēnikss'

  const getImageUrl = (url: string | null) => {
    if (!url) return null
    if (url.toLowerCase().endsWith('.svg') || url.includes('/svg')) return null
    return url
  }

  const fixtures = activeTab === 'upcoming' ? upcomingFixtures : pastFixtures

  return (
    <MainLayout currentPage="FIXTURES">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] bg-stripes-dark overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/AboutUs/parallax.jpg" alt="Spēles" fill className="object-cover opacity-30 scale-105 blur-[2px]" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">
                RK Fēnikss
              </span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
                Spēles &<br />Rezultāti
              </h1>
            </div>
          </div>
        </section>

        {/* Tabs + Content */}
        <section className="py-16 md:py-20 bg-[#bce8e4]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            {/* Tabs */}
            <div className="flex gap-2 mb-12">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-8 py-3.5 font-cond text-xs font-bold tracking-[2.5px] uppercase transition-colors duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-[#111] text-white'
                    : 'bg-white text-[#111] hover:bg-[#111] hover:text-white'
                }`}
              >
                Gaidāmās spēles
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-8 py-3.5 font-cond text-xs font-bold tracking-[2.5px] uppercase transition-colors duration-200 ${
                  activeTab === 'past'
                    ? 'bg-[#111] text-white'
                    : 'bg-white text-[#111] hover:bg-[#111] hover:text-white'
                }`}
              >
                Rezultāti
              </button>
            </div>

            {fixtures.length === 0 ? (
              <div className="py-16 text-center max-w-lg mx-auto">
                <div className="relative w-16 h-16 mx-auto mb-5 opacity-30">
                  <Image src="/Logo/fēniks_logo-removebg-preview.png" alt="Fēnikss" fill className="object-contain" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-teal-800/60 mb-2">
                  {activeTab === 'upcoming' ? 'Nav gaidāmo spēļu' : 'Nav rezultātu'}
                </h3>
                <p className="font-cond text-xs tracking-[2px] uppercase text-teal-800/40">
                  {activeTab === 'upcoming' ? 'Šobrīd nav plānotas gaidāmās spēles' : 'Nav iepriekšējo spēļu rezultātu'}
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {fixtures.map((fixture) => {
                  const isWin = fixture.result === 'win'
                  const isLoss = fixture.result === 'loss'
                  const isDraw = fixture.result === 'draw'
                  const isPast = activeTab === 'past'

                  // Win cards go dark — they POP against the teal bg
                  // Loss/draw/upcoming stay white
                  const cardBg = isWin ? 'bg-[#111]' : 'bg-white'
                  const titleColor = isWin ? 'text-white' : 'text-[#111]'
                  const metaColor = isWin ? 'text-white/40' : 'text-[#888]'
                  const metaIconColor = isWin ? 'text-white/30' : 'text-[#888]'
                  const dividerColor = isWin ? 'bg-white/10' : 'bg-[#e5e5e5]'
                  const teamNameColor = isWin ? 'text-white/70' : 'text-[#444]'

                  return (
                    <div
                      key={fixture.id}
                      className={`${cardBg} hover:-translate-y-1 transition-all duration-300 overflow-hidden relative`}
                    >
                      {/* Win: subtle stripes in the background */}
                      {isWin && (
                        <div className="absolute inset-0 bg-stripes-dark pointer-events-none" />
                      )}

                      <div className="relative z-10 p-7">
                        {/* Competition */}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className={`font-cond text-base font-bold tracking-[2px] uppercase ${titleColor}`}>
                            {fixture.competition || 'Latvijas Čempionāts'}
                          </div>
                        </div>

                        {/* Location */}
                        <div className={`font-cond text-xs font-medium tracking-[1.5px] uppercase ${metaColor} flex items-center gap-1.5`}>
                          <svg viewBox="0 0 24 24" className={`w-3 h-3 stroke-current fill-none stroke-2 flex-shrink-0 ${metaIconColor}`}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {fixture.location || (fixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
                        </div>

                        {/* Date & time */}
                        <div className={`font-cond text-xs font-medium tracking-[1.5px] uppercase ${metaColor} flex items-center gap-1.5 mt-1`}>
                          <svg viewBox="0 0 24 24" className={`w-3 h-3 stroke-current fill-none stroke-2 flex-shrink-0 ${metaIconColor}`}>
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span className="capitalize">{formatDateShort(fixture.match_date)}</span> — {extractTime(fixture.match_date)}
                        </div>

                        <div className={`h-px ${dividerColor} my-5`} />

                        {/* Teams + Score — scoreboard layout */}
                        <div className="flex items-center py-3">
                          {/* Home team */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={getImageUrl(fixture.home_logo_url) || "/Logo/fēniks_logo-removebg-preview.png"}
                                alt={fixture.is_home_game ? clubName : fixture.opponent}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className={`font-cond text-sm font-bold tracking-[1px] uppercase ${teamNameColor} truncate`}>
                              {fixture.is_home_game ? clubName : fixture.opponent}
                            </span>
                          </div>

                          {/* Score center */}
                          {isPast && fixture.score ? (
                            <div className="flex-shrink-0 px-3">
                              <div className={`font-display text-3xl font-bold tracking-wider ${
                                isWin ? 'text-teal-400' : isLoss ? 'text-[#999]' : 'text-[#111]'
                              }`}>
                                {fixture.score}
                              </div>
                            </div>
                          ) : (
                            <div className="flex-shrink-0 px-3">
                              <div className={`font-display text-xl font-bold ${isWin ? 'text-white/20' : 'text-[#ddd]'}`}>
                                VS
                              </div>
                            </div>
                          )}

                          {/* Away team */}
                          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                            <span className={`font-cond text-sm font-bold tracking-[1px] uppercase ${teamNameColor} truncate text-right`}>
                              {fixture.is_home_game ? fixture.opponent : clubName}
                            </span>
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={getImageUrl(fixture.away_logo_url) || "/placeholder.svg?height=48&width=48&text=Team"}
                                alt={fixture.is_home_game ? fixture.opponent : clubName}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Result footer — only for past matches */}
                        {isPast && fixture.result && (
                          <>
                            <div className={`h-px ${dividerColor} mt-4 mb-4`} />
                            <div className="flex items-center justify-between">
                              <span className={`font-cond text-[11px] font-bold tracking-[2px] uppercase ${
                                isWin ? 'text-teal-400' : isLoss ? 'text-[#aaa]' : 'text-[#888]'
                              }`}>
                                {isWin ? 'Uzvara' : isLoss ? 'Zaudējums' : 'Neizšķirts'}
                              </span>
                              {/* Small result diamond */}
                              <span className={`w-3 h-3 rotate-45 ${
                                isWin ? 'bg-teal-400' : isLoss ? 'bg-[#ccc]' : 'bg-[#aaa]'
                              }`} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
