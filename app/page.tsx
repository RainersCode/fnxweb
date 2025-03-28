"use client"

import { default as NextImage } from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import MainLayout from "@/components/main-layout"
import { SectionContainer } from "@/components/ui/section-container"
import { GridContainer } from "@/components/ui/grid-container"
import { SectionTitle } from "@/components/ui/section-title"
import Link from "next/link"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  const newsItems = [
    {
      title: "SEASON OPENER THIS SATURDAY",
      description: "Join us for our first match of the season against local rivals.",
      image: "/placeholder.svg?height=1080&width=1920&text=Season Opener",
    },
    {
      title: "NEW TRAINING SCHEDULE",
      description: "Coach Williams has announced the new training schedule for the upcoming season.",
      image: "/placeholder.svg?height=1080&width=1920&text=Training Schedule",
    },
    {
      title: "COMMUNITY FUNDRAISER SUCCESS",
      description: "Our recent community fundraiser raised over £2,000 for new training equipment.",
      image: "/placeholder.svg?height=1080&width=1920&text=Fundraiser",
    },
  ]

  const galleryImages = [
    { src: "/placeholder.svg?height=600&width=800&text=Match Day", alt: "Match Day Action", category: "matches" },
    { src: "/placeholder.svg?height=600&width=800&text=Training", alt: "Team Training", category: "training" },
    { src: "/placeholder.svg?height=600&width=800&text=Community", alt: "Community Event", category: "community" },
    { src: "/placeholder.svg?height=600&width=800&text=Celebration", alt: "Victory Celebration", category: "matches" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1))
    }, 5000)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [newsItems.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === newsItems.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? newsItems.length - 1 : prev - 1))
  }

  return (
    <MainLayout currentPage="HOME">
      <main className="flex-1">
        {/* Hero Section with News Carousel and Shapes */}
        <section className="relative h-[80vh] overflow-hidden">
          {/* Decorative Shapes */}
          <div className="absolute top-20 right-[10%] w-32 h-32 bg-teal-500/20 rounded-full blur-xl z-0"></div>
          <div className="absolute bottom-20 left-[5%] w-64 h-64 bg-teal-700/10 rounded-full blur-xl z-0"></div>
          <div className="absolute top-[30%] left-[20%] w-16 h-16 border-4 border-teal-500/30 transform rotate-45 z-0"></div>
          <div className="absolute bottom-[40%] right-[15%] w-24 h-24 border-8 border-teal-800/20 rounded-full z-0"></div>
          <div className="absolute top-[20%] right-[30%] w-20 h-20 bg-transparent border-r-4 border-t-4 border-teal-600/30 transform rotate-12 z-0"></div>

          {/* Sharp diagonal line */}
          <div className="absolute top-0 right-0 w-[150px] h-[150px] overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-[300px] h-[50px] bg-teal-800/20 transform rotate-45 translate-y-[-50%] translate-x-[25%]"></div>
          </div>

          <div className="absolute inset-0 z-0">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <NextImage
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover brightness-90"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-[1]" />

          <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-8 z-20">
            <button
              onClick={prevSlide}
              className="px-4 py-4 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-white/90 text-teal-800 hover:text-teal-900 hover:bg-white shadow-lg"
              aria-label="Previous slide"
            >
              <span className="transform skew-x-[12deg] inline-flex items-center">
                <ChevronLeft className="h-6 w-6" />
              </span>
            </button>
            <button
              onClick={nextSlide}
              className="px-4 py-4 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-white/90 text-teal-800 hover:text-teal-900 hover:bg-white shadow-lg"
              aria-label="Next slide"
            >
              <span className="transform skew-x-[12deg] inline-flex items-center">
                <ChevronRight className="h-6 w-6" />
              </span>
            </button>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10 flex h-full flex-col items-start justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-none relative clip-path-polygon">
              {/* Accent line */}
              <div className="absolute left-0 top-0 h-full w-1 bg-teal-800"></div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-none tracking-tighter text-teal-900 uppercase">
                {newsItems[currentSlide].title}
              </h1>
              <p className="mt-4 max-w-xl text-base sm:text-lg text-zinc-700 font-medium">
                {newsItems[currentSlide].description}
              </p>
              <div className="mt-6">
                <button className="px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-teal-800 hover:bg-teal-900 text-white">
                  <span className="transform skew-x-[12deg] inline-flex items-center">READ MORE</span>
                </button>
              </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-8 transform skew-x-[-12deg] transition-all duration-300 ${
                    index === currentSlide ? "bg-teal-800 w-12" : "bg-white/60 hover:bg-teal-50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Team Section with Parallax */}
        <SectionContainer className="overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=Rugby Team')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: "transform 0.1s linear",
            }}
          />
          <div className="absolute inset-0 bg-white/85 z-0" />

          {/* Additional parallax elements */}
          <div
            className="absolute right-0 top-[30%] w-64 h-64 bg-teal-500/5 rounded-full z-0"
            style={{
              transform: `translateY(${scrollY * -0.2}px)`,
              transition: "transform 0.1s linear",
            }}
          />
          <div
            className="absolute left-[5%] bottom-[20%] w-32 h-32 border-2 border-teal-700/10 transform rotate-45 z-0"
            style={{
              transform: `translateY(${scrollY * -0.15}px) rotate(45deg)`,
              transition: "transform 0.1s linear",
            }}
          />

          {/* Sharp diagonal divider at top */}
          <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden z-10">
            <div className="absolute top-0 left-0 right-0 h-32 bg-white transform -skew-y-3"></div>
          </div>

          <div className="relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <SectionTitle title="OUR" titleHighlight="SQUAD" />
            </div>

            <GridContainer cols={2} gap="lg" className="items-center">
              <div
                className="bg-white overflow-hidden shadow-md transform hover:scale-[1.02] transition-transform duration-300"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 92%, 95% 100%, 0 100%)" }}
              >
                <NextImage
                  src="/placeholder.svg?height=600&width=800&text=Team Photo"
                  alt="Team Photo"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-teal-900 uppercase tracking-tight">JOIN OUR WINNING TEAM</h3>
                <p className="text-zinc-700">
                  We&apos;re always looking for passionate players to join our ranks. Whether you&apos;re an experienced
                  player or new to the sport, there&apos;s a place for you at Riverside Rugby Club.
                </p>
                <button className="px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-teal-800 hover:bg-teal-900 text-white">
                  <span className="transform skew-x-[12deg] inline-flex items-center">LEARN MORE</span>
                </button>
              </div>
            </GridContainer>
          </div>
        </SectionContainer>

        {/* Gallery Section */}
        <SectionContainer className="bg-white">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <SectionTitle title="LATEST" titleHighlight="PHOTOS" />
            <p className="mt-4 text-lg text-zinc-600">
              Capturing the spirit and energy of our club through memorable moments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden group transform hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 95%)" }}
              >
                <NextImage
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold">{image.alt}</h3>
                  <p className="text-teal-100 text-sm">{image.category}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/gallery" 
              className="inline-flex px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-teal-800 hover:bg-teal-900 text-white"
            >
              <span className="transform skew-x-[12deg] inline-flex items-center">VIEW ALL PHOTOS</span>
            </Link>
          </div>
        </SectionContainer>

        {/* Upcoming Matches Section */}
        <SectionContainer>
          <div className="text-center mb-12">
            <SectionTitle title="UPCOMING" titleHighlight="MATCHES" />
          </div>

          <GridContainer cols={3} gap="md">
            {[1, 2, 3].map((match) => (
              <Card key={match} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-teal-800 mb-4">
                    <CalendarDays className="h-5 w-5" />
                    <span className="text-sm font-medium">Saturday, March 30th, 2024</span>
                  </div>
                  <h3 className="text-xl font-bold text-teal-900 mb-2">Riverside vs Eagles</h3>
                  <div className="flex items-center gap-2 text-zinc-600 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Kick-off: 15:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Home Ground</span>
                  </div>
                  <button className="px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-teal-800 hover:bg-teal-900 text-white w-full">
                    <span className="transform skew-x-[12deg] inline-flex items-center">MATCH DETAILS</span>
                  </button>
                </CardContent>
              </Card>
            ))}
          </GridContainer>
        </SectionContainer>
      </main>
    </MainLayout>
  )
}

