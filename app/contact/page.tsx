'use client'

import { MapPin, Phone, Mail, Building2, MessageSquare, Send } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
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
        <ParallaxHeroSection
          title="SAZINIES"
          titleHighlight="AR MUMS"
          subtitle="Vai jums ir jautājums vai vēlaties pievienoties mūsu klubam? Mēs labprāt no jums dzirdētu."
          backgroundImage="/AboutUs/parallax.jpg"
        />

        {/* Contact Section */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-1/3 right-0 w-64 h-64 bg-teal-100/30 rounded-full translate-x-1/2" />
          <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-teal-50/50 rounded-full -translate-x-1/2" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Contact Information */}
              <div className="w-full">
                {/* Section Header */}
                <div className="mb-10">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                    <MessageSquare className="h-5 w-5 text-teal-600" />
                    <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter">
                    <span className="text-teal-900">KONTAKT</span>
                    <span className="text-teal-600 italic font-light">INFORMĀCIJA</span>
                  </h2>
                  <p className="mt-3 text-zinc-600">
                    Sazinieties ar mums jebkurā jums ērtā veidā
                  </p>
                  <div className="mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
                </div>

                {/* Info Cards */}
                <div className="space-y-5">
                  <ContactInfoItem icon={MapPin} title="KLUBA ADRESE">
                    Biedrība "Regbija klubs "Valmieras Fēnikss""
                    <br />
                    Juridiskā adrese: "Lukstiņi", Bērzaines pagasts, Valmieras novads, LV-4208
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

                {/* Social Links */}
                <div className="mt-10">
                  <SocialLinks />
                </div>
              </div>

              {/* Contact Form */}
              <div className="w-full">
                {/* Section Header */}
                <div className="mb-10">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                    <Send className="h-5 w-5 text-teal-600" />
                    <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter">
                    <span className="text-teal-900">SŪTIET </span>
                    <span className="text-teal-600 italic font-light">ZIŅU</span>
                  </h2>
                  <p className="mt-3 text-zinc-600">
                    Aizpildiet formu un mēs ar jums sazināsimies
                  </p>
                  <div className="mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
                </div>

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
