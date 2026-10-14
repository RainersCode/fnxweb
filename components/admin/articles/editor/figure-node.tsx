'use client'

import { Node, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react'
import { useUploadProgress } from './upload-store'

function FigureView({ node }: NodeViewProps) {
  const uploadId = node.attrs.uploadId as string | null
  const percent = useUploadProgress(uploadId)
  return (
    <NodeViewWrapper as="figure" className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={node.attrs.src} alt={node.attrs.alt ?? ''} className={uploadId ? 'opacity-60' : ''} draggable={false} contentEditable={false} />
      {uploadId && (
        <div contentEditable={false} className="absolute inset-x-3 bottom-12 rounded bg-white/95 px-3 py-2 text-sm font-semibold">
          Augšupielādē… {percent}%
          <div className="mt-1.5 h-1.5 rounded bg-[#DCE3DF]"><div className="h-full rounded bg-teal-700" style={{ width: `${percent}%` }} /></div>
        </div>
      )}
      <NodeViewContent as="figcaption" />
    </NodeViewWrapper>
  )
}

// Photo with an optional caption: <figure><img><figcaption>…</figcaption></figure>
export const Figure = Node.create({
  name: 'figure',
  group: 'block',
  content: 'inline*',
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      uploadId: { default: null, rendered: false },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentElement: 'figcaption',
        getAttrs: (el) => {
          const img = (el as HTMLElement).querySelector('img')
          return img ? { src: img.getAttribute('src'), alt: img.getAttribute('alt') ?? '' } : false
        },
      },
      {
        tag: 'img[src]',
        getAttrs: (el) => ({ src: (el as HTMLElement).getAttribute('src'), alt: (el as HTMLElement).getAttribute('alt') ?? '' }),
      },
    ]
  },

  renderHTML({ node }) {
    return ['figure', {}, ['img', { src: node.attrs.src, alt: node.attrs.alt }], ['figcaption', 0]]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureView)
  },
})
