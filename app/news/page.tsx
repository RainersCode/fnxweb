import { Metadata } from 'next'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { supabase, DEFAULT_ARTICLE_IMAGE } from '@/lib/supabase'
import { onlyVisible, excerptFor, articlePath } from '@/lib/articles'
import { categoryFromParam, categoryHref, categoryLabel, usedCategories } from '@/lib/article-categories'
import { Article } from '@/types/supabase'
import { pageUrl } from '@/lib/site'

export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: pageUrl('/news') },
  title: 'Ziņas | RK Fēnikss',
  description: 'Jaunākās ziņas un notikumi no RK Fēnikss regbija kluba.',
  openGraph: {
    url: pageUrl('/news'),
    title: 'Ziņas | RK Fēnikss',
    description: 'Jaunākās ziņas un notikumi no RK Fēnikss regbija kluba.',
  },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('lv-LV', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await onlyVisible(supabase.from('articles').select('*'))
      .order('published_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

function CategoryTag({ category }: { category?: string | null }) {
  const label = categoryLabel(category)
  if (!label) return null
  return (
    <span className="block font-cond text-xs font-bold tracking-[2.5px] uppercase text-club mb-2.5">
      {label}
    </span>
  )
}

export default async function NewsPage({ searchParams }: { searchParams: { kategorija?: string | string[] } }) {
  const allArticles = await getArticles()
  const categories = usedCategories(allArticles)
  const active = categoryFromParam(searchParams.kategorija)
  const articles = active ? allArticles.filter((a) => a.category === active) : allArticles

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
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-club-mint mb-3 block">
                RK Fēnikss
              </span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[1.15] tracking-tight">
                Jaunākās<br />Ziņas
              </h1>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            {categories.length > 0 && (
              <nav aria-label="Ziņu kategorijas" className="flex flex-wrap gap-2.5 mb-10">
                {[null, ...categories.map((c) => c.value)].map((value) => {
                  const isActive = value === active
                  return (
                    <Link
                      key={value ?? 'all'}
                      href={categoryHref(value)}
                      scroll={false}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-5 py-2.5 font-cond text-xs font-bold tracking-[2px] uppercase border-2 transition-colors duration-200 ${
                        isActive ? 'bg-[#111] border-[#111] text-white' : 'border-[#ddd] text-[#111] hover:border-[#111]'
                      }`}
                    >
                      {value ? categoryLabel(value) : 'Visas'}
                    </Link>
                  )
                })}
              </nav>
            )}

            {articles.length === 0 && active ? (
              <div className="py-16 text-center max-w-lg mx-auto">
                <h3 className="font-display text-2xl font-bold uppercase text-[#111]/50 tracking-tight mb-4">
                  Šajā kategorijā vēl nav ziņu
                </h3>
                <Link href="/news" className="font-cond text-xs font-bold tracking-[2px] uppercase text-club hover:underline">
                  Skatīt visas ziņas
                </Link>
              </div>
            ) : articles.length === 0 ? (
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
                <Link href={articlePath(articles[0])} className="group block mb-12">
                  <div className="grid md:grid-cols-[1fr_1.4fr] min-h-[440px]">
                    {/* Left text panel */}
                    <div className="bg-[#f5f5f5] p-10 md:p-12 flex flex-col justify-end order-2 md:order-1">
                      <CategoryTag category={articles[0].category} />
                      <h3 className="font-display text-[clamp(26px,3vw,38px)] font-bold uppercase leading-[0.98] text-[#111]">
                        {articles[0].title}
                      </h3>
                      <p className="font-body text-[15px] text-[#666] leading-relaxed mt-4 line-clamp-3">
                        {excerptFor(articles[0], 200)}
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
                        src={articles[0].image_url || DEFAULT_ARTICLE_IMAGE}
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
                      <Link href={articlePath(article)} key={article.id} className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                        <div className="h-[260px] overflow-hidden mb-3.5">
                          <div className="relative h-full">
                            <NextImage
                              src={article.image_url || DEFAULT_ARTICLE_IMAGE}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          </div>
                        </div>
                        <CategoryTag category={article.category} />
                        <h3 className="font-display text-xl font-bold uppercase leading-[1.15] text-[#111] tracking-wide">
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
