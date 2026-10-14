import { createAdminClient } from './supabase'
import { storagePathFromUrl } from './storage-paths'

// Best effort: a failed file removal is logged and never undoes the database change
export async function removeMediaFiles(urls: Array<string | null | undefined>): Promise<void> {
  const paths = Array.from(new Set(urls.map(storagePathFromUrl).filter((p): p is string => Boolean(p))))
  if (!paths.length) return
  const db = createAdminClient()
  for (let i = 0; i < paths.length; i += 100) {
    const { error } = await db.storage.from('media').remove(paths.slice(i, i + 100))
    if (error) console.error('Error removing media files:', error)
  }
}
