'use client'

import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, User, Clock, Share2, Facebook, Newspaper } from 'lucide-react'

// X (Twitter) icon component
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
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('lv-LV', options)
  }

  const getReadingTime = (content: string): number => {
    const plainText = content.replace(/<[^>]*>/g, '')
    const wordsPerMinute = 200
    const words = plainText.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const getImageUrl = (url: string | null) => {
    return prepareImagePath(url)
  }

  if (!article) {
    return (
      <MainLayout currentPage="NEWS">
        <main className="flex-1">
          <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-4">
              <Newspaper className="mx-auto h-20 w-20 text-teal-200 mb-6" />
              <h2 className="text-3xl font-bold text-teal-900 mb-4">Raksts nav atrasts</h2>
              <p className="text-zinc-600 mb-8">
                Meklētais raksts neeksistē vai ir dzēsts.
              </p>
              <Link href="/news" className="group inline-block">
                <button className="bg-teal-700 px-8 py-4 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-teal-800 hover:shadow-xl rounded-lg">
                  <span className="inline-flex items-center">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Atpakaļ uz ziņām
                  </span>
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
        {/* Hero Section */}
        <section className="relative min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <NextImage
              src={getImageUrl(article.image_url ?? null) || '/placeholder.svg?height=600&width=900&text=Rugby News'}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-teal-900 via-teal-900/60 to-teal-900/20" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6 pb-8 sm:pb-12 md:pb-16 pt-24 sm:pt-32">
            {/* Back button */}
            <Link href="/news" className="inline-flex items-center mb-6 sm:mb-8 group">
              <span className="flex items-center gap-2 text-teal-200 hover:text-white transition-colors text-sm sm:text-base">
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">Atpakaļ uz ziņām</span>
              </span>
            </Link>

            <div className="max-w-3xl">
              {/* Category badge */}
              <div className="mb-3 sm:mb-4">
                <span className="inline-block bg-teal-500 px-3 py-1 rounded-sm">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Ziņas
                  </span>
                </span>
              </div>

              {/* Title - with proper word breaking */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4 sm:mb-6 break-words hyphens-auto">
                {article.title}
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-teal-100 text-sm sm:text-base">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-teal-300 flex-shrink-0" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-teal-300 flex-shrink-0" />
                  <span>{getReadingTime(article.content)} min</span>
                </div>
                {article.author && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-teal-300 flex-shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{article.author}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="relative py-8 sm:py-12 md:py-16 bg-gray-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
              {/* Main Article Column */}
              <div>
              {/* Article card */}
              <div className="relative bg-white rounded-lg shadow-lg sm:shadow-xl -mt-12 sm:-mt-16 md:-mt-20 z-10 overflow-hidden">
                {/* Top accent */}
                <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                <div className="p-5 sm:p-8 md:p-10 lg:p-12">
                  {/* Article content - with overflow protection */}
                  <article className="prose prose-sm sm:prose-base md:prose-lg prose-teal max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-teal-900 prose-headings:break-words
                    prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-zinc-700 prose-p:leading-relaxed prose-p:break-words
                    prose-a:text-teal-700 prose-a:font-medium prose-a:break-all
                    prose-strong:text-teal-900
                    prose-img:rounded-lg prose-img:shadow-md prose-img:max-w-full prose-img:h-auto
                    prose-ul:text-zinc-700 prose-ol:text-zinc-700
                    prose-li:marker:text-teal-600
                    prose-blockquote:border-l-teal-600 prose-blockquote:bg-teal-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:not-italic prose-blockquote:text-zinc-700
                    prose-pre:overflow-x-auto prose-pre:max-w-full
                    prose-code:break-all
                    [&_*]:max-w-full [&_img]:max-w-full [&_iframe]:max-w-full [&_video]:max-w-full
                  ">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  </article>

                  {/* Share section */}
                  <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-medium text-sm sm:text-base">Dalīties:</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          aria-label="Share on Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors"
                          aria-label="Share on X"
                        >
                          <XIcon className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Author box (if author exists) */}
              {article.author && (
                <div className="mt-6 sm:mt-8 bg-white rounded-lg p-5 sm:p-6 shadow-md border-l-4 border-teal-600">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 sm:h-7 sm:w-7 text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider font-medium">Autors</p>
                      <p className="text-lg sm:text-xl font-bold text-teal-900 truncate">{article.author}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Gallery Section - Below article */}
              {latestGalleries.length > 0 && (
                <div className="mt-8 lg:hidden">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-teal-700 px-5 py-3">
                      <h3 className="text-lg font-bold text-white">Jaunākās galerijas</h3>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3">
                      {latestGalleries.map((gallery) => (
                        <Link
                          key={gallery.id}
                          href={`/gallery/${gallery.id}`}
                          className="group block"
                        >
                          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                            <NextImage
                              src={gallery.thumbnailUrl}
                              alt={gallery.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-white text-sm font-medium line-clamp-2">{gallery.title}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="px-4 pb-4">
                      <Link
                        href="/gallery"
                        className="block text-center text-teal-700 hover:text-teal-800 font-medium text-sm py-2 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
                      >
                        Skatīt visas galerijas
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* Desktop Sidebar - Gallery Column */}
              {latestGalleries.length > 0 && (
                <aside className="hidden lg:block">
                  <div className="sticky top-24">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      {/* Sidebar Header */}
                      <div className="bg-teal-700 px-4 py-3">
                        <h3 className="text-lg font-bold text-white">Jaunākās galerijas</h3>
                      </div>

                      {/* Gallery Items */}
                      <div className="p-4 space-y-4">
                        {latestGalleries.map((gallery) => (
                          <Link
                            key={gallery.id}
                            href={`/gallery/${gallery.id}`}
                            className="group block"
                          >
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2">
                              <NextImage
                                src={gallery.thumbnailUrl}
                                alt={gallery.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <h4 className="text-sm font-semibold text-zinc-800 group-hover:text-teal-700 transition-colors line-clamp-2">
                              {gallery.title}
                            </h4>
                            {gallery.description && (
                              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{gallery.description}</p>
                            )}
                          </Link>
                        ))}
                      </div>

                      {/* View All Link */}
                      <div className="px-4 pb-4">
                        <Link
                          href="/gallery"
                          className="block text-center text-teal-700 hover:text-teal-800 font-medium text-sm py-2 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          Skatīt visas galerijas
                        </Link>
                      </div>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="relative py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6">
              {/* Section Header */}
              <div className="mx-auto mb-8 sm:mb-12 max-w-2xl text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Citas ziņas
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">Izlasi arī citus rakstus</p>
              </div>

              {/* Related articles grid */}
              <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {relatedArticles.map((relatedArticle) => (
                  <Link href={`/news/${relatedArticle.id}`} key={relatedArticle.id} className="group block">
                    <div className="relative h-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <NextImage
                          src={relatedArticle.image_url || '/placeholder.svg?height=400&width=600&text=News'}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span className="text-xs sm:text-sm">{formatDate(relatedArticle.published_at)}</span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2 text-sm sm:text-base break-words">
                          {relatedArticle.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View all link */}
              <div className="mt-8 sm:mt-10 text-center">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-medium text-sm sm:text-base transition-colors"
                >
                  Skatīt visas ziņas
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </MainLayout>
  )
}
