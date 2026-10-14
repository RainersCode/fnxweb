'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// "+ Jauna ziņa" creates a draft first, so autosave always has an id. A button, not a link:
// a prefetched link would create empty drafts.
export function useCreateArticle() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  const create = async () => {
    if (creating) return
    setCreating(true)
    try {
      const res = await fetch('/api/admin/articles', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Neizdevās izveidot ziņu')
      router.push(`/admin/articles/${data.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās izveidot ziņu')
      setCreating(false)
    }
  }

  return { create, creating }
}
