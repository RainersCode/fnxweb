'use client'

import Image from 'next/image'
import { MapPin, Phone, Mail, Building2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ContactInfoItem } from '@/components/features/contact/contact-info-item'
import { SocialLinks } from '@/components/features/contact/social-links'
import { ContactForm } from '@/components/features/contact/contact-form'
import { MapSection } from '@/components/features/map-section'

interface FormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  interest: string
}

export default function ContactPage() {
  const handleFormSubmit = (formData: FormData) => {
    console.log('Form submitted:', formData)
  }

  return (
    <MainLayout currentPage="CONTACT">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/AboutUs/parallax.jpg" alt="Kontakti" fill className="object-cover opacity-30 scale-105 blur-[2px]" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">RK Fēnikss</span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
                Sazinies<br />Ar Mums
              </h1>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left: Contact Info */}
              <div>
                <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-3 block">Informācija</span>
                <h2 className="font-display text-[clamp(32px,4vw,52px)] font-bold uppercase text-[#111] leading-[0.88] tracking-tight mb-10">
                  Kontakt<br />Informācija
                </h2>

                <div className="space-y-5">
                  <ContactInfoItem icon={MapPin} title="KLUBA ADRESE">
                    Biedrība &quot;Regbija klubs &quot;Valmieras Fēnikss&quot;&quot;
                    <br />
                    Juridiskā adrese: &quot;Lukstiņi&quot;, Bērzaines pagasts, Valmieras novads, LV-4208
                    <br />
                    Adrese: Kaimiņi, Brenguļi, Brenguļu pagasts, Valmieras novads, LV-4245
                    <br />
                    Reģistrācijas nr: 40008126600
                  </ContactInfoItem>

                  <ContactInfoItem icon={Phone} title="TĀLRUNIS">
                    <a href="tel:+37129113938" className="hover:text-teal-600 transition-colors">
                      +371 29113938
                    </a>
                  </ContactInfoItem>

                  <ContactInfoItem icon={Mail} title="E-PASTS">
                    <a href="mailto:rkfenikss@gmail.com" className="hover:text-teal-600 transition-colors">
                      rkfenikss@gmail.com
                    </a>
                  </ContactInfoItem>

                  <ContactInfoItem icon={Building2} title="BANKAS REKVIZĪTI">
                    Bankas konts: Swedbank
                    <br />
                    Konta nr.: LV86HABA0551035059313
                  </ContactInfoItem>
                </div>

                <div className="mt-10">
                  <SocialLinks />
                </div>
              </div>

              {/* Right: Form */}
              <div>
                <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-3 block">Rakstiet mums</span>
                <h2 className="font-display text-[clamp(32px,4vw,52px)] font-bold uppercase text-[#111] leading-[0.88] tracking-tight mb-10">
                  Sūtiet<br />Ziņu
                </h2>
                <ContactForm onSubmit={handleFormSubmit} />
              </div>
            </div>
          </div>
        </section>

        <MapSection
          address={{
            name: 'Biedrība "Regbija klubs "Valmieras Fēnikss""',
            street: 'Kaimiņi, Brenguļi',
            city: 'Brenguļu pagasts, Valmieras novads',
            postcode: 'LV-4245',
          }}
        />
      </main>
    </MainLayout>
  )
}
