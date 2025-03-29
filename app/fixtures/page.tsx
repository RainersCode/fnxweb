'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, Clock, MapPin, Trophy, ChevronDown } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'

export default function FixturesPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null)

  const upcomingMatches = [
    {
      id: 1,
      date: 'May 15, 2025',
      time: '14:30',
      homeTeam: 'Riverside RFC',
      awayTeam: 'Oakwood RFC',
      location: 'Home Ground, Riverside Park',
      homeImage: '/placeholder.svg?height=64&width=64&text=Home',
      awayImage: '/placeholder.svg?height=64&width=64&text=Away',
      competition: 'Regional League',
      ticketsAvailable: true,
      directions: 'https://maps.google.com',
      notes: 'Season opener. Pre-match lunch available at the clubhouse from 12:30.',
    },
    {
      id: 2,
      date: 'May 22, 2025',
      time: '15:00',
      homeTeam: 'Hillside RFC',
      awayTeam: 'Riverside RFC',
      location: 'Hillside Stadium, Hill Road',
      homeImage: '/placeholder.svg?height=64&width=64&text=Away2',
      awayImage: '/placeholder.svg?height=64&width=64&text=Home',
      competition: 'Regional League',
      ticketsAvailable: false,
      directions: 'https://maps.google.com',
      notes: 'Away supporters welcome. Limited parking available.',
    },
    {
      id: 3,
      date: 'May 29, 2025',
      time: '14:30',
      homeTeam: 'Riverside RFC',
      awayTeam: 'Valley RFC',
      location: 'Home Ground, Riverside Park',
      homeImage: '/placeholder.svg?height=64&width=64&text=Home',
      awayImage: '/placeholder.svg?height=64&width=64&text=Away3',
      competition: 'Regional League',
      ticketsAvailable: true,
      directions: 'https://maps.google.com',
      notes: 'Club fundraiser event after the match.',
    },
    {
      id: 4,
      date: 'June 5, 2025',
      time: '15:00',
      homeTeam: 'Lakeside RFC',
      awayTeam: 'Riverside RFC',
      location: 'Lakeside Ground, Lake Road',
      homeImage: '/placeholder.svg?height=64&width=64&text=Away4',
      awayImage: '/placeholder.svg?height=64&width=64&text=Home',
      competition: 'Regional League',
      ticketsAvailable: false,
      directions: 'https://maps.google.com',
      notes: 'Coach transport available for away supporters.',
    },
  ]

  const pastMatches = [
    {
      id: 101,
      date: 'April 24, 2025',
      time: '14:30',
      homeTeam: 'Riverside RFC',
      awayTeam: 'Mountain RFC',
      homeScore: 24,
      awayScore: 17,
      location: 'Home Ground, Riverside Park',
      homeImage: '/placeholder.svg?height=64&width=64&text=Home',
      awayImage: '/placeholder.svg?height=64&width=64&text=Past1',
      competition: 'Regional League',
      result: 'Win',
      highlights: 'https://youtube.com',
      motm: 'James Wilson',
      notes: 'Hard-fought victory with a last-minute try.',
    },
    {
      id: 102,
      date: 'April 17, 2025',
      time: '15:00',
      homeTeam: 'Forest RFC',
      awayTeam: 'Riverside RFC',
      homeScore: 15,
      awayScore: 15,
      location: 'Forest Ground, Tree Lane',
      homeImage: '/placeholder.svg?height=64&width=64&text=Past2',
      awayImage: '/placeholder.svg?height=64&width=64&text=Home',
      competition: 'Regional League',
      result: 'Draw',
      highlights: 'https://youtube.com',
      motm: 'Ryan Johnson',
      notes: 'Dramatic draw with both teams scoring in the final 10 minutes.',
    },
    {
      id: 103,
      date: 'April 10, 2025',
      time: '14:30',
      homeTeam: 'Riverside RFC',
      awayTeam: 'Seaside RFC',
      homeScore: 32,
      awayScore: 12,
      location: 'Home Ground, Riverside Park',
      homeImage: '/placeholder.svg?height=64&width=64&text=Home',
      awayImage: '/placeholder.svg?height=64&width=64&text=Past3',
      competition: 'Regional League',
      result: 'Win',
      highlights: 'https://youtube.com',
      motm: 'Chris Williams',
      notes: 'Dominant performance with excellent attacking play.',
    },
  ]

  const toggleMatchDetails = (id: number) => {
    if (expandedMatch === id) {
      setExpandedMatch(null)
    } else {
      setExpandedMatch(id)
    }
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
                {upcomingMatches.map((match) => (
                  <Card
                    key={match.id}
                    className="overflow-hidden border-none bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between bg-teal-800 p-3 text-white">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          <span className="text-sm font-medium">{match.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">{match.time}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-1 flex-col items-center">
                            <div className="relative h-16 w-16 rotate-45 transform overflow-hidden bg-zinc-100">
                              <div className="absolute inset-0 flex -rotate-45 transform items-center justify-center">
                                <Image
                                  src={match.homeImage || '/placeholder.svg'}
                                  alt={match.homeTeam}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <h3 className="mt-4 font-bold tracking-tight text-teal-900">
                              {match.homeTeam}
                            </h3>
                          </div>
                          <div className="px-4 text-center">
                            <span className="inline-block skew-x-[-12deg] transform text-xl font-black tracking-tighter text-zinc-400">
                              VS
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col items-center">
                            <div className="relative h-16 w-16 rotate-45 transform overflow-hidden bg-zinc-100">
                              <div className="absolute inset-0 flex -rotate-45 transform items-center justify-center">
                                <Image
                                  src={match.awayImage || '/placeholder.svg'}
                                  alt={match.awayTeam}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <h3 className="mt-4 font-bold tracking-tight text-zinc-700">
                              {match.awayTeam}
                            </h3>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-sm text-zinc-600">
                          <MapPin className="h-4 w-4 text-teal-700" />
                          <span className="font-medium">{match.location}</span>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-medium text-teal-700">
                            {match.competition}
                          </span>
                          <button
                            onClick={() => toggleMatchDetails(match.id)}
                            className="skew-x-[-12deg] transform border border-teal-800 px-6 py-2 font-medium tracking-wide text-teal-800 transition-all duration-300 hover:bg-teal-50 hover:text-teal-900"
                          >
                            <span className="inline-flex skew-x-[12deg] transform items-center gap-2">
                              Match Details
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${expandedMatch === match.id ? 'rotate-180' : ''}`}
                              />
                            </span>
                          </button>
                        </div>

                        {expandedMatch === match.id && (
                          <div className="mt-4 border-t border-zinc-100 pt-4">
                            <p className="mb-4 text-sm text-zinc-600">{match.notes}</p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                              <a href={match.directions} target="_blank" rel="noopener noreferrer">
                                <button className="w-full skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900 sm:w-auto">
                                  <span className="inline-flex skew-x-[12deg] transform items-center">
                                    GET DIRECTIONS
                                  </span>
                                </button>
                              </a>
                              {match.ticketsAvailable && (
                                <button className="w-full skew-x-[-12deg] transform border border-teal-800 bg-white px-6 py-3 font-medium tracking-wide text-teal-800 transition-all duration-300 hover:bg-teal-50 sm:w-auto">
                                  <span className="inline-flex skew-x-[12deg] transform items-center">
                                    MATCH INFORMATION
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Past Results */}
            {activeTab === 'past' && (
              <div className="space-y-6">
                {pastMatches.map((match) => (
                  <Card
                    key={match.id}
                    className="overflow-hidden border-none bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    <CardContent className="p-0">
                      <div
                        className={`flex items-center justify-between p-3 text-white ${
                          match.result === 'Win'
                            ? 'bg-teal-800'
                            : match.result === 'Draw'
                              ? 'bg-amber-600'
                              : 'bg-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          <span className="text-sm font-medium">{match.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{match.result}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-1 flex-col items-center">
                            <div className="relative h-16 w-16 rotate-45 transform overflow-hidden bg-zinc-100">
                              <div className="absolute inset-0 flex -rotate-45 transform items-center justify-center">
                                <Image
                                  src={match.homeImage || '/placeholder.svg'}
                                  alt={match.homeTeam}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <h3 className="mt-4 font-bold tracking-tight text-teal-900">
                              {match.homeTeam}
                            </h3>
                          </div>
                          <div className="px-4 text-center">
                            <div className="text-xl font-black tracking-tighter">
                              <span className="text-teal-900">{match.homeScore}</span>
                              <span className="mx-2 text-zinc-400">-</span>
                              <span className="text-teal-900">{match.awayScore}</span>
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col items-center">
                            <div className="relative h-16 w-16 rotate-45 transform overflow-hidden bg-zinc-100">
                              <div className="absolute inset-0 flex -rotate-45 transform items-center justify-center">
                                <Image
                                  src={match.awayImage || '/placeholder.svg'}
                                  alt={match.awayTeam}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <h3 className="mt-4 font-bold tracking-tight text-zinc-700">
                              {match.awayTeam}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-medium text-teal-700">
                            {match.competition}
                          </span>
                          <button
                            onClick={() => toggleMatchDetails(match.id)}
                            className="skew-x-[-12deg] transform border border-teal-800 px-6 py-2 font-medium tracking-wide text-teal-800 transition-all duration-300 hover:bg-teal-50 hover:text-teal-900"
                          >
                            <span className="inline-flex skew-x-[12deg] transform items-center gap-2">
                              Match Details
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${expandedMatch === match.id ? 'rotate-180' : ''}`}
                              />
                            </span>
                          </button>
                        </div>

                        {expandedMatch === match.id && (
                          <div className="mt-4 border-t border-zinc-100 pt-4">
                            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-sm font-medium text-teal-900">
                                  Man of the Match
                                </p>
                                <p className="text-sm text-zinc-600">{match.motm}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-teal-900">Location</p>
                                <p className="text-sm text-zinc-600">{match.location}</p>
                              </div>
                            </div>
                            <p className="mb-4 text-sm text-zinc-600">{match.notes}</p>
                            <a href={match.highlights} target="_blank" rel="noopener noreferrer">
                              <button className="w-full skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900 sm:w-auto">
                                <span className="inline-flex skew-x-[12deg] transform items-center">
                                  WATCH HIGHLIGHTS
                                </span>
                              </button>
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Season Stats Section */}
        <section className="bg-zinc-50 py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-teal-900">
                SEASON <span className="font-light italic tracking-wide text-teal-700">STATS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Card className="transform overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 text-lg font-medium text-teal-900">Played</h3>
                  <p className="text-4xl font-bold text-teal-800">15</p>
                </CardContent>
              </Card>

              <Card className="transform overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 text-lg font-medium text-teal-900">Won</h3>
                  <p className="text-4xl font-bold text-teal-800">9</p>
                </CardContent>
              </Card>

              <Card className="transform overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 text-lg font-medium text-teal-900">Drawn</h3>
                  <p className="text-4xl font-bold text-teal-800">2</p>
                </CardContent>
              </Card>

              <Card className="transform overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 text-lg font-medium text-teal-900">Lost</h3>
                  <p className="text-4xl font-bold text-teal-800">4</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
