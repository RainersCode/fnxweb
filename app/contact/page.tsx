'use client'

import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
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
                    RK &quot;Fēnikss&quot;
                    <br />
                    Riverside Park, Main Street
                    <br />
                    Riverside Town, RT1 2AB
                  </ContactInfoItem>

                  <ContactInfoItem icon={Phone} title="TĀLRUNIS">
                    Kluba birojs:{' '}
                    <a href="tel:+441234567890" className="hover:text-teal-700">
                      01234 567890
                    </a>
                    <br />
                    Dalība:{' '}
                    <a href="tel:+441234567891" className="hover:text-teal-700">
                      01234 567891
                    </a>
                  </ContactInfoItem>

                  <ContactInfoItem icon={Mail} title="E-PASTS">
                    Vispārīgi jautājumi:{' '}
                    <a href="mailto:info@rkfenikss.com" className="hover:text-teal-700">
                      info@rkfenikss.com
                    </a>
                    <br />
                    Dalība:{' '}
                    <a href="mailto:membership@rkfenikss.com" className="hover:text-teal-700">
                      membership@rkfenikss.com
                    </a>
                  </ContactInfoItem>

                  <ContactInfoItem icon={Clock} title="DARBA LAIKS">
                    Pirmdiena - Piektdiena: 9:00 - 17:00
                    <br />
                    Sestdiena: 9:00 - 19:00 (Spēļu dienās)
                    <br />
                    Svētdiena: 10:00 - 16:00
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
            name: 'RK "Fēnikss"',
            street: 'Riverside Park, Main Street',
            city: 'Riverside Town',
            postcode: 'RT1 2AB',
          }}
        />
      </main>
    </MainLayout>
  )
}
