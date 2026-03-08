'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MainLayout } from '@/components/layout/main-layout'
import PlayersList from './components/players-list'
import CoachesList from './components/coaches-list'

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<'players' | 'coaches'>('players')

  return (
    <MainLayout currentPage="TEAM">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] bg-stripes-dark overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/AboutUs/parallax.jpg" alt="RK Fēnikss komanda" fill className="object-cover opacity-30 scale-105 blur-[2px]" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">RK Fēnikss</span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
                Mūsu<br />Komanda
              </h1>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="bg-[#bce8e4] py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-12">
              <button
                onClick={() => setActiveTab('players')}
                className={`px-8 py-3.5 font-cond text-xs font-bold tracking-[2.5px] uppercase transition-colors duration-200 ${
                  activeTab === 'players' ? 'bg-[#111] text-white' : 'bg-white text-[#111] hover:bg-[#111] hover:text-white'
                }`}
              >
                Spēlētāji
              </button>
              <button
                onClick={() => setActiveTab('coaches')}
                className={`px-8 py-3.5 font-cond text-xs font-bold tracking-[2.5px] uppercase transition-colors duration-200 ${
                  activeTab === 'coaches' ? 'bg-[#111] text-white' : 'bg-white text-[#111] hover:bg-[#111] hover:text-white'
                }`}
              >
                Treneri
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'players' && <PlayersList />}
              {activeTab === 'coaches' && <CoachesList />}
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
