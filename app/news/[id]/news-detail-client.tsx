'use client'

import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Share2, Facebook } from 'lucide-react'

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
import MainLayout from '@/components/layout/main-layout'
import { prepareImagePath } from '@/lib/supabase'
import { Article, Gallery } from '@/types/supabase'

interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string
}

interface NewsDetailClientProps {
  article: Article | null
  relatedArticles: Article[]
  latestGalleries: GalleryWithThumbnail[]
  pageUrl: string
}

export function NewsDetailClient({ article, relatedArticles, latestGalleries, pageUrl }: NewsDetailClientProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('lv-LV', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  const getReadingTime = (content: string): number => {
    const plainText = content.replace(/<[^>]*>/g, '')
    return Math.ceil(plainText.split(/\s+/).length / 200)
  }

  const getImageUrl = (url: string | null) => prepareImagePath(url)

  if (!article) {
    return (
      <MainLayout currentPage="NEWS">
        <main className="flex-1">
          <div className="min-h-[60vh] flex items-center justify-center bg-white">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="relative w-16 h-16 mx-auto mb-5 opacity-30">
                <NextImage src="/Logo/fēniks_logo-removebg-preview.png" alt="Fēnikss" fill className="object-contain" />
              </div>
              <h2 className="font-display text-3xl font-bold uppercase text-[#111] mb-3">Raksts nav atrasts</h2>
              <p className="font-cond text-xs tracking-[2px] uppercase text-[#888] mb-8">
                Meklētais raksts neeksistē vai ir dzēsts
              </p>
              <Link href="/news">
                <button className="inline-flex items-center gap-2 px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                  Atpakaļ uz ziņām
                </button>
              </Link>
            </div>
          </div>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentPage="NEWS">
      <main className="flex-1 overflow-x-hidden">
        {/* Hero */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <NextImage
              src={getImageUrl(article.image_url ?? null) || '/placeholder.svg?height=600&width=900&text=Rugby News'}
              alt={article.title}
              fill
              className="object-cover scale-105 blur-[2px]"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex flex-col justify-end pb-12">
            <Link href="/news" className="inline-flex items-center gap-2 mb-6 group">
              <span className="font-cond text-sm font-bold tracking-[2px] uppercase text-white/70 group-hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4 inline mr-1 transition-transform group-hover:-translate-x-1" />
                Ziņas
              </span>
            </Link>

            <h1 className="font-display text-[clamp(28px,4vw,52px)] font-bold uppercase text-white leading-[0.95] tracking-tight max-w-[800px] break-words">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-5">
              <span className="font-cond text-sm font-semibold tracking-[2px] uppercase text-white/65">
                {formatDate(article.published_at)}
              </span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="font-cond text-sm font-semibold tracking-[2px] uppercase text-white/65">
                {getReadingTime(article.content)} min lasīšana
              </span>
              {article.author && (
                <>
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  <span className="font-cond text-sm font-semibold tracking-[2px] uppercase text-white/65">
                    {article.author}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12">
              {/* Main content */}
              <div>
                <article className="prose prose-lg max-w-none
                  prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-[#111]
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:font-body prose-p:text-[#444] prose-p:leading-relaxed
                  prose-a:text-teal-700 prose-a:font-medium
                  prose-strong:text-[#111]
                  prose-img:max-w-full prose-img:h-auto
                  prose-ul:text-[#444] prose-ol:text-[#444]
                  prose-li:marker:text-teal-700
                  prose-blockquote:border-l-teal-700 prose-blockquote:bg-[#f5f5f5] prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-[#444]
                  [&_*]:max-w-full
                ">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </article>

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-[#e5e5e5]">
                  <div className="flex items-center gap-4">
                    <span className="font-cond text-xs font-bold tracking-[2px] uppercase text-[#888]">
                      Dalīties
                    </span>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#1877f2] text-white grid place-items-center hover:opacity-80 transition-opacity"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#111] text-white grid place-items-center hover:opacity-80 transition-opacity"
                      aria-label="X"
                    >
                      <XIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              {latestGalleries.length > 0 && (
                <aside className="hidden lg:block">
                  <div className="sticky top-24">
                    <h3 className="font-display text-lg font-bold uppercase tracking-wide text-[#111] mb-4">
                      Galerijas
                    </h3>
                    <div className="h-px bg-[#e5e5e5] mb-5" />
                    <div className="space-y-5">
                      {latestGalleries.map((gallery) => (
                        <Link key={gallery.id} href={`/gallery/${gallery.id}`} className="group block">
                          <div className="relative aspect-[4/3] overflow-hidden mb-2">
                            <NextImage
                              src={gallery.thumbnailUrl}
                              alt={gallery.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </div>
                          <h4 className="font-display text-sm font-bold uppercase text-[#111] group-hover:text-teal-700 transition-colors line-clamp-2">
                            {gallery.title}
                          </h4>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-5">
                      <Link href="/gallery">
                        <button className="w-full py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase text-center hover:bg-teal-700 transition-colors duration-200">
                          Visas galerijas
                        </button>
                      </Link>
                    </div>
                  </div>
                </aside>
              )}
            </div>

            {/* Mobile galleries */}
            {latestGalleries.length > 0 && (
              <div className="lg:hidden mt-12">
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-[#111] mb-4">
                  Galerijas
                </h3>
                <div className="h-px bg-[#e5e5e5] mb-5" />
                <div className="grid grid-cols-2 gap-4">
                  {latestGalleries.map((gallery) => (
                    <Link key={gallery.id} href={`/gallery/${gallery.id}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden mb-2">
                        <NextImage
                          src={gallery.thumbnailUrl}
                          alt={gallery.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                      <h4 className="font-display text-sm font-bold uppercase text-[#111] line-clamp-2">
                        {gallery.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 md:py-20 bg-[#f5f5f5]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
              <h2 className="font-display text-[clamp(32px,4vw,52px)] font-bold uppercase text-[#111] leading-[0.88] tracking-tight mb-10">
                Citas Ziņas
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedArticles.map((related) => (
                  <Link href={`/news/${related.id}`} key={related.id} className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
                    <div className="h-[260px] overflow-hidden mb-3.5">
                      <div className="relative h-full">
                        <NextImage
                          src={related.image_url || '/placeholder.svg?height=400&width=600&text=News'}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold uppercase leading-[1.05] text-[#111] tracking-wide line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="font-cond text-xs font-medium tracking-[1.5px] uppercase text-[#888] mt-2">
                      {formatDate(related.published_at)}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link href="/news">
                  <button className="inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
                    Skatīt visas ziņas
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </MainLayout>
  )
}
