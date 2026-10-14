'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AdminListPage, EmptyState } from '@/components/admin/ui/admin-list-page'
import { formatRigaDateTime } from '@/lib/articles'
import { splitFixtures } from '@/lib/fixtures-admin'
import type { FixtureRow } from './fixture-form'

const resultPill = {
  win: 'bg-[#E2F3EA] text-[#146C43]',
  loss: 'bg-[#EEF2EF] text-[#5B6863]',
  draw: 'bg-[#E3EEFB] text-[#1F4E8C]',
}
const resultLabel = { win: 'Uzvara', loss: 'Zaudējums', draw: 'Neizšķirts' }

export function FixtureList({ rows }: { rows: FixtureRow[] }) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('upcoming')
  const { upcoming, played } = useMemo(() => splitFixtures(rows), [rows])
  const shown = (tab === 'upcoming' ? upcoming : played).filter((f) => f.opponent.toLowerCase().includes(search.trim().toLowerCase()))

  return (
    <AdminListPage
      title="Spēles"
      newHref="/admin/fixtures/new"
      newLabel="Jauna spēle"
      search={search}
      onSearch={setSearch}
      tabs={[{ key: 'upcoming', label: 'Gaidāmās', count: upcoming.length }, { key: 'played', label: 'Aizvadītās', count: played.length }]}
      activeTab={tab}
      onTab={setTab}
    >
      {shown.length === 0 ? <EmptyState text={tab === 'upcoming' ? 'Nav ieplānotu spēļu.' : 'Nav aizvadītu spēļu.'} /> : (
        <ul className="grid gap-2">
          {shown.map((f) => (
            <li key={f.id}>
              <Link href={`/admin/fixtures/${f.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-[#DCE3DF] bg-white p-3 hover:border-club">
                <span className="w-32 shrink-0 text-sm text-[#5B6863]">{formatRigaDateTime(f.match_date)}</span>
                <span className="min-w-0 flex-1 font-semibold">{f.is_home_game ? `Fēnikss v ${f.opponent}` : `${f.opponent} v Fēnikss`}</span>
                {f.location && <span className="text-sm text-[#5B6863]">{f.location}</span>}
                {f.score && <span className="font-display text-lg font-bold tabular-nums">{f.score}</span>}
                {f.result && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${resultPill[f.result]}`}>{resultLabel[f.result]}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminListPage>
  )
}
