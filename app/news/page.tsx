import { Metadata } from 'next'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { CalendarDays, ArrowRight, Newspaper } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types/supabase'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ziņas | RK Fēnikss',
  description: 'Jaunākās ziņas un notikumi no RK Fēnikss regbija kluba.',
  openGraph: {
    title: 'Ziņas | RK Fēnikss',
    description: 'Jaunākās ziņas un notikumi no RK Fēnikss regbija kluba.',
  },
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(dateString).toLocaleDateString('lv-LV', options)
}

async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export default async function NewsPage() {
  const articles = await getArticles()

  return (
    <MainLayout currentPage="NEWS">
      <main className="flex-1">
        {/* Hero Section */}
        <ParallaxHeroSection
          title="JAUNĀKĀS"
          titleHighlight="ZIŅAS"
          subtitle="Sekojiet līdzi jaunākajiem notikumiem mūsu klubā"
          backgroundImage="/AboutUs/parallax.jpg"
        />

        {/* News Articles Section */}
        <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Section Header */}
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                <Newspaper className="h-5 w-5 text-teal-600" />
                <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                <span className="text-teal-900">KLUBA </span>
                <span className="text-teal-600 italic font-light">ZIŅAS</span>
              </h2>
              <p className="mt-4 text-zinc-600 max-w-md mx-auto">
                Jaunākā informācija par notikumiem, spēlēm un aktivitātēm
              </p>
              <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
            </div>

            {articles.length === 0 ? (
              <div className="bg-teal-50 border border-teal-100 p-12 text-center max-w-lg mx-auto">
                <Newspaper className="mx-auto h-16 w-16 text-teal-300 mb-4" />
                <p className="text-xl font-bold text-teal-800 mb-2">Nav rakstu</p>
                <p className="text-teal-600">Šobrīd nav publicētu rakstu.</p>
              </div>
            ) : (
              <>
                {/* Featured Article (first one) */}
                <Link href={`/news/${articles[0].id}`} className="group block mb-12">
                  <div className="relative bg-white shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                    <div className="grid md:grid-cols-2">
                      {/* Image */}
                      <div className="relative h-64 md:h-96 overflow-hidden">
                        <NextImage
                          src={articles[0].image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'}
                          alt={articles[0].title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/20" />

                        {/* Featured badge */}
                        <div className="absolute top-4 left-0 z-10">
                          <div className="skew-x-[-12deg] transform bg-teal-600 px-4 py-2 shadow-lg -translate-x-1">
                            <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">
                              Jaunākais
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-sm text-teal-600 mb-4">
                          <CalendarDays className="h-4 w-4" />
                          <span className="font-medium">{formatDate(articles[0].published_at)}</span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors mb-4">
                          {articles[0].title}
                        </h3>

                        <p className="text-zinc-600 leading-relaxed mb-6 line-clamp-3">
                          {stripHtml(articles[0].content).substring(0, 200)}...
                        </p>

                        <div className="flex items-center text-teal-700 font-bold group-hover:text-teal-600 transition-colors">
                          <span>LASĪT VAIRĀK</span>
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                </Link>

                {/* Rest of articles grid */}
                {articles.length > 1 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.slice(1).map((article) => (
                      <Link href={`/news/${article.id}`} key={article.id} className="group block">
                        <div className="relative h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                          {/* Top accent */}
                          <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                          {/* Image */}
                          <div className="relative h-56 overflow-hidden">
                            <NextImage
                              src={article.image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Date overlay */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/90">
                              <CalendarDays className="h-4 w-4" />
                              <span className="text-sm font-medium">{formatDate(article.published_at)}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold uppercase tracking-tight text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-2 mb-3">
                              {article.title}
                            </h3>

                            <p className="text-sm text-zinc-600 line-clamp-3 mb-4">
                              {stripHtml(article.content).substring(0, 120)}...
                            </p>

                            <div className="flex items-center text-teal-700 font-semibold text-sm group-hover:text-teal-600 transition-colors">
                              <span>LASĪT VAIRĀK</span>
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                            </div>
                          </div>

                          {/* Bottom accent on hover */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
