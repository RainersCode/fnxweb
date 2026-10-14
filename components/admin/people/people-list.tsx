'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AdminListPage, EmptyState } from '@/components/admin/ui/admin-list-page'

export type PersonKind = 'player' | 'coach'
export type PersonRow = { id: string; name: string; image_url: string | null; is_active: boolean; jersey_number?: number | null; position?: string | null; role?: string | null }

const copy = {
  player: { title: 'Spēlētāji', base: '/admin/players', newLabel: 'Jauns spēlētājs' },
  coach: { title: 'Treneri', base: '/admin/coaches', newLabel: 'Jauns treneris' },
}

export function PeopleList({ kind, rows }: { kind: PersonKind; rows: PersonRow[] }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('active')
  const c = copy[kind]

  const counts = useMemo(() => ({
    active: rows.filter((r) => r.is_active).length,
    inactive: rows.filter((r) => !r.is_active).length,
    all: rows.length,
  }), [rows])

  const shown = rows.filter((r) =>
    (tab === 'all' || (tab === 'active' ? r.is_active : !r.is_active)) &&
    r.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <AdminListPage
      title={c.title}
      newHref={`${c.base}/new`}
      newLabel={c.newLabel}
      search={search}
      onSearch={setSearch}
      tabs={[{ key: 'active', label: 'Aktīvie', count: counts.active }, { key: 'inactive', label: 'Neaktīvie', count: counts.inactive }, { key: 'all', label: 'Visi', count: counts.all }]}
      activeTab={tab}
      onTab={setTab}
    >
      {shown.length === 0 ? <EmptyState text={search ? 'Nekas netika atrasts.' : 'Šeit vēl neviena nav.'} /> : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <li key={r.id}>
              <Link href={`${c.base}/${r.id}`} className="flex items-center gap-4 rounded-lg border border-[#DCE3DF] bg-white p-3 hover:border-club">
                {r.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.image_url} alt="" className="h-16 w-14 shrink-0 rounded object-cover object-top" />
                ) : (
                  <span className="h-16 w-14 shrink-0 rounded bg-club-pale" />
                )}
                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    {kind === 'player' && r.jersey_number != null && <span className="mr-1.5 text-club">#{r.jersey_number}</span>}
                    {r.name}
                  </span>
                  <span className="block truncate text-sm text-[#5B6863]">{kind === 'player' ? r.position || '—' : r.role || '—'}</span>
                  {!r.is_active && <span className="mt-1 inline-block rounded-full bg-[#EEF2EF] px-2 py-0.5 text-xs font-bold text-[#5B6863]">Neaktīvs</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminListPage>
  )
}
