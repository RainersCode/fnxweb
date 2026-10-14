import { Node } from '@tiptap/react'
import { isAllowedEmbedSrc } from '@/lib/video-embed'

export const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      provider: { default: 'youtube' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video-embed]',
        getAttrs: (el) => {
          const element = el as HTMLElement
          const src = element.querySelector('iframe')?.getAttribute('src') ?? ''
          return isAllowedEmbedSrc(src) ? { src, provider: element.dataset.provider ?? 'youtube' } : false
        },
      },
    ]
  },

  renderHTML({ node }) {
    return [
      'div',
      { 'data-video-embed': '', 'data-provider': node.attrs.provider },
      ['iframe', {
        src: node.attrs.src,
        title: 'Video',
        frameborder: '0',
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: 'true',
      }],
    ]
  },
})
