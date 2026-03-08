import { Metadata } from 'next'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { aboutUsData } from '@/data/about-us'

export const metadata: Metadata = {
  title: 'Par mums | RK Fēnikss',
  description: 'Uzziniet par RK Fēnikss regbija klubu - mūsu vēsture, misija un vērtības.',
  openGraph: {
    title: 'Par mums | RK Fēnikss',
    description: 'Uzziniet par RK Fēnikss regbija klubu - mūsu vēsture, misija un vērtības.',
  },
}

export default function AboutPage() {
  return (
    <MainLayout currentPage="ABOUT">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] bg-stripes-dark overflow-hidden">
          <div className="absolute inset-0">
            <NextImage src="/AboutUs/parallax.jpg" alt="Par mums" fill className="object-cover opacity-30 scale-105 blur-[2px]" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">RK Fēnikss</span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
                Par<br />Mums
              </h1>
            </div>
          </div>
        </section>

        {/* History & Mission Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <div className="relative overflow-hidden">
                <NextImage src={aboutUsData.imageUrl} alt="Rugby Club Team" width={800} height={600} className="w-full h-auto" />
              </div>

              {/* Content */}
              <div className="space-y-10">
                {/* History */}
                <div>
                  <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-3 block">Vēsture</span>
                  <h3 className="font-display text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#111] leading-tight mb-4">
                    {aboutUsData.history.title}
                  </h3>
                  <p className="font-body text-[15px] text-[#666] leading-relaxed">{aboutUsData.history.content}</p>
                </div>

                <div className="h-px bg-[#e5e5e5]" />

                {/* Mission */}
                <div>
                  <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-3 block">Misija</span>
                  <h3 className="font-display text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#111] leading-tight mb-4">
                    {aboutUsData.mission.title}
                  </h3>
                  <p className="font-body text-[15px] text-[#666] leading-relaxed">{aboutUsData.mission.content}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-[#111] bg-stripes-dark">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 text-center">
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-4 block">Pievienojies</span>
            <h2 className="font-display text-[clamp(32px,4vw,52px)] font-bold uppercase text-white leading-[0.88] tracking-tight mb-6">
              {aboutUsData.cta.title}
            </h2>
            <p className="font-body text-[15px] text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
              {aboutUsData.cta.content}
            </p>
            <Link href="/contact" className="inline-flex items-center px-9 py-3.5 bg-teal-700 text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-600 transition-colors duration-200">
              {aboutUsData.cta.buttonText}
            </Link>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
