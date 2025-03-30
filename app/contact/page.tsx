'use client'

import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import { SectionTitle } from '@/components/features/section-title'
import { ContactInfoItem } from '@/components/features/contact/contact-info-item'
import { SocialLinks } from '@/components/features/contact/social-links'
import { ContactForm } from '@/components/features/contact/contact-form'
import { MapSection } from '@/components/features/map-section'
import { SectionContainer } from '@/components/features/section-container'
import { GridContainer } from '@/components/features/grid-container'

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
    // This function is now just for logging purposes. 
    // The actual submission is handled within the ContactForm component.
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

        <SectionContainer withBackground maxWidth="full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GridContainer cols={2} gap="lg" className="items-start">
              <div className="w-full max-w-xl">
                <SectionTitle title="KONTAKTINFORMĀCIJA" />

                <div className="mt-12 space-y-10">
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
                    <a href="tel:+37129113938" className="hover:text-teal-700">
                      +371 29113938
                    </a>
                  </ContactInfoItem>

                  <ContactInfoItem icon={Mail} title="E-PASTS">
                    <a href="mailto:rkfenikss@gmail.com" className="hover:text-teal-700">
                      rkfenikss@gmail.com
                    </a>
                  </ContactInfoItem>

                  <ContactInfoItem icon={Clock} title="BANKAS REKVIZĪTI">
                    Bankas konts: Swedbank
                    <br />
                    Konta nr.: LV86HABA0551035059313
                  </ContactInfoItem>
                </div>

                <div className="mt-12">
                  <SocialLinks />
                </div>
              </div>

              <div className="w-full max-w-xl">
                <SectionTitle title="SŪTIET MUMS ZIŅU" />
                <div className="mt-12">
                  <ContactForm onSubmit={handleFormSubmit} />
                </div>
              </div>
            </GridContainer>
          </div>
        </SectionContainer>

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
