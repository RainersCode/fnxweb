'use client'

import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, ImagePlus, Video } from 'lucide-react'
import { LinkPopover } from './link-popover'
import { VideoDialog } from './video-dialog'
import { useIsDesktop, useKeyboardOffset } from './use-keyboard-offset'

const base = 'grid h-9 min-w-9 place-items-center rounded-md px-2 text-[#141414] hover:bg-club-pale'
const active = 'bg-club-pale text-club'

export function EditorToolbar({ editor, onPickImages }: { editor: Editor; onPickImages: (files: File[]) => void }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [videoOpen, setVideoOpen] = useState(false)
  const keyboard = useKeyboardOffset()
  const desktop = useIsDesktop()

  const btn = (label: string, isActive: boolean, onClick: () => void, icon: React.ReactNode) => (
    <button type="button" aria-label={label} aria-pressed={isActive} onClick={onClick} className={`${base} ${isActive ? active : ''}`}>
      {icon}
    </button>
  )

  return (
    <div
      className="z-40 flex gap-1 overflow-x-auto border-[#DCE3DF] bg-white p-1.5 max-lg:fixed max-lg:inset-x-0 max-lg:border-t lg:sticky lg:top-[57px] lg:rounded-lg lg:border"
      style={desktop ? undefined : { bottom: keyboard }}
    >
      {btn('Virsraksts', editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-4 w-4" />)}
      {btn('Apakšvirsraksts', editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="h-4 w-4" />)}
      {btn('Treknraksts', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold className="h-4 w-4" />)}
      {btn('Slīpraksts', editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-4 w-4" />)}
      {btn('Saraksts', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List className="h-4 w-4" />)}
      {btn('Numurēts saraksts', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-4 w-4" />)}
      {btn('Citāts', editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="h-4 w-4" />)}
      <LinkPopover editor={editor} buttonClass={`${base} ${editor.isActive('link') ? active : ''}`} />
      <span className="mx-1 w-px shrink-0 bg-[#DCE3DF]" />
      <button type="button" onClick={() => fileInput.current?.click()} className={`${base} gap-1.5 font-semibold text-club`}>
        <ImagePlus className="h-4 w-4" /> Foto
      </button>
      <button type="button" onClick={() => setVideoOpen(true)} className={`${base} gap-1.5 font-semibold text-club`}>
        <Video className="h-4 w-4" /> Video
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { onPickImages(Array.from(e.target.files ?? [])); e.target.value = '' }}
      />
      <VideoDialog editor={editor} open={videoOpen} onOpenChange={setVideoOpen} />
    </div>
  )
}
