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
          title="GET IN"
          titleHighlight="TOUCH"
          subtitle="Have a question or want to join our club? We'd love to hear from you."
          backgroundImage="/AboutUs/parallax.jpg"
        />

        <SectionContainer withBackground maxWidth="full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GridContainer cols={2} gap="lg" className="items-start">
              <div className="w-full max-w-xl">
                <SectionTitle title="CONTACT INFORMATION" />

                <div className="mt-12 space-y-10">
                  <ContactInfoItem icon={MapPin} title="CLUB ADDRESS">
                    RK &quot;Fēnikss&quot;
                    <br />
                    Riverside Park, Main Street
                    <br />
                    Riverside Town, RT1 2AB
                  </ContactInfoItem>

                  <ContactInfoItem icon={Phone} title="PHONE">
                    Club Office:{' '}
                    <a href="tel:+441234567890" className="hover:text-teal-700">
                      01234 567890
                    </a>
                    <br />
                    Membership:{' '}
                    <a href="tel:+441234567891" className="hover:text-teal-700">
                      01234 567891
                    </a>
                  </ContactInfoItem>

                  <ContactInfoItem icon={Mail} title="EMAIL">
                    General Inquiries:{' '}
                    <a href="mailto:info@rkfenikss.com" className="hover:text-teal-700">
                      info@rkfenikss.com
                    </a>
                    <br />
                    Membership:{' '}
                    <a href="mailto:membership@rkfenikss.com" className="hover:text-teal-700">
                      membership@rkfenikss.com
                    </a>
                  </ContactInfoItem>

                  <ContactInfoItem icon={Clock} title="OPENING HOURS">
                    Monday - Friday: 9:00 AM - 5:00 PM
                    <br />
                    Saturday: 9:00 AM - 7:00 PM (Match days)
                    <br />
                    Sunday: 10:00 AM - 4:00 PM
                  </ContactInfoItem>
                </div>

                <div className="mt-12">
                  <SocialLinks />
                </div>
              </div>

              <div className="w-full max-w-xl">
                <SectionTitle title="SEND US A MESSAGE" />
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
