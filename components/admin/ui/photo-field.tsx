'use client'

import { useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { uploadWithProgress } from '@/lib/upload-with-progress'

const aspects = { cover: 'aspect-[16/7]', portrait: 'aspect-[4/5] max-w-[280px]', square: 'aspect-square max-w-[160px]' }

export function PhotoField({ value, folder, aspect, onChange, label = 'Pievieno foto' }: {
  value: string | null
  folder: string
  aspect: keyof typeof aspects
  onChange: (url: string | null) => void
  label?: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)

  const upload = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(file.name)) {
      toast.error('Izvēlies attēlu')
      return
    }
    setProgress(0)
    try {
      const { url } = await uploadWithProgress(file, folder, setProgress)
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
      className={`relative w-full overflow-hidden rounded-lg ${aspects[aspect]} ${dragging ? 'ring-2 ring-teal-700' : ''}`}
    >
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="rounded-md bg-white/95 px-3 py-1.5 text-sm font-semibold">Mainīt</button>
            <button type="button" onClick={() => onChange(null)} className="rounded-md bg-white/95 px-3 py-1.5 text-sm font-semibold text-[#B42318]">Noņemt</button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex h-full w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-[#DCE3DF] bg-[#F7F9F8] p-3 text-center text-[#5B6863] hover:border-teal-700 hover:text-club"
        >
          <ImagePlus className="h-7 w-7" />
          <span className="font-semibold">{label}</span>
          <span className="text-xs">Pieskaries vai ievelc foto</span>
        </button>
      )}
      {progress !== null && (
        <div className="absolute inset-x-2 bottom-2 rounded bg-white/95 px-3 py-2 text-sm font-semibold">
          Augšupielādē… {progress}%
          <div className="mt-1.5 h-1.5 rounded bg-[#DCE3DF]"><div className="h-full rounded bg-teal-700" style={{ width: `${progress}%` }} /></div>
        </div>
      )}
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = '' }} />
    </div>
  )
}
