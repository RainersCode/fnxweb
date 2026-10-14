import { slugify } from './articles'

export const HEIC_MESSAGE = 'Šo foto formātu nevar apstrādāt — izvēlies JPG vai PNG'

// The uploaded file's own name goes into the storage path, so reduce it to [a-z0-9-]
// (no slashes or dots: a crafted name must not reach another folder or bucket)
export function safeUploadBaseName(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, '')
  if (!/[a-z0-9]/i.test(base)) return 'foto'
  return slugify(base).slice(0, 60).replace(/-+$/, '')
}

// One or two lowercase path segments, e.g. "players" or "articles/<uuid>"
export function isSafeUploadFolder(folder: string): boolean {
  return /^[a-z0-9-]+(\/[a-z0-9-]+)?$/.test(folder)
}

export function isHeicFile(name: string, type: string): boolean {
  return /image\/hei[cf]/i.test(type) || /\.(heic|heif)$/i.test(name)
}

// Fit inside 1920×1920: portrait photos are limited too, not only landscape ones
export const IMAGE_RESIZE = {
  width: 1920,
  height: 1920,
  fit: 'inside',
  withoutEnlargement: true,
  fastShrinkOnLoad: true,
} as const
