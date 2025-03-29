'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, MapPin, Trophy, Users } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { teamData } from '@/data/team-data'

export default function TeamPage() {
  const [scrollY, setScrollY] = useState(0)
  const [activeTab, setActiveTab] = useState('players')

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const players = [
    {
      name: 'James Wilson',
      position: 'Prop',
      number: 1,
      image: '/placeholder.svg?height=400&width=300&text=Player 1',
      bio: 'Team captain with 10 years of experience. Known for powerful scrummaging and leadership on the field.',
    },
    {
      name: 'Michael Thompson',
      position: 'Hooker',
      number: 2,
      image: '/placeholder.svg?height=400&width=300&text=Player 2',
      bio: 'Joined the club in 2020. Excellent line-out thrower and mobile around the park.',
    },
    {
      name: 'David Roberts',
      position: 'Lock',
      number: 4,
      image: '/placeholder.svg?height=400&width=300&text=Player 3',
      bio: 'Standing at 6\'6", David is our line-out specialist and a powerful force in the scrum.',
    },
    {
      name: 'Thomas Brown',
      position: 'Flanker',
      number: 6,
      image: '/placeholder.svg?height=400&width=300&text=Player 4',
      bio: 'Known for his incredible work rate and tackling ability. A true workhorse in the back row.',
    },
    {
      name: 'Ryan Johnson',
      position: 'Scrum-half',
      number: 9,
      image: '/placeholder.svg?height=400&width=300&text=Player 5',
      bio: 'Quick service and excellent game management. The link between forwards and backs.',
    },
    {
      name: 'Chris Williams',
      position: 'Fly-half',
      number: 10,
      image: '/placeholder.svg?height=400&width=300&text=Player 6',
      bio: 'Playmaker with a strong kicking game. Controls the tempo and direction of our attack.',
    },
  ]

  const coaches = [
    {
      name: 'Richard Davies',
      role: 'Head Coach',
      image: '/placeholder.svg?height=400&width=300&text=Coach 1',
      bio: 'Former professional player with 15 years of coaching experience. Focuses on technical skills and game strategy.',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Strength & Conditioning',
      image: '/placeholder.svg?height=400&width=300&text=Coach 2',
      bio: 'Sports science specialist ensuring our players are in peak physical condition throughout the season.',
    },
    {
      name: 'Mark Stevens',
      role: 'Assistant Coach',
      image: '/placeholder.svg?height=400&width=300&text=Coach 3',
      bio: 'Specializes in forward play and set-piece strategy. Former international player.',
    },
  ]

  return (
    <MainLayout currentPage="TEAM">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=Team Photo')",
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
                <span className="text-white">OUR</span>
                <span className="ml-2 font-light italic text-white">TEAM</span>
              </h1>
              <div className="mx-auto mb-6 h-1 w-32 skew-x-[-12deg] transform bg-white"></div>
              <p className="text-xl text-teal-100">
                Meet the dedicated players and coaching staff who make Riverside Rugby Club what it
                is today.
              </p>
            </div>
          </div>
        </section>

        {/* Team Info Section */}
        <section className="relative bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="transform overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-0">
                  <div className="bg-teal-800 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-6 w-6" />
                      <h3 className="text-xl font-bold">{teamData.clubHistory.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-zinc-600">{teamData.clubHistory.content}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="transform overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-0">
                  <div className="bg-teal-800 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-6 w-6" />
                      <h3 className="text-xl font-bold">{teamData.trainingSchedule.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-2 text-zinc-600">
                      {teamData.trainingSchedule.schedule.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.day}</span>
                          <span className="font-medium">{item.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="transform overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-0">
                  <div className="bg-teal-800 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6" />
                      <h3 className="text-xl font-bold">{teamData.homeGround.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-4 text-zinc-600">
                      {teamData.homeGround.address.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < teamData.homeGround.address.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                    <p className="text-zinc-600">{teamData.homeGround.facilities}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="bg-zinc-50 py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="relative inline-block">
                <span className="text-4xl font-black uppercase tracking-tighter text-teal-900">
                  MEET
                </span>
                <span className="ml-2 text-4xl font-light uppercase italic tracking-wide text-teal-700">
                  THE SQUAD
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 skew-x-[-12deg] bg-gradient-to-r from-teal-500 to-teal-800"></span>
              </h2>
            </div>

            {/* Tab Buttons */}
            <div className="mb-12 flex justify-center gap-4">
              <button
                className={`skew-x-[-12deg] transform px-6 py-3 font-medium tracking-wide transition-all duration-300 ${
                  activeTab === 'players'
                    ? 'bg-teal-800 text-white hover:bg-teal-900'
                    : 'border border-teal-800 bg-white text-teal-800 hover:bg-white hover:text-teal-900'
                }`}
                onClick={() => setActiveTab('players')}
              >
                <span className="inline-flex skew-x-[12deg] transform items-center gap-2">
                  <Users className="h-5 w-5" />
                  Players
                </span>
              </button>
              <button
                className={`skew-x-[-12deg] transform px-6 py-3 font-medium tracking-wide transition-all duration-300 ${
                  activeTab === 'coaches'
                    ? 'bg-teal-800 text-white hover:bg-teal-900'
                    : 'border border-teal-800 bg-white text-teal-800 hover:bg-white hover:text-teal-900'
                }`}
                onClick={() => setActiveTab('coaches')}
              >
                <span className="inline-flex skew-x-[12deg] transform items-center gap-2">
                  <Users className="h-5 w-5" />
                  Coaching Staff
                </span>
              </button>
            </div>

            {/* Players Grid */}
            {activeTab === 'players' && (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="transform overflow-hidden bg-white shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative h-80">
                      <Image
                        src={player.image || '/placeholder.svg'}
                        alt={player.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute right-0 top-0 -mr-2 flex h-12 w-12 skew-x-[-12deg] transform items-center justify-center bg-teal-800 text-2xl font-bold text-white">
                        <span className="skew-x-[12deg] transform">{player.number}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-teal-900">{player.name}</h3>
                      <p className="mb-4 font-medium text-teal-700">{player.position}</p>
                      <p className="text-sm text-zinc-600">{player.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coaches Grid */}
            {activeTab === 'coaches' && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {coaches.map((coach, index) => (
                  <div
                    key={index}
                    className="transform overflow-hidden bg-white shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative h-80">
                      <Image
                        src={coach.image || '/placeholder.svg'}
                        alt={coach.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-teal-900">{coach.name}</h3>
                      <p className="mb-4 font-medium text-teal-700">{coach.role}</p>
                      <p className="text-sm text-zinc-600">{coach.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
