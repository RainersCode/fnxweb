// Our photos are public URLs like <supabase>/storage/v1/object/public/media/<path>
export function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const prefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}/storage/v1/object/public/media/`
  if (!url.startsWith(prefix)) return null
  try {
    return decodeURIComponent(url.slice(prefix.length).split('?')[0])
  } catch {
    return null
  }
}

// Files an article still shows (in its text or as its cover) must not be deleted
export function unreferencedUrls(urls: string[], articles: Array<{ content: string | null; image_url: string | null }>): string[] {
  return urls.filter((url) => {
    const path = storagePathFromUrl(url)
    return !articles.some((a) =>
      a.image_url === url ||
      (a.content ?? '').includes(url) ||
      (path !== null && (a.content ?? '').includes(path))
    )
  })
}
