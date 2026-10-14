// Vercel rejects request bodies over 4.5 MB, and phone photos are often larger.
// Shrink big photos in the browser first; the server still resizes and converts to WebP.
const SHRINK_ABOVE_BYTES = 3.5 * 1024 * 1024
const MAX_SIDE = 2560

async function shrinkIfLarge(file: File): Promise<File> {
  const shrinkable = /^image\/(jpeg|png|webp)$/.test(file.type)
  if (!shrinkable || file.size <= SHRINK_ABOVE_BYTES || typeof createImageBitmap !== 'function') return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

// XHR instead of fetch so the progress bar shows real upload progress
export async function uploadWithProgress(
  original: File,
  folder: string,
  onProgress: (percent: number) => void
): Promise<{ url: string; path: string }> {
  const file = await shrinkIfLarge(original)
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/admin/upload')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 95))
    }
    xhr.onload = () => {
      let body: { url?: string; path?: string; error?: string } = {}
      try { body = JSON.parse(xhr.responseText) } catch { /* non-JSON error page */ }
      if (xhr.status >= 200 && xhr.status < 300 && body.url && body.path) {
        onProgress(100)
        resolve({ url: body.url, path: body.path })
      } else if (xhr.status === 413) {
        reject(new Error('Foto ir par lielu — izvēlies mazāku attēlu'))
      } else {
        reject(new Error(body.error || 'Neizdevās augšupielādēt foto'))
      }
    }
    xhr.onerror = () => reject(new Error('Nav savienojuma — foto netika augšupielādēts'))
    xhr.send(form)
  })
}
