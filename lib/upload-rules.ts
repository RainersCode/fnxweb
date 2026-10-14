export const HEIC_MESSAGE = 'Šo foto formātu nevar apstrādāt — izvēlies JPG vai PNG'

// One or two lowercase path segments, e.g. "players" or "articles/<uuid>"
export function isSafeUploadFolder(folder: string): boolean {
  return /^[a-z0-9-]+(\/[a-z0-9-]+)?$/.test(folder)
}

export function isHeicFile(name: string, type: string): boolean {
  return /image\/hei[cf]/i.test(type) || /\.(heic|heif)$/i.test(name)
}
