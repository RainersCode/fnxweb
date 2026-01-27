import { default as NextImage } from 'next/image'
import { ArrowRight } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import Link from 'next/link'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { Article, Gallery, Fixture, TrainingSession } from '@/types/supabase'
import { aboutUsData } from '@/data/about-us'
import { HeroCarousel } from '@/components/features/hero-carousel'
import { HomeNewsSection } from '@/components/features/home-news-section'
import { HomeGallerySection } from '@/components/features/home-gallery-section'
import { HomeFixturesSection } from '@/components/features/home-fixtures-section'
import { HomeTrainingSection } from '@/components/features/home-training-section'
import { HomeSocialSection } from '@/components/features/home-social-section'

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
      .limit(3)

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

async function getTrainingSessions(): Promise<TrainingSession[]> {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching training sessions:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch all data in parallel on the server
  const [articles, galleries, fixtures, trainingSessions] = await Promise.all([
    getArticles(),
    getGalleries(),
    getFixtures(),
    getTrainingSessions()
  ])

  return (
    <MainLayout currentPage="HOME">
      <main className="flex-1">
        {/* Hero Section - Server-rendered with client interactivity */}
        <HeroCarousel articles={articles} />

        {/* About Us Section with Parallax */}
        <section className="relative py-24 overflow-hidden">
          {/* Parallax Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/AboutUs/parallax.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/[0.97] via-white/[0.95] to-white/[0.97]" />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-300/50 to-transparent" />
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute bottom-20 right-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                <span className="text-sm font-bold uppercase tracking-widest text-teal-600">Iepazīsti mūs</span>
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-teal-900">PAR </span>
                <span className="text-teal-600 italic font-light">MUMS</span>
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Image */}
              <div className="relative group">
                {/* Main image container */}
                <div className="relative overflow-hidden shadow-2xl">
                  <NextImage
                    src={aboutUsData.imageUrl}
                    alt="Rugby Club Team"
                    width={800}
                    height={600}
                    className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Bottom accent bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-teal-600" />
                </div>

                {/* Floating stats card */}
                <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-white shadow-xl p-6 skew-x-[-6deg] transform border-l-4 border-teal-600">
                  <div className="skew-x-[6deg] transform text-center">
                    <div className="text-4xl font-extrabold text-teal-700">2005</div>
                    <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">Dibināts</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 lg:pl-4">
                {/* Label */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-0.5 bg-teal-600 skew-x-[-12deg]" />
                  <span className="text-sm font-bold uppercase tracking-widest text-teal-600">Mūsu Misija</span>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight text-teal-900 leading-tight">
                  {aboutUsData.mission.title}
                </h3>

                <p className="text-lg text-zinc-600 leading-relaxed">
                  {aboutUsData.mission.content.substring(0, 250)}...
                </p>

                {/* CTA */}
                <Link href="/about" className="inline-block group">
                  <button className="skew-x-[-12deg] transform bg-teal-700 px-8 py-4 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-teal-800 hover:shadow-xl">
                    <span className="inline-flex skew-x-[12deg] transform items-center">
                      UZZINĀT VAIRĀK
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <HomeNewsSection articles={articles} />

        {/* Gallery Section */}
        <HomeGallerySection galleries={galleries} />

        {/* Upcoming Matches Section */}
        <HomeFixturesSection initialFixtures={fixtures} />

        {/* Training Schedule Section */}
        <HomeTrainingSection sessions={trainingSessions} />

        {/* Social Media Section */}
        <HomeSocialSection />

        {/* Sponsors Section with Parallax */}
        <section className="relative py-20 overflow-hidden">
          {/* Parallax Background */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/AboutUs/parallax.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
          />
          {/* Dark overlay for contrast with logos */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-900/95 via-teal-800/90 to-teal-900/95" />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
          <div className="absolute top-10 left-10 w-24 h-0.5 bg-teal-400/30 skew-x-[-12deg]" />
          <div className="absolute bottom-10 right-10 w-24 h-0.5 bg-teal-400/30 skew-x-[-12deg]" />

          {/* Grey Logo Background */}
          <div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
            <NextImage
              src="/Grey Logo.png"
              alt="Grey Logo Background"
              fill
              className="object-contain object-center"
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                <span className="text-sm font-bold uppercase tracking-widest text-teal-300">Partneri</span>
                <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-white">MŪSU </span>
                <span className="text-teal-400 italic font-light">ATBALSTĪTĀJI</span>
              </h2>
              <div className="mx-auto mt-4 h-1 w-24 bg-teal-400 skew-x-[-12deg]" />
            </div>

            {/* Sponsor logos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 py-8">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={num}
                  className="group relative h-[80px] sm:h-[90px] flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 transition-all duration-300 hover:bg-white/20 hover:scale-105 border border-white/10 hover:border-teal-400/50"
                >
                  <NextImage
                    src={num === 7
                      ? `/SponsorsImages/sponsoru_logo_7-removebg-preview.png`
                      : `/SponsorsImages/Sponsor${num === 1 ? '' : 'u'}_logo_${num}-removebg-preview.png`
                    }
                    alt={`Sponsor ${num}`}
                    width={160}
                    height={70}
                    className="object-contain max-h-full brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <p className="text-teal-100/80 mb-6 max-w-md mx-auto">
                Vēlies atbalstīt mūsu komandu un kļūt par partneri?
              </p>
              <Link href="/contact" className="group inline-block">
                <button className="skew-x-[-12deg] transform bg-teal-400 px-8 py-4 font-bold tracking-wide text-teal-900 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-teal-400/25">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    KĻŪT PAR ATBALSTĪTĀJU
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
