'use client'

import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { uploadWithProgress } from '@/lib/upload-with-progress'

export function CoverPhotoField({ articleId, value, onChange }: { articleId: string; value: string | null; onChange: (url: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const upload = async (file: File | undefined) => {
    if (!file) return
    setProgress(0)
    try {
      const { url } = await uploadWithProgress(file, `articles/${articleId}`, setProgress)
      onChange(url)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neizdevās augšupielādēt foto')
    } finally {
      setProgress(null)
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files[0]) }}
      className={`relative overflow-hidden rounded-lg ${dragging ? 'ring-2 ring-teal-700' : ''}`}
    >
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Vāka foto" className="aspect-[16/7] w-full object-cover" />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="rounded-md bg-white/95 px-3 py-1.5 text-sm font-semibold">Mainīt</button>
            <button type="button" onClick={() => onChange(null)} className="rounded-md bg-white/95 px-3 py-1.5 text-sm font-semibold text-[#B42318]">Noņemt</button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex aspect-[16/7] w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-[#DCE3DF] bg-[#F7F9F8] text-[#5B6863] hover:border-teal-700 hover:text-club"
        >
          <ImagePlus className="h-8 w-8" />
          <span className="font-semibold">Pievieno vāka foto</span>
          <span className="text-sm">Pieskaries vai ievelc foto šeit</span>
        </button>
      )}
      {progress !== null && (
        <div className="absolute inset-x-3 bottom-3 rounded bg-white/95 px-3 py-2 text-sm font-semibold">
          Augšupielādē… {progress}%
          <div className="mt-1.5 h-1.5 rounded bg-[#DCE3DF]"><div className="h-full rounded bg-teal-700" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = '' }} />
    </div>
  )
}
