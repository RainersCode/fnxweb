'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminListPage, EmptyState } from '@/components/admin/ui/admin-list-page'
import { formatTime, groupTrainingByDay } from '@/lib/training'

export type TrainingRow = {
  id: string; day_of_week: number; start_time: string; end_time: string; location: string
  team_group: string | null; description: string | null; is_active: boolean
}

export function TrainingList({ rows }: { rows: TrainingRow[] }) {
  const [search, setSearch] = useState('')
  const q = search.trim().toLowerCase()
  const groups = groupTrainingByDay(rows.filter((r) => `${r.location} ${r.team_group ?? ''}`.toLowerCase().includes(q)))

  return (
    <AdminListPage title="Treniņi" newHref="/admin/training/new" newLabel="Jauns treniņš" search={search} onSearch={setSearch}>
      {groups.length === 0 ? <EmptyState text={search ? 'Nekas netika atrasts.' : 'Treniņi vēl nav pievienoti.'} /> : (
        <div className="grid gap-5">
          {groups.map((g) => (
            <section key={g.day} className="rounded-lg border border-[#DCE3DF] bg-white">
              <h2 className="border-b border-[#DCE3DF] px-4 py-2.5 font-semibold">{g.label}</h2>
              <ul className="divide-y divide-[#DCE3DF]">
                {g.sessions.map((s) => (
                  <li key={s.id}>
                    <Link href={`/admin/training/${s.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-[#F4F6F5]">
                      <span className="font-display text-lg font-bold text-club tabular-nums">{formatTime(s.start_time)}–{formatTime(s.end_time)}</span>
                      <span className="font-medium">{s.location}</span>
                      {s.team_group && <span className="text-sm text-[#5B6863]">{s.team_group}</span>}
                      {!s.is_active && <span className="ml-auto rounded-full bg-[#EEF2EF] px-2 py-0.5 text-xs font-bold text-[#5B6863]">Neaktīvs</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </AdminListPage>
  )
}
