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
