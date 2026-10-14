'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

export function AdminListPage({ title, newHref, newLabel, onNew, newBusy, search, onSearch, tabs, activeTab, onTab, children }: {
  title: string
  newHref?: string
  newLabel?: string
  onNew?: () => void
  newBusy?: boolean
  search: string
  onSearch: (value: string) => void
  tabs?: { key: string; label: string; count?: number }[]
  activeTab?: string
  onTab?: (key: string) => void
  children: ReactNode
}) {
  const newClass = 'inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2.5 font-semibold text-white hover:bg-teal-600 disabled:opacity-60'
  return (
    <div className="mx-auto grid max-w-5xl gap-5 px-4 py-6 lg:px-8 lg:py-10">
      <div className="flex items-center gap-3">
        <h1 className="hidden lg:block font-display text-3xl font-bold uppercase text-club">{title}</h1>
        {newLabel && (newHref ? (
          <Link href={newHref} className={`ml-auto ${newClass}`}><Plus className="h-4 w-4" /> {newLabel}</Link>
        ) : (
          <button type="button" onClick={onNew} disabled={newBusy} className={`ml-auto ${newClass}`}><Plus className="h-4 w-4" /> {newLabel}</button>
        ))}
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {tabs && (
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-club-pale p-1" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={activeTab === t.key}
                onClick={() => onTab?.(t.key)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold ${activeTab === t.key ? 'bg-white shadow-sm' : 'text-[#5B6863]'}`}
              >
                {t.label}{t.count !== undefined && <span className="ml-1 font-medium text-[#5B6863]">{t.count}</span>}
              </button>
            ))}
          </div>
        )}
        <label className="relative lg:ml-auto lg:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6863]" />
          <input type="search" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Meklēt…" aria-label="Meklēt" className="w-full rounded-md border border-[#DCE3DF] bg-white py-2 pl-9 pr-3 text-[15px]" />
        </label>
      </div>
      {children}
    </div>
  )
}

export function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-[#DCE3DF] bg-white p-8 text-center text-[#5B6863]">{text}</p>
}
