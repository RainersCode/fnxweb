import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase, prepareImagePath } from '@/lib/supabase'
import { galleryCover } from '@/lib/gallery'
import { Article, Gallery } from '@/types/supabase'
import { onlyVisible, excerptFor, jsonLdString } from '@/lib/articles'
import { sanitizeArticleHtml } from '@/lib/sanitize-article'
import { NewsDetailClient, type LinkedFixture, type LinkedGallery } from './news-detail-client'

// Re-check every minute so scheduled articles appear on time and unpublished ones disappear
export const revalidate = 60

// Type for gallery with thumbnail
interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string
}

// Fetch article data (only articles that are publicly visible)
async function getArticle(id: string): Promise<Article | null> {
  try {
    const { data, error } = await onlyVisible(supabase.from('articles').select('*').eq('id', id)).maybeSingle()

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
    const { data } = await onlyVisible(supabase.from('articles').select('*').neq('id', id))
      .order('published_at', { ascending: false })
      .limit(3)

    return data || []
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

// Fetch latest galleries with thumbnails
async function getLatestGalleries(): Promise<GalleryWithThumbnail[]> {
  try {
    const { data: galleriesData, error } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(4)

    if (error) throw error

    // For each gallery, get the first image as thumbnail
    const galleriesWithThumbnails = await Promise.all(
      (galleriesData || []).map(async (gallery) => {
        const { data: imagesData } = await supabase
          .from('gallery_images')
          .select('image_url')
          .eq('gallery_id', gallery.id)
          .order('display_order', { ascending: true })
          .limit(1)

        const coverUrl = galleryCover(gallery.cover_image_url, imagesData?.[0]?.image_url)
        const thumbnailUrl = coverUrl ? prepareImagePath(coverUrl) : '/placeholder.svg?height=200&width=300&text=Gallery'

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

// The match and gallery an article is linked to, shown as cards under the article
async function getLinked(article: Article): Promise<{ fixture: LinkedFixture | null; gallery: LinkedGallery | null }> {
  const [fixture, gallery] = await Promise.all([
    article.fixture_id
      ? supabase.from('fixtures').select('id, opponent, match_date, is_home_game, score').eq('id', article.fixture_id).maybeSingle()
      : Promise.resolve({ data: null }),
    article.gallery_id
      ? supabase.from('galleries').select('id, title').eq('id', article.gallery_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])
  return { fixture: fixture.data ?? null, gallery: gallery.data ?? null }
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

  const description = excerptFor(article)
  const imageUrl = prepareImagePath(article.image_url ?? null)

  // Get the base URL from environment or use a default
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fnx-rugby.lv'
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fnx-rugby.lv'
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
  const [article, relatedArticles, latestGalleries] = await Promise.all([
    getArticle(id),
    getRelatedArticles(id),
    getLatestGalleries(),
  ])

  // Drafts and scheduled articles are not public yet
  if (!article) notFound()
  const linked = await getLinked(article)
  const safeArticle = { ...article, content: sanitizeArticleHtml(article.content) }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.fnx-rugby.lv'
  const pageUrl = `${baseUrl}/news/${id}`

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(generateJsonLd(safeArticle, pageUrl)),
        }}
      />

      {/* Client component for interactive UI */}
      <NewsDetailClient
        article={safeArticle}
        relatedArticles={relatedArticles}
        latestGalleries={latestGalleries}
        pageUrl={pageUrl}
        linkedFixture={linked.fixture}
        linkedGallery={linked.gallery}
      />
    </>
  )
}
