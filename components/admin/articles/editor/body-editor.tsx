'use client'

import { useCallback, useRef } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { toast } from 'sonner'
import { uploadWithProgress } from '@/lib/upload-with-progress'
import { Figure } from './figure-node'
import { VideoEmbed } from './video-node'
import { EditorToolbar } from './editor-toolbar'
import { clearUploadProgress, setUploadProgress } from './upload-store'

type FoundFigure = { pos: number; size: number; attrs: Record<string, unknown> }

function findFigure(editor: Editor, uploadId: string): FoundFigure | null {
  let found: FoundFigure | null = null
  editor.state.doc.descendants((node, pos) => {
    if (found) return false
    if (node.type.name === 'figure' && node.attrs.uploadId === uploadId) {
      found = { pos, size: node.nodeSize, attrs: node.attrs }
      return false
    }
  })
  return found
}

export function BodyEditor({ articleId, content, onChange }: { articleId: string; content: string; onChange: (html: string) => void }) {
  const insertImagesRef = useRef<(files: File[], pos?: number) => void>(() => {})

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        includeChildren: true,
        placeholder: ({ node }) => (node.type.name === 'figure' ? 'Paraksts (nav obligāts)' : 'Raksti šeit…'),
      }),
      Figure,
      VideoEmbed,
    ],
    content,
    editorProps: {
      attributes: { class: 'prose prose-lg max-w-none min-h-[40vh] focus:outline-none prose-headings:font-display prose-headings:uppercase' },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'))
        if (!files.length) return false
        insertImagesRef.current(files)
        return true
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) => f.type.startsWith('image/'))
        if (!files.length) return false
        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
        insertImagesRef.current(files, pos)
        return true
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const insertImages = useCallback(
    async (files: File[], pos?: number) => {
      if (!editor) return
      for (const file of files.filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))) {
        const uploadId = crypto.randomUUID()
        const preview = URL.createObjectURL(file)
        const figure = { type: 'figure', attrs: { src: preview, alt: '', uploadId } }
        const chain = editor.chain().focus()
        if (pos !== undefined) chain.insertContentAt(pos, figure)
        else chain.insertContent(figure)
        chain.run()
        setUploadProgress(uploadId, 0)
        try {
          const { url } = await uploadWithProgress(file, `articles/${articleId}`, (p) => setUploadProgress(uploadId, p))
          const found = findFigure(editor, uploadId)
          if (found) editor.view.dispatch(editor.state.tr.setNodeMarkup(found.pos, undefined, { ...found.attrs, src: url, uploadId: null }))
        } catch (error) {
          const found = findFigure(editor, uploadId)
          if (found) editor.view.dispatch(editor.state.tr.delete(found.pos, found.pos + found.size))
          toast.error(error instanceof Error ? error.message : 'Neizdevās augšupielādēt foto')
        } finally {
          clearUploadProgress(uploadId)
          URL.revokeObjectURL(preview)
        }
      }
    },
    [editor, articleId]
  )
  insertImagesRef.current = insertImages

  if (!editor) return <div className="min-h-[40vh]" />

  return (
    <div className="grid gap-3">
      <EditorToolbar editor={editor} onPickImages={(files) => insertImages(files)} />
      <EditorContent editor={editor} />
    </div>
  )
}
