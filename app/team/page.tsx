'use client'

import { useState } from 'react'
import { Users, UserCog } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MainLayout } from '@/components/layout/main-layout'
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
                  className="relative h-14 rounded-none bg-white text-teal-800 shadow-md border-b-4 border-transparent hover:border-teal-300 hover:shadow-lg data-[state=active]:border-teal-600 data-[state=active]:bg-teal-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 skew-x-[-6deg]"
                >
                  <span className="inline-flex skew-x-[6deg] items-center gap-2 font-bold tracking-wide">
                    <Users className="h-5 w-5" />
                    SPĒLĒTĀJI
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="coaches"
                  className="relative h-14 rounded-none bg-white text-teal-800 shadow-md border-b-4 border-transparent hover:border-teal-300 hover:shadow-lg data-[state=active]:border-teal-600 data-[state=active]:bg-teal-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 skew-x-[-6deg]"
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
