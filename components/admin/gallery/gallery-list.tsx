'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AdminListPage, EmptyState } from '@/components/admin/ui/admin-list-page'
import { apiSend } from '@/lib/admin-fetch'
import { formatRigaDate } from '@/lib/articles'

export type GalleryCard = { id: string; title: string; created_at: string; cover: string | null; count: number }

export function GalleryList({ galleries }: { galleries: GalleryCard[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const shown = galleries.filter((g) => g.title.toLowerCase().includes(search.trim().toLowerCase()))

  const create = async () => {
    if (!title.trim()) { toast.error('Ievadi nosaukumu'); return }
    setBusy(true)
    try {
      const g = await apiSend<{ id: string }>('/api/admin/gallery', 'POST', { title })
      router.push(`/admin/gallery/${g.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Neizdevās izveidot galeriju')
      setBusy(false)
    }
  }

  return (
    <AdminListPage title="Galerijas" newLabel="Jauna galerija" onNew={() => setCreating(true)} search={search} onSearch={setSearch}>
      {creating && (
        <form onSubmit={(e) => { e.preventDefault(); create() }} className="flex flex-col gap-2 rounded-lg border border-[#DCE3DF] bg-white p-3 sm:flex-row">
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Galerijas nosaukums, piem. Fēnikss v Eži 18.10." aria-label="Galerijas nosaukums" className="min-w-0 flex-1 rounded-md border border-[#DCE3DF] px-3 py-2" />
          <button type="submit" disabled={busy} className="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-600 disabled:opacity-60">{busy ? 'Veido…' : 'Izveidot'}</button>
        </form>
      )}
      {shown.length === 0 ? <EmptyState text={search ? 'Nekas netika atrasts.' : 'Galeriju vēl nav.'} /> : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((g) => (
            <li key={g.id}>
              <Link href={`/admin/gallery/${g.id}`} className="block overflow-hidden rounded-lg border border-[#DCE3DF] bg-white hover:border-club">
                {g.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.cover} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                ) : (
                  <span className="block aspect-[4/3] w-full bg-club-pale" />
                )}
                <span className="block p-3">
                  <span className="block truncate font-semibold">{g.title}</span>
                  <span className="text-sm text-[#5B6863]">{g.count} foto · {formatRigaDate(g.created_at)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminListPage>
  )
}
