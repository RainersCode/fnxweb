"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"
import MainLayout from "@/components/main-layout"
import { ParallaxHeroSection } from "@/components/ui/parallax-hero-section"
import { SectionTitle } from "@/components/ui/section-title"
import { ContactInfoItem } from "@/components/ui/contact/contact-info-item"
import { SocialLinks } from "@/components/ui/contact/social-links"
import { ContactForm } from "@/components/ui/contact/contact-form"
import { MapSection } from "@/components/ui/map-section"
import { SectionContainer } from "@/components/ui/section-container"
import { GridContainer } from "@/components/ui/grid-container"

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
    console.log("Form submitted:", formData)
  }

  return (
    <MainLayout currentPage="CONTACT">
      <main className="flex-1">
        <ParallaxHeroSection
          title="GET IN"
          titleHighlight="TOUCH"
          subtitle="Have a question or want to join our club? We'd love to hear from you."
          backgroundImage="/placeholder.svg?height=1080&width=1920&text=Rugby Club"
        />

        <SectionContainer withBackground>
          <GridContainer cols={2} gap="lg">
            <div>
              <SectionTitle title="CONTACT INFORMATION" />

              <div className="space-y-8 mt-8">
                <ContactInfoItem icon={MapPin} title="CLUB ADDRESS">
                  Riverside Rugby Club
                  <br />
                  Riverside Park, Main Street
                  <br />
                  Riverside Town, RT1 2AB
                </ContactInfoItem>

                <ContactInfoItem icon={Phone} title="PHONE">
                  Club Office:{" "}
                  <a href="tel:+441234567890" className="hover:text-teal-700">
                    01234 567890
                  </a>
                  <br />
                  Membership:{" "}
                  <a href="tel:+441234567891" className="hover:text-teal-700">
                    01234 567891
                  </a>
                </ContactInfoItem>

                <ContactInfoItem icon={Mail} title="EMAIL">
                  General Inquiries:{" "}
                  <a href="mailto:info@riversiderugby.com" className="hover:text-teal-700">
                    info@riversiderugby.com
                  </a>
                  <br />
                  Membership:{" "}
                  <a href="mailto:membership@riversiderugby.com" className="hover:text-teal-700">
                    membership@riversiderugby.com
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

              <SocialLinks />
            </div>

            <div>
              <SectionTitle title="SEND US A MESSAGE" />
              <ContactForm onSubmit={handleFormSubmit} />
            </div>
          </GridContainer>
        </SectionContainer>

        <MapSection
          address={{
            name: "Riverside Rugby Club",
            street: "Riverside Park, Main Street",
            city: "Riverside Town",
            postcode: "RT1 2AB",
          }}
        />
      </main>
    </MainLayout>
  )
}

