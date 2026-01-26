import { Metadata } from 'next'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { Article } from '@/types/supabase'
import { NewsDetailClient } from './news-detail-client'

// Helper function to strip HTML (server-safe version)
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

// Fetch article data
async function getArticle(id: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

// Fetch related articles
async function getRelatedArticles(id: string): Promise<Article[]> {
  try {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .neq('id', id)
      .order('published_at', { ascending: false })
      .limit(3)

    return data || []
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    return {
      title: 'Raksts nav atrasts | RK Fēnikss',
      description: 'Meklētais raksts neeksistē vai ir dzēsts.',
    }
  }

  const plainText = stripHtml(article.content)
  const description = plainText.length > 160 ? `${plainText.substring(0, 160)}...` : plainText
  const imageUrl = prepareImagePath(article.image_url ?? null)

  // Get the base URL from environment or use a default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rkfenikss.lv'
  const articleUrl = `${baseUrl}/news/${id}`
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`

  return {
    title: `${article.title} | RK Fēnikss`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      url: articleUrl,
      siteName: 'RK Fēnikss',
      locale: 'lv_LV',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at || undefined,
      authors: article.author ? [article.author] : undefined,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [absoluteImageUrl],
    },
  }
}

// Generate JSON-LD structured data
function generateJsonLd(article: Article, url: string) {
  const imageUrl = prepareImagePath(article.image_url ?? null)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rkfenikss.lv'
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: absoluteImageUrl,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      '@type': 'Person',
      name: article.author || 'RK Fēnikss',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RK Fēnikss',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch data on the server
  const [article, relatedArticles] = await Promise.all([
    getArticle(id),
    getRelatedArticles(id),
  ])

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rkfenikss.lv'
  const pageUrl = `${baseUrl}/news/${id}`

  return (
    <>
      {/* JSON-LD structured data */}
      {article && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJsonLd(article, pageUrl)),
          }}
        />
      )}

      {/* Client component for interactive UI */}
      <NewsDetailClient
        article={article}
        relatedArticles={relatedArticles}
        pageUrl={pageUrl}
      />
    </>
  )
}
