'use client'

import { default as NextImage } from 'next/image'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, User } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { SectionContainer } from '@/components/shared/section-container'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { Article } from '@/types/supabase'
import { generateArticleSchema } from '@/lib/structured-data'
import Head from 'next/head'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)
  const [pageUrl, setPageUrl] = useState('')

  const id = params?.id as string

  // Set page URL for structured data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href)
    }
  }, [])

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Fetch article from Supabase
  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()

        if (error) throw error

        setArticle(data)
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

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('lv-LV', options)
  }

  // Strip HTML for meta description
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Generate meta title and description
  const getMetaTitle = () => {
    return article ? `${article.title} | RK Fēnikss` : 'Raksts | RK Fēnikss'
  }

  const getMetaDescription = () => {
    if (!article) return ''
    const plainText = stripHtml(article.content)
    return plainText.length > 160 ? `${plainText.substring(0, 160)}...` : plainText
  }

  // Get properly formatted image URL
  const getImageUrl = (url: string | null) => {
    return prepareImagePath(url)
  }

  if (isLoading) {
    return (
      <MainLayout currentPage="NEWS">
        <main className="flex-1 pb-16">
          <SectionContainer className="bg-white">
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-800 border-t-transparent"></div>
            </div>
          </SectionContainer>
        </main>
      </MainLayout>
    )
  }

  if (!article) {
    return (
      <MainLayout currentPage="NEWS">
        <main className="flex-1 pb-16">
          <SectionContainer className="bg-white">
            <div className="py-16 text-center">
              <h2 className="text-2xl font-bold text-gray-700">Raksts nav atrasts</h2>
              <p className="mt-4 text-gray-600">
                Meklētais raksts neeksistē vai ir dzēsts.
              </p>
              <Link href="/news" className="mt-8 inline-block">
                <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Atpakaļ uz ziņām
                  </span>
                </span>
              </Link>
            </div>
          </SectionContainer>
        </main>
      </MainLayout>
    )
  }

  // Generate JSON-LD structured data
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
        <main className="flex-1 pb-16">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-24">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${getImageUrl(article.image_url ?? null) || '/placeholder.svg?height=600&width=900&text=Rugby News'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `translateY(${scrollY * 0.3}px)`,
                transition: 'transform 0.1s linear',
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-900/80 to-teal-700/80" />

            {/* Decorative elements */}
            <div className="absolute right-[10%] top-20 z-0 h-32 w-32 rounded-full bg-teal-500/20 blur-xl"></div>
            <div className="absolute bottom-20 left-[5%] z-0 h-64 w-64 rounded-full bg-teal-700/10 blur-xl"></div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6">
              <div className="mx-auto max-w-3xl text-center text-white">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
                  <span className="text-white">{article.title}</span>
                </h1>
                <div className="mx-auto mb-6 h-1 w-32 skew-x-[-12deg] transform bg-white"></div>
                <div className="flex justify-center gap-4 text-teal-100">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-5 w-5" />
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                  {article.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-5 w-5" />
                      <span>{article.author}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <SectionContainer className="bg-white">
            <div className="relative z-10 -mt-16">
              <div
                className="mx-auto w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl overflow-hidden bg-white p-4 sm:p-8 shadow-xl"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)' }}
              >
                {/* Back button */}
                <Link href="/news" className="inline-flex items-center">
                  <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-teal-900">
                    <span className="inline-flex skew-x-[12deg] transform items-center">
                      <ArrowLeft className="mr-1 h-4 w-4" /> Atpakaļ uz ziņām
                    </span>
                  </span>
                </Link>

                {/* Article content */}
                <div className="prose prose-teal mt-8 max-w-none prose-headings:font-bold prose-headings:text-teal-900 prose-p:text-zinc-700 prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
              </div>
            </div>
          </SectionContainer>
        </main>
      </MainLayout>
    </>
  )
}
