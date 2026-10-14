import Link from 'next/link'
import { requireAdminPage } from '@/lib/require-admin-page'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { articleState } from '@/lib/articles'
import { sanitizeArticleHtml } from '@/lib/sanitize-article'
import { NewsDetailClient, type LinkedFixture, type LinkedGallery } from '@/app/news/[id]/news-detail-client'
import type { Article } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function PreviewArticlePage({ params }: { params: { id: string } }) {
  await requireAdminPage()
  const db = createAdminClient()
  const { data: article } = await db.from('articles').select('*').eq('id', params.id).maybeSingle()
  if (!article) notFound()

  const [fixture, gallery] = await Promise.all([
    article.fixture_id
      ? db.from('fixtures').select('id, opponent, match_date, is_home_game, score').eq('id', article.fixture_id).maybeSingle()
      : Promise.resolve({ data: null }),
    article.gallery_id
      ? db.from('galleries').select('id, title').eq('id', article.gallery_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const live = articleState(article) === 'published'
  const safe: Article = { ...article, title: article.title || 'Bez nosaukuma', content: sanitizeArticleHtml(article.content ?? '') }

  return (
    <>
      <div className="sticky top-0 z-[60] flex items-center justify-between gap-3 bg-[#FFF4D6] px-4 py-2.5 text-sm font-semibold text-[#8A5A00]">
        <span>{live ? 'Priekšskatījums — šī ziņa ir publicēta' : 'Priekšskatījums — šī ziņa vēl nav publicēta'}</span>
        <Link href={`/admin/articles/${article.id}`} className="underline">← Atpakaļ uz redaktoru</Link>
      </div>
      <NewsDetailClient
        article={safe}
        relatedArticles={[]}
        latestGalleries={[]}
        pageUrl=""
        linkedFixture={(fixture.data ?? null) as LinkedFixture | null}
        linkedGallery={(gallery.data ?? null) as LinkedGallery | null}
      />
    </>
  )
}
