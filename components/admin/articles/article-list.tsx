'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, ExternalLink } from 'lucide-react'
import { articleState, articlePath, formatRigaDateTime, type ArticleState } from '@/lib/articles'
import { ArticleStatusPill } from './article-status-pill'
import { useCreateArticle } from './use-create-article'

export type ArticleListItem = {
  id: string; slug: string | null; title: string | null; status: string | null; published_at: string
  updated_at: string; image_url: string | null; author: string | null
}

type Filter = 'all' | ArticleState
const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Visas' },
  { key: 'draft', label: 'Melnraksti' },
  { key: 'scheduled', label: 'Ieplānotas' },
  { key: 'published', label: 'Publicētas' },
]

export function ArticleList({ articles }: { articles: ArticleListItem[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const { create, creating } = useCreateArticle()

  const withState = useMemo(() => {
    const now = new Date()
    return articles.map((a) => ({ ...a, state: articleState(a, now) }))
  }, [articles])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: withState.length, draft: 0, scheduled: 0, published: 0 }
    withState.forEach((a) => { c[a.state]++ })
    return c
  }, [withState])

  const shown = withState.filter(
    (a) => (filter === 'all' || a.state === filter) && (a.title ?? '').toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="mx-auto grid max-w-5xl gap-5 px-4 py-6 lg:px-8 lg:py-10">
      <div className="flex items-center gap-3">
        <h1 className="hidden lg:block font-display text-3xl font-bold uppercase text-club">Ziņas</h1>
        <button
          type="button"
          onClick={create}
          disabled={creating}
          className="ml-auto hidden lg:inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> {creating ? 'Veido…' : 'Jauna ziņa'}
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-club-pale p-1" role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold ${filter === f.key ? 'bg-white shadow-sm' : 'text-[#5B6863]'}`}
            >
              {f.label} <span className="font-medium text-[#5B6863]">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        <label className="relative lg:ml-auto lg:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6863]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Meklēt ziņas…"
            aria-label="Meklēt ziņas"
            className="w-full rounded-md border border-[#DCE3DF] bg-white py-2 pl-9 pr-3 text-[15px]"
          />
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[#DCE3DF] bg-white p-8 text-center text-[#5B6863]">
          {query ? 'Nekas netika atrasts.' : 'Šeit vēl nav ziņu.'}
        </p>
      ) : (
        <ul className="grid gap-3 lg:gap-0 lg:divide-y lg:divide-[#DCE3DF] lg:rounded-lg lg:border lg:border-[#DCE3DF] lg:bg-white">
          {shown.map((a) => (
            <li key={a.id} className="rounded-lg border border-[#DCE3DF] bg-white lg:rounded-none lg:border-0">
              <div className="flex items-center gap-4 p-3 lg:px-4">
                <Link href={`/admin/articles/${a.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                  {a.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image_url} alt="" className="h-14 w-20 shrink-0 rounded object-cover" />
                  ) : (
                    <span className="h-14 w-20 shrink-0 rounded bg-club-pale" />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{a.title || 'Bez nosaukuma'}</span>
                    <span className="mt-0.5 block text-xs text-[#5B6863]">
                      {[a.author, `labots ${formatRigaDateTime(a.updated_at)}`].filter(Boolean).join(' · ')}
                    </span>
                    <span className="mt-1.5 block lg:hidden"><ArticleStatusPill status={a.status} publishedAt={a.published_at} /></span>
                  </span>
                </Link>
                <span className="hidden lg:block"><ArticleStatusPill status={a.status} publishedAt={a.published_at} /></span>
                {a.state === 'published' && (
                  <a href={articlePath(a)} target="_blank" rel="noopener noreferrer" aria-label="Skatīt mājaslapā" className="hidden shrink-0 text-[#5B6863] hover:text-club lg:block">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
