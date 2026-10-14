import sanitizeHtml from 'sanitize-html'
import { isAllowedEmbedSrc } from './video-embed'

function mediaPrefix(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}/storage/v1/object/public/media/`
}

function isAllowedImageSrc(src: string): boolean {
  return src.startsWith('https://') && src.startsWith(mediaPrefix())
}

function isExternal(href: string): boolean {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fnx-rugby.lv'
  return /^https?:\/\//i.test(href) && !href.startsWith(site)
}

// Shared by the save path (API) and the public render path
export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
      'ul', 'ol', 'li', 'blockquote', 'a', 'hr', 'img', 'figure', 'figcaption', 'div', 'iframe',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt'],
      div: ['data-video-embed', 'data-provider'],
      iframe: ['src', 'title', 'allow', 'allowfullscreen', 'frameborder'],
      '*': ['style'],
    },
    allowedStyles: { '*': { 'text-align': [/^(left|right|center|justify)$/] } },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['https'], iframe: ['https'] },
    selfClosing: ['img', 'br', 'hr'],
    exclusiveFilter: (frame) =>
      (frame.tag === 'iframe' && !isAllowedEmbedSrc(frame.attribs.src ?? '')) ||
      (frame.tag === 'img' && !isAllowedImageSrc(frame.attribs.src ?? '')),
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? ''
        if (!isExternal(href)) {
          const { target: _target, rel: _rel, ...rest } = attribs
          return { tagName, attribs: rest }
        }
        return { tagName, attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' } }
      },
    },
  })
}
