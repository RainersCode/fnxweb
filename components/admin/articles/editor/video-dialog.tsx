'use client'

import { useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { parseVideoUrl } from '@/lib/video-embed'

export function VideoDialog({ editor, open, onOpenChange }: { editor: Editor; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const insert = () => {
    const video = parseVideoUrl(url)
    if (!video) {
      setError('Šī saite netiek atbalstīta. Ielīmē YouTube vai Facebook video saiti.')
      return
    }
    editor.chain().focus().insertContent({ type: 'videoEmbed', attrs: video }).run()
    setUrl('')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setError(null); onOpenChange(next) }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Pievienot video</DialogTitle></DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); insert() }} className="grid gap-3">
          <label htmlFor="video-url" className="text-sm font-semibold">Ielīmē YouTube vai Facebook saiti</label>
          <input id="video-url" type="url" inputMode="url" autoFocus value={url} onChange={(e) => { setUrl(e.target.value); setError(null) }} placeholder="https://youtu.be/…" className="rounded-md border border-[#DCE3DF] px-3 py-2" />
          {error && <p className="text-sm text-[#B42318]">{error}</p>}
          <button type="submit" className="justify-self-end rounded-md bg-teal-700 px-4 py-2 font-semibold text-white">Pievienot</button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
