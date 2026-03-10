import { default as NextImage } from 'next/image'
import { ArrowRight } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import Link from 'next/link'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { Article, Gallery, Fixture, TeamPlayer } from '@/types/supabase'
import { aboutUsData } from '@/data/about-us'
import { HeroCarousel } from '@/components/features/hero-carousel'
import { HomeNewsSection } from '@/components/features/home-news-section'
import { HomeGallerySection } from '@/components/features/home-gallery-section'
import { HomeFixturesSection } from '@/components/features/home-fixtures-section'
import { HomeSocialSection } from '@/components/features/home-social-section'
import { HomePlayersSection } from '@/components/features/home-players-section'

// Revalidate data every 60 seconds
export const revalidate = 60

// Add type for galleries with thumbnails
interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string | null
}

// Server-side data fetching functions
async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(4)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

async function getGalleries(): Promise<GalleryWithThumbnail[]> {
  try {
    const { data: galleriesData, error: galleriesError } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)

    if (galleriesError) throw galleriesError

    // For each gallery, get the first image
    const galleriesWithThumbnails = await Promise.all(
      (galleriesData || []).map(async (gallery) => {
        const { data: imagesData, error: imagesError } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('gallery_id', gallery.id)
          .limit(1)

        if (imagesError) {
          return {
            ...gallery,
            thumbnailUrl: '/placeholder.svg?height=300&width=400&text=Gallery'
          }
        }

        const thumbnailUrl = imagesData && imagesData.length > 0
          ? prepareImagePath(imagesData[0].image_url)
          : '/placeholder.svg?height=300&width=400&text=Gallery'

        return {
          ...gallery,
          thumbnailUrl
        }
      })
    )

    return galleriesWithThumbnails
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return []
  }
}

async function getPlayers(): Promise<TeamPlayer[]> {
  try {
    const { data, error } = await supabase
      .from('team_players')
      .select('*')
      .eq('is_active', true)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching players:', error)
    return []
  }
}

async function getFixtures(): Promise<Fixture[]> {
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .gte('match_date', today.toISOString())
      .order('match_date', { ascending: true })
      .limit(3)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch all data in parallel on the server
  const [articles, galleries, fixtures, players] = await Promise.all([
    getArticles(),
    getGalleries(),
    getFixtures(),
    getPlayers(),
  ])

  return (
    <MainLayout currentPage="HOME">
      <main className="flex-1">
        {/* SEO: Primary H1 with target keyword for search visibility */}
        <h1 className="sr-only">Regbija Klubs "Fēnikss" — Valmieras Regbija Klubs</h1>

        {/* Hero Section - Server-rendered with client interactivity */}
        <HeroCarousel articles={articles} />

        {/* Players Section */}
        <HomePlayersSection players={players} />

        {/* Latest News Section */}
        <HomeNewsSection articles={articles} />

        {/* Gallery Section */}
        <HomeGallerySection galleries={galleries} />

        {/* Upcoming Matches Section */}
        <HomeFixturesSection initialFixtures={fixtures} />

{/* Social Media Section */}
        <HomeSocialSection />

        {/* Sponsors Section - Clean Quins style */}
        <section className="py-16 bg-[#bce8e4]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <h2 className="font-display text-[clamp(42px,5.5vw,80px)] font-bold uppercase text-teal-800 leading-[0.88] tracking-tight mb-12">
              Mūsu<br />Sponsori
            </h2>

            {[
              [
                { src: '/SponsorsImages/Sponsor_logo_1-removebg-preview.png', alt: 'Sponsors 1' },
                { src: '/SponsorsImages/Sponsoru_logo_2-removebg-preview.png', alt: 'Sponsors 2' },
                { src: '/SponsorsImages/Sponsoru_logo_3-removebg-preview.png', alt: 'Sponsors 3' },
              ],
              [
                { src: '/SponsorsImages/Sponsoru_logo_4-removebg-preview.png', alt: 'Sponsors 4' },
                { src: '/SponsorsImages/Sponsoru_logo_5-removebg-preview.png', alt: 'Sponsors 5' },
                { src: '/SponsorsImages/Sponsoru_logo_6-removebg-preview.png', alt: 'Sponsors 6' },
              ],
              [
                { src: '/SponsorsImages/sponsoru_logo_7-removebg-preview.png', alt: 'Sponsors 7' },
              ],
            ].map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-8 mb-8 last:mb-0">
                {row.map((sponsor) => (
                  <div
                    key={sponsor.src}
                    className="h-24 w-[200px] flex items-center justify-center p-3"
                  >
                    <NextImage
                      src={sponsor.src}
                      alt={sponsor.alt}
                      width={200}
                      height={80}
                      className="object-contain max-h-full"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* CTA / Join Section */}
        <section className="grid md:grid-cols-[1fr_1.2fr] min-h-[360px]">
          <div className="relative h-60 md:h-auto overflow-hidden">
            <NextImage
              src={aboutUsData.imageUrl}
              alt="Rugby Club Team"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="bg-[#111] px-10 py-16 md:px-16 md:py-20 flex flex-col justify-center relative overflow-hidden">
            <span className="absolute -top-5 -right-3 font-display text-[220px] font-bold uppercase text-white/[0.03] leading-none tracking-tighter pointer-events-none select-none hidden md:block">
              JOIN
            </span>
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-4">
              Pievienojies mums
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white leading-[0.9] tracking-tight mb-4">
              Pievienojies<br />Fēnikss
            </h2>
            <p className="font-body text-[15px] text-white/60 leading-relaxed mb-8 max-w-[380px]">
              {aboutUsData.mission.content.substring(0, 180)}...
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 bg-teal-700 hover:bg-teal-600 text-white px-10 py-4 font-cond text-[13px] font-bold tracking-[2.5px] uppercase transition-all duration-300 self-start"
            >
              Sazināties
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
