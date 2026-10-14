'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { naturalSortByName, pickNextToStart, queueSummary, retryFailed, type QueueItem } from '@/lib/upload-queue'

type Upload = (file: File, order: number, onProgress: (p: number) => void) => Promise<void>

// Uploads up to 3 files at once; failed files wait for "Mēģināt vēlreiz"
export function useUploadQueue(upload: Upload) {
  const [items, setItems] = useState<QueueItem[]>([])
  const files = useRef(new Map<string, File>())
  const previews = useRef(new Map<string, string>())
  const uploadRef = useRef(upload)
  uploadRef.current = upload

  const add = useCallback((list: File[], startOrder: number) => {
    const sorted = naturalSortByName(list.filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name)))
    const created = sorted.map((file, i) => {
      const id = crypto.randomUUID()
      files.current.set(id, file)
      previews.current.set(id, URL.createObjectURL(file))
      return { id, name: file.name, status: 'waiting' as const, progress: 0, order: startOrder + i }
    })
    setItems((prev) => [...prev, ...created])
  }, [])

  useEffect(() => {
    const ids = pickNextToStart(items)
    if (!ids.length) return
    setItems((prev) => prev.map((i) => (ids.includes(i.id) ? { ...i, status: 'uploading', progress: 0 } : i)))
    for (const id of ids) {
      const file = files.current.get(id)
      const item = items.find((i) => i.id === id)
      if (!file || !item) continue
      uploadRef.current(file, item.order, (p) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, progress: p } : i))))
        .then(() => {
          setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'done', progress: 100 } : i)))
          files.current.delete(id)
        })
        .catch((e: unknown) => {
          setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'failed', error: e instanceof Error ? e.message : 'Neizdevās' } : i)))
        })
    }
  }, [items])

  const retry = useCallback((ids?: string[]) => setItems((prev) => retryFailed(prev, ids)), [])

  // Finished items leave the queue list once everything settles
  const clearDone = useCallback(() => {
    setItems((prev) => {
      prev.filter((i) => i.status === 'done').forEach((i) => {
        const url = previews.current.get(i.id)
        if (url) URL.revokeObjectURL(url)
        previews.current.delete(i.id)
      })
      return prev.filter((i) => i.status !== 'done')
    })
  }, [])

  const previewOf = useCallback((id: string) => previews.current.get(id), [])

  return { items, add, retry, clearDone, summary: queueSummary(items), previewOf }
}
