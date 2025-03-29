'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import MainLayout from '@/components/layout/main-layout'

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [scrollY, setScrollY] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'matches', name: 'Match Days' },
    { id: 'training', name: 'Training' },
    { id: 'community', name: 'Community Events' },
    { id: 'social', name: 'Social Events' },
  ]

  const galleryImages = [
    {
      id: 1,
      src: '/placeholder.svg?height=600&width=800&text=Match Day 1',
      alt: 'Match Day Action',
      category: 'matches',
      description: 'Action from our match against Oakwood RFC',
    },
    {
      id: 2,
      src: '/placeholder.svg?height=600&width=800&text=Training Session',
      alt: 'Team Training',
      category: 'training',
      description: 'Weekly training session at Riverside Park',
    },
    {
      id: 3,
      src: '/placeholder.svg?height=600&width=800&text=Community Event',
      alt: 'Community Rugby Day',
      category: 'community',
      description: 'Annual community rugby day with local schools',
    },
    {
      id: 4,
      src: '/placeholder.svg?height=600&width=800&text=Victory Celebration',
      alt: 'Victory Celebration',
      category: 'matches',
      description: 'Celebrating our win against Valley RFC',
    },
    {
      id: 5,
      src: '/placeholder.svg?height=600&width=800&text=Team Building',
      alt: 'Team Building Day',
      category: 'social',
      description: 'Team building activities at the local adventure center',
    },
    {
      id: 6,
      src: '/placeholder.svg?height=600&width=800&text=Match Day 2',
      alt: 'Match Day Action',
      category: 'matches',
      description: 'Action from our match against Hillside RFC',
    },
    {
      id: 7,
      src: '/placeholder.svg?height=600&width=800&text=Fitness Session',
      alt: 'Fitness Training',
      category: 'training',
      description: 'Strength and conditioning session with our fitness coach',
    },
    {
      id: 8,
      src: '/placeholder.svg?height=600&width=800&text=Charity Event',
      alt: 'Charity Fundraiser',
      category: 'community',
      description: "Raising funds for the local children's hospital",
    },
    {
      id: 9,
      src: '/placeholder.svg?height=600&width=800&text=Awards Night',
      alt: 'End of Season Awards',
      category: 'social',
      description: 'Annual end of season awards ceremony',
    },
    {
      id: 10,
      src: '/placeholder.svg?height=600&width=800&text=Match Day 3',
      alt: 'Match Day Action',
      category: 'matches',
      description: 'Action from our match against Lakeside RFC',
    },
    {
      id: 11,
      src: '/placeholder.svg?height=600&width=800&text=Skills Session',
      alt: 'Skills Training',
      category: 'training',
      description: 'Focused skills session on passing and handling',
    },
    {
      id: 12,
      src: '/placeholder.svg?height=600&width=800&text=Club Social',
      alt: 'Club Social Event',
      category: 'social',
      description: 'Summer BBQ at the clubhouse',
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const filteredImages =
    activeCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory)

  return (
    <MainLayout currentPage="GALLERY">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/placeholder.svg?height=1080&width=1920&text=Rugby Gallery')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: 'transform 0.1s linear',
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-900/80 to-teal-700/80" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center text-white">
              <h1 className="mb-4 text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="text-white">CLUB</span>
                <span className="ml-2 font-light italic text-white">GALLERY</span>
              </h1>
              <div className="mx-auto mb-6 h-1 w-32 skew-x-[-12deg] transform bg-white"></div>
              <p className="text-xl text-teal-100">
                Capturing the moments that define our club, from match day action to community
                events.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Category Filters */}
            <div className="mb-12 flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`skew-x-[-12deg] transform px-6 py-3 font-medium tracking-wide transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-teal-800 text-white hover:bg-teal-900'
                      : 'border border-teal-800 bg-white text-teal-800 hover:bg-white hover:text-teal-900'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative transform cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 95%)' }}
                  onClick={() => setSelectedImage(image.src)}
                >
                  <Image
                    src={image.src || '/placeholder.svg'}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className="h-64 w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-teal-900/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="font-bold text-white">{image.alt}</h3>
                    <p className="text-sm text-teal-100">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-xl text-zinc-500">No images found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-h-[80vh] max-w-4xl">
              <Image
                src={selectedImage || '/placeholder.svg'}
                alt="Gallery image"
                width={1200}
                height={800}
                className="max-h-[80vh] w-auto object-contain"
              />
              <button
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  )
}
