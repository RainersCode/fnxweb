'use client'

import { default as NextImage } from 'next/image'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Facebook, Share2, User } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { SectionContainer } from '@/components/shared/section-container'
import { supabase } from '@/lib/supabase'
import { Article } from '@/types/supabase'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  const id = params.id as string

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
    return new Date(dateString).toLocaleDateString('en-GB', options)
  }

  // Handle Facebook sharing
  const handleShareToFacebook = () => {
    const url = window.location.href
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
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
              <h2 className="text-2xl font-bold text-gray-700">News article not found</h2>
              <p className="mt-4 text-gray-600">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/news" className="mt-8 inline-block">
                <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to News
                  </span>
                </span>
              </Link>
            </div>
          </SectionContainer>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout currentPage="NEWS">
      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${article.image_url || '/placeholder.svg?height=600&width=900&text=Rugby News'})`,
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
              className="mx-auto max-w-3xl overflow-hidden bg-white p-8 shadow-xl"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)' }}
            >
              {/* Back button */}
              <Link href="/news" className="inline-flex items-center">
                <span className="inline-flex skew-x-[-12deg] transform items-center bg-teal-800 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-teal-900">
                  <span className="inline-flex skew-x-[12deg] transform items-center">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to News
                  </span>
                </span>
              </Link>

              {/* Article content */}
              <div className="prose prose-teal mt-8 max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-zinc-700">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Share buttons */}
              <div className="mt-8 flex items-center gap-4 border-t border-gray-200 pt-6">
                <span className="font-medium text-zinc-700">Share this article:</span>
                <button
                  onClick={handleShareToFacebook}
                  className="flex items-center gap-1 rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                  aria-label="Share to Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </SectionContainer>
      </main>
    </MainLayout>
  )
}
