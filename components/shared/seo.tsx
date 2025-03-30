import Head from 'next/head'
import { useEffect, useState } from 'react'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogType?: string
  ogImage?: string
  twitterCard?: string
  structuredData?: any
  noIndex?: boolean
}

export function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/Logo/fēniks_logo-removebg-preview.png',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false,
}: SEOProps) {
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  const siteTitle = title.includes('RK Fēnikss') ? title : `${title} | RK Fēnikss`
  const canonicalUrl = canonical || currentUrl

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="RK Fēnikss" />
      <meta property="og:locale" content="lv_LV" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* No index if specified */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* JSON-LD structured data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  )
} 