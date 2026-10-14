import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { isMissingColumnError } from '@/lib/article-publish'
import type { AdminArticle } from '@/lib/articles'
import { MigrationNotice } from '@/components/admin/migration-notice'
import { ArticleEditor } from '@/components/admin/articles/article-editor'
import type { FixtureOption, GalleryOption } from '@/components/admin/articles/article-settings'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const db = createAdminClient()
  const [article, fixtures, galleries] = await Promise.all([
    db.from('articles').select('*').eq('id', params.id).maybeSingle(),
    db.from('fixtures').select('id, opponent, match_date, is_home_game').order('match_date', { ascending: false }).limit(60),
    db.from('galleries').select('id, title').order('created_at', { ascending: false }).limit(60),
  ])

  if (article.error && isMissingColumnError(article.error)) {
    return <div className="mx-auto max-w-3xl px-4 py-10"><MigrationNotice /></div>
  }
  if (!article.data) notFound()

  return (
    <ArticleEditor
      article={article.data as AdminArticle}
      fixtures={(fixtures.data ?? []) as FixtureOption[]}
      galleries={(galleries.data ?? []) as GalleryOption[]}
    />
  )
}
