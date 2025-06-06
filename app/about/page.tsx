'use client'

import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { SectionContainer } from '@/components/shared/section-container'
import { SectionTitle } from '@/components/shared/section-title'
import { Card, CardContent } from '@/components/ui/card'
import { GridContainer } from '@/components/ui/grid-container'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import { aboutUsData } from '@/data/about-us'

export default function AboutPage() {
  return (
    <MainLayout currentPage="ABOUT">
      <main className="flex-1">
        {/* Hero Section */}
        <ParallaxHeroSection
          title={aboutUsData.title.split(' ')[0]} // First word
          titleHighlight={aboutUsData.title.split(' ').slice(1).join(' ')} // Rest of the words
          subtitle={aboutUsData.introduction}
          backgroundImage="/AboutUs/parallax.jpg"
        />

        {/* History & Mission Section */}
        <SectionContainer className="py-20">
          <GridContainer cols={2} gap="lg" className="items-center">
            <div
              className="transform overflow-hidden bg-white shadow-md transition-transform duration-300 hover:scale-[1.02]"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 95% 100%, 0 100%)' }}
            >
              <NextImage
                src={aboutUsData.imageUrl}
                alt="Rugby Club Team"
                width={800}
                height={600}
                className="h-auto w-full"
              />
            </div>

            <div className="space-y-8">
              <div>
                <SectionTitle title={aboutUsData.history.title} />
                <p className="text-lg leading-relaxed text-zinc-700">
                  {aboutUsData.history.content}
                </p>
              </div>

              <div>
                <SectionTitle title={aboutUsData.mission.title} />
                <p className="text-lg leading-relaxed text-zinc-700">
                  {aboutUsData.mission.content}
                </p>
              </div>
            </div>
          </GridContainer>
        </SectionContainer>

        {/* Values Section */}
        <SectionContainer className="bg-gray-50 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <SectionTitle title={aboutUsData.values.title} align="center" className="text-center" />
            <p className="mb-12 text-lg leading-relaxed text-zinc-700">
              Šīs pamatvērtības vada visu, ko mēs darām RK &quot;Fēnikss&quot;:
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aboutUsData.values.list.map((value, index) => (
              <Card
                key={index}
                className="transform transition-all duration-300 hover:scale-[1.02] bg-white"
              >
                <CardContent className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-teal-900">{value.title}</h3>
                  <p className="text-zinc-700">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionContainer>

        {/* CTA Section */}
        <SectionContainer className="bg-gradient-to-r from-teal-900 to-teal-700 py-16 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">{aboutUsData.cta.title}</h2>
            <p className="mb-8 text-xl leading-relaxed text-teal-100">{aboutUsData.cta.content}</p>
            <Link href="/contact">
              <button className="group inline-flex skew-x-[-12deg] transform items-center bg-white px-8 py-4 font-medium tracking-wide text-teal-800 shadow-lg transition-all duration-300 hover:bg-teal-100">
                <span className="inline-flex skew-x-[12deg] transform items-center">
                  {aboutUsData.cta.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </Link>
          </div>
        </SectionContainer>
      </main>
    </MainLayout>
  )
}
