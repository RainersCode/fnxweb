import { Metadata } from 'next'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types/supabase'

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
  return new Date(dateString).toLocaleDateString('lv-LV', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
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
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] bg-stripes-dark overflow-hidden">
          <div className="absolute inset-0">
            <NextImage
              src="/AboutUs/parallax.jpg"
              alt="Ziņas"
              fill
              className="object-cover opacity-30 scale-105 blur-[2px]"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">
                RK Fēnikss
              </span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
                Jaunākās<br />Ziņas
              </h1>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            {articles.length === 0 ? (
              <div className="py-16 text-center max-w-lg mx-auto">
                <div className="relative w-16 h-16 mx-auto mb-5 opacity-30">
                  <NextImage src="/Logo/fēniks_logo-removebg-preview.png" alt="Fēnikss" fill className="object-contain" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-[#111]/50 tracking-tight mb-2">
                  Nav rakstu
                </h3>
                <p className="font-cond text-xs tracking-[2px] uppercase text-[#888]">
                  Šobrīd nav publicētu rakstu
                </p>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                <Link href={`/news/${articles[0].id}`} className="group block mb-12">
                  <div className="grid md:grid-cols-[1fr_1.4fr] min-h-[440px]">
                    {/* Left text panel */}
                    <div className="bg-[#f5f5f5] p-10 md:p-12 flex flex-col justify-end order-2 md:order-1">
                      <h3 className="font-display text-[clamp(26px,3vw,38px)] font-bold uppercase leading-[0.98] text-[#111]">
                        {articles[0].title}
                      </h3>
                      <p className="font-body text-[15px] text-[#666] leading-relaxed mt-4 line-clamp-3">
                        {stripHtml(articles[0].content).substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-3.5 mt-6">
                        <span className="font-cond text-[13px] font-semibold tracking-[2px] uppercase text-[#888]">
                          {formatDate(articles[0].published_at)}
                        </span>
                        <span className="w-[34px] h-[34px] border-2 border-[#111] grid place-items-center rotate-45 group-hover:bg-black/5 transition-colors">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#111] -rotate-45">
                            <polygon points="8,5 19,12 8,19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    {/* Right image */}
                    <div className="relative h-64 md:h-auto overflow-hidden order-1 md:order-2">
                      <NextImage
                        src={articles[0].image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'}
                        alt={articles[0].title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </Link>

                {/* Article grid */}
                {articles.length > 1 && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {articles.slice(1).map((article) => (
                      <Link href={`/news/${article.id}`} key={article.id} className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                        <div className="h-[260px] overflow-hidden mb-3.5">
                          <div className="relative h-full">
                            <NextImage
                              src={article.image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          </div>
                        </div>
                        <h3 className="font-display text-xl font-bold uppercase leading-[1.05] text-[#111] tracking-wide">
                          {article.title}
                        </h3>
                        <div className="font-cond text-xs font-medium tracking-[1.5px] uppercase text-[#888] mt-2">
                          {formatDate(article.published_at)}
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
