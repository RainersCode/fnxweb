'use client'

import Link from 'next/link'
import { Plus, Newspaper, Images } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCreateArticle } from '@/components/admin/articles/use-create-article'

export function QuickAddButton() {
  const { create, creating } = useCreateArticle()
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Pievienot"
        className="lg:hidden fixed right-4 bottom-[calc(76px+env(safe-area-inset-bottom,0px))] z-40 h-14 w-14 rounded-full bg-teal-700 text-white shadow-lg grid place-items-center active:scale-95 transition-transform"
      >
        <Plus className="h-7 w-7" />
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-56 p-1.5">
        <button
          type="button"
          onClick={create}
          disabled={creating}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left font-medium hover:bg-club-pale disabled:opacity-60"
        >
          <Newspaper className="h-5 w-5 text-club" /> {creating ? 'Veido…' : 'Jauna ziņa'}
        </button>
        <Link href="/admin/gallery" className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-club-pale">
          <Images className="h-5 w-5 text-club" /> Pievienot foto
        </Link>
      </PopoverContent>
    </Popover>
  )
}
