'use client'

import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import { aboutUsData } from '@/data/about-us'

export default function AboutPage() {
  return (
    <MainLayout currentPage="ABOUT">
      <main className="flex-1">
        {/* Hero Section */}
        <ParallaxHeroSection
          title={aboutUsData.title.split(' ')[0]}
          titleHighlight={aboutUsData.title.split(' ').slice(1).join(' ')}
          subtitle={aboutUsData.introduction}
          backgroundImage="/AboutUs/parallax.jpg"
        />

        {/* History & Mission Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute bottom-20 right-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <div className="relative group">
                <div className="relative overflow-hidden shadow-2xl">
                  <NextImage
                    src={aboutUsData.imageUrl}
                    alt="Rugby Club Team"
                    width={800}
                    height={600}
                    className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-teal-600" />
                </div>

                {/* Floating stats card */}
                <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-white shadow-xl p-6 skew-x-[-6deg] transform border-l-4 border-teal-600">
                  <div className="skew-x-[6deg] transform text-center">
                    <div className="text-4xl font-extrabold text-teal-700">2005</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">Dibināts</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-10 lg:pl-4">
                {/* History */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-0.5 bg-teal-600 skew-x-[-12deg]" />
                    <span className="text-sm font-bold uppercase tracking-widest text-teal-600">Vēsture</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight text-teal-900 leading-tight mb-4">
                    {aboutUsData.history.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-zinc-600">
                    {aboutUsData.history.content}
                  </p>
                </div>

                {/* Mission */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-0.5 bg-teal-600 skew-x-[-12deg]" />
                    <span className="text-sm font-bold uppercase tracking-widest text-teal-600">Misija</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight text-teal-900 leading-tight mb-4">
                    {aboutUsData.mission.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-zinc-600">
                    {aboutUsData.mission.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900" />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
          <div className="absolute top-10 left-0 w-64 h-0.5 bg-teal-400/20 skew-x-[-12deg]" />
          <div className="absolute bottom-10 right-0 w-48 h-0.5 bg-teal-400/20 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                <Users className="h-5 w-5 text-teal-300" />
                <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-6">
                <span className="text-white">{aboutUsData.cta.title.split(' ').slice(0, 1).join(' ')} </span>
                <span className="text-teal-400 italic font-light">{aboutUsData.cta.title.split(' ').slice(1).join(' ')}</span>
              </h2>

              <p className="mb-10 text-xl leading-relaxed text-teal-100/80 max-w-2xl mx-auto">
                {aboutUsData.cta.content}
              </p>

              <Link href="/contact" className="group inline-block">
                <button className="skew-x-[-12deg] transform bg-white px-10 py-5 font-bold tracking-wide text-teal-800 shadow-xl transition-all duration-300 hover:bg-teal-50 hover:scale-105">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    {aboutUsData.cta.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
