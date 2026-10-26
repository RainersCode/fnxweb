import Link from 'next/link'
import { requireAdminPage } from '@/lib/require-admin-page'
import { Images, ExternalLink } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase'
import { articlePath, articleState, formatRigaDateTime } from '@/lib/articles'
import { isMissingColumnError } from '@/lib/article-publish'
import { MigrationNotice } from '@/components/admin/migration-notice'
import { ArticleStatusPill } from '@/components/admin/articles/article-status-pill'
import { NewArticleButton } from '@/components/admin/dashboard/new-article-button'
import { VisitorStats } from '@/components/admin/dashboard/visitor-stats'

export const dynamic = 'force-dynamic'

type Row = { id: string; slug: string | null; title: string | null; status: string | null; published_at: string; updated_at: string }

function Section({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <section className="rounded-lg border border-[#DCE3DF] bg-white">
      <h2 className="border-b border-[#DCE3DF] px-5 py-3 font-semibold">{title}</h2>
      {children.length ? <ul className="divide-y divide-[#DCE3DF]">{children}</ul> : <p className="px-5 py-4 text-sm text-[#5B6863]">{empty}</p>}
    </section>
  )
}

export default async function AdminHome() {
  await requireAdminPage()
  const db = createAdminClient()
  const { data, error } = await db
    .from('articles')
    .select('id, slug, title, status, published_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(60)

  const now = new Date()
  const rows = (data ?? []) as Row[]
  const drafts = rows.filter((a) => articleState(a, now) === 'draft').slice(0, 5)
  const scheduled = rows
    .filter((a) => articleState(a, now) === 'scheduled')
    .sort((a, b) => a.published_at.localeCompare(b.published_at))
  const recent = rows
    .filter((a) => articleState(a, now) === 'published')
    .sort((a, b) => b.published_at.localeCompare(a.published_at))
    .slice(0, 5)

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="hidden lg:block font-display text-3xl font-bold uppercase text-club">Sākums</h1>

      <div className="grid grid-cols-2 gap-3">
        <NewArticleButton />
        <Link href="/admin/gallery" className="flex items-center gap-3 rounded-lg bg-club-pale px-5 py-4 font-semibold text-club hover:bg-[#E2EAE5]">
          <Images className="h-6 w-6 shrink-0" /> Pievienot foto
        </Link>
      </div>

      {error && isMissingColumnError(error) ? (
        <MigrationNotice />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Turpināt rakstīt" empty="Nav nepabeigtu melnrakstu.">
            {drafts.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#F4F6F5]">
                  <span className="min-w-0 truncate font-medium">{a.title || 'Bez nosaukuma'}</span>
                  <span className="shrink-0 text-xs text-[#5B6863]">{formatRigaDateTime(a.updated_at)}</span>
                </Link>
              </li>
            ))}
          </Section>
          <Section title="Ieplānots" empty="Nekas nav ieplānots.">
            {scheduled.map((a) => (
              <li key={a.id}>
                <Link href={`/admin/articles/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#F4F6F5]">
                  <span className="min-w-0 truncate font-medium">{a.title}</span>
                  <ArticleStatusPill status={a.status} publishedAt={a.published_at} />
                </Link>
              </li>
            ))}
          </Section>
          <div className="lg:col-span-2">
            <Section title="Nesen publicēts" empty="Vēl nav publicētu ziņu.">
              {recent.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <Link href={`/admin/articles/${a.id}`} className="min-w-0 truncate font-medium hover:text-club">{a.title}</Link>
                  <a href={articlePath(a)} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 text-sm text-[#5B6863] hover:text-club">
                    Skatīt <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </Section>
          </div>
        </div>
      )}

      <VisitorStats />
    </div>
  )
}
