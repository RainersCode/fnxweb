import { default as NextImage } from 'next/image'
import { ArrowRight } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import Link from 'next/link'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { onlyVisible } from '@/lib/articles'
import { Article, Gallery, Fixture, TeamPlayer } from '@/types/supabase'
import { aboutUsData } from '@/data/about-us'
import { HomeHero } from '@/components/features/home-hero'
import { HomeNewsSection } from '@/components/features/home-news-section'
import { HomeGallerySection } from '@/components/features/home-gallery-section'
import { HomeFixturesSection } from '@/components/features/home-fixtures-section'
import { HomeSocialSection } from '@/components/features/home-social-section'
import { HomePlayersSection } from '@/components/features/home-players-section'
import { getActiveTraining, TrainingTimesList } from '@/components/features/training-times'

// Revalidate data every 60 seconds
export const revalidate = 60

// Add type for galleries with thumbnails
interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string | null
}

// Logos are pre-trimmed; width/height are the file's pixel size
const sponsors = [
  { src: '/sponsors/lwhouses.png', name: 'LW Houses', width: 693, height: 111 },
  { src: '/sponsors/brengulu.png', name: 'Brenguļu alus', width: 474, height: 437 },
  { src: '/sponsors/grasbergs.png', name: 'Grasbergs', width: 519, height: 279 },
  { src: '/sponsors/versis-ro.png', name: 'Vērsis RO', width: 768, height: 123 },
  { src: '/sponsors/mutes-veselibas-centrs.png', name: 'Mutes veselības centrs Sigulda', width: 648, height: 269 },
  { src: '/sponsors/ulyssere.png', name: 'UlysseRe', width: 706, height: 122 },
  { src: '/sponsors/valmieras-novads.png', name: 'Valmieras novads', width: 374, height: 115 },
]

// Give every logo roughly the same visual area, so wide wordmarks and square emblems look balanced
const sponsorDisplayWidth = (width: number, height: number) =>
  Math.min(Math.round(Math.sqrt(9000 * (width / height))), 220)

// Server-side data fetching functions
async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await onlyVisible(supabase.from('articles').select('*'))
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

async function getRecentResults(): Promise<Fixture[]> {
  try {
    const { data, error } = await supabase
      .from('fixtures')
      .select('*')
      .lt('match_date', new Date().toISOString())
      .order('match_date', { ascending: false })
      .limit(3)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching recent results:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch all data in parallel on the server
  const [articles, galleries, fixtures, players, recentResults, training] = await Promise.all([
    getArticles(),
    getGalleries(),
    getFixtures(),
    getPlayers(),
    getRecentResults(),
    getActiveTraining(),
  ])

  // Fixtures are fetched from midnight, so skip any match that already kicked off today
  const now = new Date()
  const nextFixture = fixtures.find((fixture) => new Date(fixture.match_date) > now) ?? null

  return (
    <MainLayout currentPage="HOME">
      <main className="flex-1">
        {/* Hero Section - contains the page's primary H1 */}
        <HomeHero nextFixture={nextFixture} />

        {/* Players Section */}
        <HomePlayersSection players={players} />

        {/* Latest News Section */}
        <HomeNewsSection articles={articles} />

        {/* Gallery Section */}
        <HomeGallerySection galleries={galleries} />

        {/* Upcoming Matches Section */}
        <HomeFixturesSection initialFixtures={fixtures} recentResults={recentResults} />

        {/* Social Media Section */}
        <HomeSocialSection />

        {/* Sponsors Section - Clean Quins style */}
        <section className="py-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <h2 className="font-display text-[clamp(34px,4vw,56px)] font-bold uppercase text-club leading-[1.15] tracking-tight mb-12">
              Mūsu sponsori
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-10 md:gap-x-16 md:gap-y-12 max-w-[1100px] mx-auto">
              {sponsors.map((sponsor) => {
                const displayWidth = sponsorDisplayWidth(sponsor.width, sponsor.height)
                return (
                  <NextImage
                    key={sponsor.src}
                    src={sponsor.src}
                    alt={sponsor.name}
                    width={sponsor.width}
                    height={sponsor.height}
                    sizes={`${displayWidth}px`}
                    style={{ width: displayWidth, height: 'auto' }}
                    className="max-w-[38vw]"
                  />
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA / Join Section */}
        <section className="grid md:grid-cols-[1fr_1.2fr] min-h-[360px]">
          <div className="relative h-60 md:h-auto overflow-hidden">
            <NextImage
              src={aboutUsData.imageUrl}
              alt="RK Fēnikss komanda"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="bg-[#111] px-10 py-16 md:px-16 md:py-20 flex flex-col justify-center relative overflow-hidden">
            <span className="absolute -top-5 -right-3 font-display text-[220px] font-bold uppercase text-white/[0.03] leading-none tracking-tighter pointer-events-none select-none hidden md:block">
              FNX
            </span>
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-club-mint mb-4">
              Nāc uz treniņu
            </span>
            <h2 className="font-display text-[clamp(34px,4vw,56px)] font-bold uppercase text-white leading-[1.15] tracking-tight mb-4">
              Pievienojies Fēniksam
            </h2>
            <p className="font-body text-[15px] text-white/70 leading-relaxed mb-8 max-w-[400px]">
              Mūsu mērķis ir nodrošināt viesmīlīgu vidi, kur ikviens var baudīt spēli, attīstīt savas
              prasmes un veidot ilgstošas draudzības gan laukumā, gan ārpus tā.
            </p>
            {training.length > 0 && (
              <div className="mb-8 max-w-[400px]">
                <TrainingTimesList sessions={training} tone="dark" />
              </div>
            )}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2.5 bg-teal-700 hover:bg-teal-600 text-white px-10 py-4 font-cond text-[13px] font-bold tracking-[2.5px] uppercase transition-all duration-300 self-start"
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
