'use client'

import { default as NextImage } from 'next/image'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, User, Clock, Share2, Facebook, Twitter, Newspaper } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { Article } from '@/types/supabase'
import { generateArticleSchema } from '@/lib/structured-data'
import Head from 'next/head'

export default function NewsDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageUrl, setPageUrl] = useState('')

  const id = params?.id as string

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href)
    }
  }, [])

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()

        if (error) throw error
        setArticle(data)

        // Fetch related articles
        if (data) {
          const { data: related } = await supabase
            .from('articles')
            .select('*')
            .neq('id', id)
            .order('published_at', { ascending: false })
            .limit(3)

          setRelatedArticles(related || [])
        }
      } catch (error) {
        console.error('Error fetching article:', error)
        setArticle(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('lv-LV', options)
  }

  const getReadingTime = (content: string): number => {
    const plainText = stripHtml(content)
    const wordsPerMinute = 200
    const words = plainText.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const getMetaTitle = () => {
    return article ? `${article.title} | RK Fēnikss` : 'Raksts | RK Fēnikss'
  }

  const getMetaDescription = () => {
    if (!article) return ''
    const plainText = stripHtml(article.content)
    return plainText.length > 160 ? `${plainText.substring(0, 160)}...` : plainText
  }

  const getImageUrl = (url: string | null) => {
    return prepareImagePath(url)
  }

  if (isLoading) {
    return (
      <MainLayout currentPage="NEWS">
        <main className="flex-1">
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
              <span className="text-teal-700 font-medium">Ielādē rakstu...</span>
            </div>
          </div>
        </main>
      </MainLayout>
    )
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
                <button className="skew-x-[-12deg] transform bg-teal-700 px-8 py-4 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-teal-800 hover:shadow-xl">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
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

  const articleJsonLd = article ? generateArticleSchema(article, pageUrl) : null

  return (
    <>
      {article && (
        <Head>
          <title>{getMetaTitle()}</title>
          <meta name="description" content={getMetaDescription()} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={getMetaDescription()} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={pageUrl} />
          {article.image_url && <meta property="og:image" content={getImageUrl(article.image_url ?? null)} />}
          <meta property="article:published_time" content={article.published_at} />
          {article.updated_at && <meta property="article:modified_time" content={article.updated_at} />}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={article.title} />
          <meta name="twitter:description" content={getMetaDescription()} />
          {article.image_url && <meta name="twitter:image" content={getImageUrl(article.image_url ?? null)} />}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
        </Head>
      )}

      <MainLayout currentPage="NEWS">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
            {/* Background Image with CSS parallax */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${getImageUrl(article.image_url ?? null) || '/placeholder.svg?height=600&width=900&text=Rugby News'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-teal-900 via-teal-900/70 to-teal-900/30" />

            {/* Decorative skewed lines */}
            <div className="absolute top-20 left-0 w-64 h-1 bg-teal-400/20 skew-x-[-12deg] z-10" />
            <div className="absolute top-28 left-0 w-32 h-1 bg-teal-400/10 skew-x-[-12deg] z-10" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 pb-16 pt-32">
              {/* Back button */}
              <Link href="/news" className="inline-flex items-center mb-8 group">
                <span className="flex items-center gap-2 text-teal-200 hover:text-white transition-colors">
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  <span className="font-medium">Atpakaļ uz ziņām</span>
                </span>
              </Link>

              <div className="max-w-4xl">
                {/* Category badge */}
                <div className="mb-4">
                  <span className="skew-x-[-12deg] inline-block bg-teal-500 px-4 py-1">
                    <span className="skew-x-[12deg] inline-block text-xs font-bold text-white uppercase tracking-wider">
                      Ziņas
                    </span>
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                  {article.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-teal-100">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-teal-300" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-teal-300" />
                    <span>{getReadingTime(article.content)} min lasīšana</span>
                  </div>
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-teal-300" />
                      <span>{article.author}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <section className="relative py-16 bg-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-16 right-0 w-48 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
            <div className="absolute bottom-16 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-4xl mx-auto">
                {/* Article card */}
                <div className="relative bg-white shadow-xl -mt-24 z-10">
                  {/* Top accent */}
                  <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                  <div className="p-6 sm:p-10 md:p-12">
                    {/* Article content */}
                    <article className="prose prose-lg prose-teal max-w-none
                      prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-teal-900
                      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                      prose-p:text-zinc-700 prose-p:leading-relaxed
                      prose-a:text-teal-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-teal-900
                      prose-img:rounded-lg prose-img:shadow-lg
                      prose-ul:text-zinc-700 prose-ol:text-zinc-700
                      prose-li:marker:text-teal-600
                      prose-blockquote:border-l-teal-600 prose-blockquote:bg-teal-50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-zinc-700
                    ">
                      <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </article>

                    {/* Share section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Share2 className="h-5 w-5" />
                          <span className="font-medium">Dalīties:</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 transition-colors skew-x-[-6deg]"
                          >
                            <Facebook className="h-5 w-5 skew-x-[6deg]" />
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white hover:bg-sky-600 transition-colors skew-x-[-6deg]"
                          >
                            <Twitter className="h-5 w-5 skew-x-[6deg]" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author box (if author exists) */}
                {article.author && (
                  <div className="mt-8 bg-gray-50 p-6 sm:p-8 border-l-4 border-teal-600">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-teal-100 flex items-center justify-center skew-x-[-6deg]">
                        <User className="h-8 w-8 text-teal-600 skew-x-[6deg]" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500 uppercase tracking-wider font-medium">Autors</p>
                        <p className="text-xl font-bold text-teal-900">{article.author}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />

              <div className="container mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="mx-auto mb-12 max-w-2xl text-center">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                    <Newspaper className="h-5 w-5 text-teal-600" />
                    <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter">
                    <span className="text-teal-900">CITAS </span>
                    <span className="text-teal-600 italic font-light">ZIŅAS</span>
                  </h2>
                  <div className="mx-auto mt-4 h-1 w-16 bg-teal-700 skew-x-[-12deg]" />
                </div>

                {/* Related articles grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                  {relatedArticles.map((relatedArticle) => (
                    <Link href={`/news/${relatedArticle.id}`} key={relatedArticle.id} className="group block">
                      <div className="relative h-full bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                        <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                        <div className="relative h-48 overflow-hidden">
                          <NextImage
                            src={relatedArticle.image_url || '/placeholder.svg?height=400&width=600&text=News'}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white/90">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-sm">{formatDate(relatedArticle.published_at)}</span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-bold text-teal-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                            {relatedArticle.title}
                          </h3>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </MainLayout>
    </>
  )
}
