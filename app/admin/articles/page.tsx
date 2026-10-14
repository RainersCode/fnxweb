import { createAdminClient } from '@/lib/supabase'
import { isMissingColumnError } from '@/lib/article-publish'
import { MigrationNotice } from '@/components/admin/migration-notice'
import { ArticleList, type ArticleListItem } from '@/components/admin/articles/article-list'

export const dynamic = 'force-dynamic'

export default async function ArticlesPage() {
  const db = createAdminClient()
  const { data, error } = await db
    .from('articles')
    .select('id, title, status, published_at, updated_at, image_url, author')
    .order('updated_at', { ascending: false })

  if (error && isMissingColumnError(error)) {
    return <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-10"><MigrationNotice /></div>
  }
  if (error) {
    return <p className="mx-auto max-w-5xl px-4 py-10 text-[#5B6863]">Neizdevās ielādēt ziņas. Pārlādē lapu.</p>
  }
  return <ArticleList articles={(data ?? []) as ArticleListItem[]} />
}
