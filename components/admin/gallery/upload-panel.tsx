'use client'

import { useRef, useState } from 'react'
import { ImagePlus, RotateCcw } from 'lucide-react'
import type { QueueItem } from '@/lib/upload-queue'

export function UploadPanel({ items, summary, onFiles, onRetry, previewOf }: {
  items: QueueItem[]
  summary: { total: number; done: number; failed: number; active: number; waiting: number }
  onFiles: (files: File[]) => void
  onRetry: (ids?: string[]) => void
  previewOf: (id: string) => string | undefined
}) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const pending = items.filter((i) => i.status !== 'done')

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); onFiles(Array.from(e.dataTransfer.files)) }}
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center ${dragging ? 'border-teal-700 bg-club-pale' : 'border-[#DCE3DF] bg-[#F7F9F8]'} text-[#5B6863] hover:border-teal-700 hover:text-club`}
      >
        <ImagePlus className="h-8 w-8" />
        <span className="font-semibold">Ievelc foto šeit vai izvēlies</span>
        <span className="text-sm">Var izvēlēties uzreiz daudz foto</span>
      </button>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { onFiles(Array.from(e.target.files ?? [])); e.target.value = '' }} />

      {summary.total > 0 && (summary.active > 0 || summary.waiting > 0 || summary.failed > 0) && (
        <div className="rounded-lg border border-[#DCE3DF] bg-white p-3">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span>Augšupielādē {summary.done} no {summary.total}</span>
            {summary.failed > 0 && <span className="text-[#B42318]">Neizdevās: {summary.failed}</span>}
            {summary.failed > 0 && (
              <button type="button" onClick={() => onRetry()} className="ml-auto inline-flex items-center gap-1 text-club"><RotateCcw className="h-4 w-4" /> Mēģināt vēlreiz visus</button>
            )}
          </div>
          <div className="mt-2 h-1.5 rounded bg-[#DCE3DF]"><div className="h-full rounded bg-teal-700" style={{ width: `${Math.round((summary.done / summary.total) * 100)}%` }} /></div>
          <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
            {pending.map((i) => (
              <li key={i.id} className="relative aspect-square overflow-hidden rounded bg-[#EEF2EF]" title={i.error ?? i.name}>
                {previewOf(i.id) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewOf(i.id)} alt="" className={`h-full w-full object-cover ${i.status === 'failed' ? 'opacity-40' : 'opacity-70'}`} />
                )}
                {i.status === 'uploading' && <div className="absolute inset-x-0 bottom-0 h-1 bg-[#DCE3DF]"><div className="h-full bg-teal-700" style={{ width: `${i.progress}%` }} /></div>}
                {i.status === 'failed' && (
                  <button type="button" onClick={() => onRetry([i.id])} className="absolute inset-0 grid place-items-center text-xs font-bold text-[#B42318]">
                    Neizdevās — mēģināt vēlreiz
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
