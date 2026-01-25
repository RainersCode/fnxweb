'use client'

import { useState } from 'react'
import { Trophy, Users, UserCog } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MainLayout } from '@/components/layout/main-layout'
import { teamData } from '@/data/team-data'
import PlayersList from './components/players-list'
import CoachesList from './components/coaches-list'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'

export default function TeamPage() {
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
        <section className="relative py-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="group relative bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Top accent */}
                <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                <div className="p-8 md:p-10">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-16 h-16 bg-teal-50 flex items-center justify-center skew-x-[-6deg] group-hover:bg-teal-600 transition-colors duration-300">
                      <Trophy className="h-8 w-8 text-teal-600 skew-x-[6deg] group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-teal-900 mb-4">
                        {teamData.clubHistory.title}
                      </h3>
                      <p className="text-lg text-zinc-600 leading-relaxed">
                        {teamData.clubHistory.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom accent on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
          <div className="absolute top-16 right-0 w-48 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                <Users className="h-5 w-5 text-teal-600" />
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-teal-900">IEPAZĪSTI </span>
                <span className="text-teal-600 italic font-light">SASTĀVU</span>
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
            </div>

            {/* Tabs */}
            <Tabs
              defaultValue="players"
              className="mx-auto max-w-6xl"
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-12 grid w-full max-w-md mx-auto grid-cols-2 bg-transparent gap-4 h-auto p-0">
                <TabsTrigger
                  value="players"
                  className="relative h-14 bg-white shadow-md border-b-4 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-teal-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 skew-x-[-6deg]"
                >
                  <span className="inline-flex skew-x-[6deg] items-center gap-2 font-bold tracking-wide">
                    <Users className="h-5 w-5" />
                    SPĒLĒTĀJI
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="coaches"
                  className="relative h-14 bg-white shadow-md border-b-4 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-teal-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 skew-x-[-6deg]"
                >
                  <span className="inline-flex skew-x-[6deg] items-center gap-2 font-bold tracking-wide">
                    <UserCog className="h-5 w-5" />
                    TRENERI
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
