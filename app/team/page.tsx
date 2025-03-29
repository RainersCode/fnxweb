import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, MapPin, Trophy, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainLayout from '@/components/layout/main-layout'
import { teamData } from '@/data/team-data'
import PlayersList from './components/players-list'
import CoachesList from './components/coaches-list'
import Loading from './loading'

// This is a server component to fetch initial data
export default async function TeamPage() {
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

            {/* Tabs */}
            <Tabs defaultValue="players" className="mx-auto max-w-5xl">
              <TabsList className="mb-10 grid w-full grid-cols-2 bg-transparent">
                <TabsTrigger
                  value="players"
                  className="data-[state=active]:bg-teal-800 data-[state=active]:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Players
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="coaches"
                  className="data-[state=active]:bg-teal-800 data-[state=active]:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Coaching Staff
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="players">
                <Suspense fallback={<Loading />}>
                  <PlayersList />
                </Suspense>
              </TabsContent>

              <TabsContent value="coaches">
                <Suspense fallback={<Loading />}>
                  <CoachesList />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
