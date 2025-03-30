'use client'

import { Suspense, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CalendarDays, MapPin, Trophy, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MainLayout } from '@/components/layout/main-layout'
import { teamData } from '@/data/team-data'
import PlayersList from './components/players-list'
import CoachesList from './components/coaches-list'
import Loading from './loading'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'

// Note: This was previously set to revalidate on every request, but since this is a client component,
// we rely on client-side data fetching in the child components instead

// This is a client component
export default function TeamPage() {
  // Keep track of which tab is active to avoid unnecessary renders
  const [activeTab, setActiveTab] = useState('players')
  
  return (
    <MainLayout currentPage="TEAM">
      <main className="flex-1">
        {/* Hero Section */}
        <ParallaxHeroSection
          title="MŪSU"
          titleHighlight="KOMANDA"
          subtitle="Iepazīsti spēlētājus un treneru sastāvu, kas veido RK &quot;Fēnikss&quot; šodien."
          backgroundImage="/AboutUs/parallax.jpg"
        />

        {/* Team Info Section */}
        <section className="relative bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-1">
              <Card className="transform overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-[1.02] bg-white max-w-3xl mx-auto">
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
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="bg-zinc-50 py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="relative inline-block">
                <span className="text-4xl font-black uppercase tracking-tighter text-teal-900">
                  IEPAZĪSTI
                </span>
                <span className="ml-2 text-4xl font-light uppercase italic tracking-wide text-teal-700">
                  SASTĀVU
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 skew-x-[-12deg] bg-gradient-to-r from-teal-500 to-teal-800"></span>
              </h2>
            </div>

            {/* Tabs */}
            <Tabs 
              defaultValue="players" 
              className="mx-auto max-w-5xl"
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-10 grid w-full grid-cols-2 bg-transparent">
                <TabsTrigger
                  value="players"
                  className="data-[state=active]:bg-teal-800 data-[state=active]:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Spēlētāji
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="coaches"
                  className="data-[state=active]:bg-teal-800 data-[state=active]:text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Treneru sastāvs
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="players" className="min-h-[400px]">
                {activeTab === 'players' && <PlayersList />}
              </TabsContent>

              <TabsContent value="coaches" className="min-h-[400px]">
                {activeTab === 'coaches' && <CoachesList />}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
