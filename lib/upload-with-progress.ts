// XHR instead of fetch so the progress bar shows real upload progress
export function uploadWithProgress(
  file: File,
  folder: string,
  onProgress: (percent: number) => void
): Promise<{ url: string; path: string }> {
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
      } else {
        reject(new Error(body.error || 'Neizdevās augšupielādēt foto'))
      }
    }
    xhr.onerror = () => reject(new Error('Nav savienojuma — foto netika augšupielādēts'))
    xhr.send(form)
  })
}
