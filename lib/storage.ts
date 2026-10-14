import { createAdminClient } from './supabase'
import { storagePathFromUrl, unreferencedUrls } from './storage-paths'

// Best effort: a failed file removal is logged and never undoes the database change.
// Files an article still shows are kept.
export async function removeMediaFiles(urls: Array<string | null | undefined>): Promise<void> {
  const candidates = Array.from(new Set(urls.filter((u): u is string => Boolean(u) && storagePathFromUrl(u) !== null)))
  if (!candidates.length) return
  const db = createAdminClient()
  const { data: articles, error: articlesError } = await db.from('articles').select('content, image_url')
  if (articlesError) {
    console.error('Skipping media cleanup, could not check articles:', articlesError)
    return
  }
  const paths = unreferencedUrls(candidates, articles ?? []).map((u) => storagePathFromUrl(u) as string)
  for (let i = 0; i < paths.length; i += 100) {
    const { error } = await db.storage.from('media').remove(paths.slice(i, i + 100))
    if (error) console.error('Error removing media files:', error)
  }
}
