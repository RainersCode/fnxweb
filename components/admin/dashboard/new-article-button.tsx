'use client'

import { Newspaper } from 'lucide-react'
import { useCreateArticle } from '@/components/admin/articles/use-create-article'

export function NewArticleButton() {
  const { create, creating } = useCreateArticle()
  return (
    <button
      type="button"
      onClick={create}
      disabled={creating}
      className="flex items-center gap-3 rounded-lg bg-club px-5 py-4 text-left text-white hover:bg-club-deep disabled:opacity-60 transition-colors"
    >
      <Newspaper className="h-6 w-6 shrink-0" />
      <span className="font-semibold">{creating ? 'Veido…' : 'Jauna ziņa'}</span>
    </button>
  )
}
