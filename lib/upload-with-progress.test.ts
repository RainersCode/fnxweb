import { describe, it, expect, afterEach, vi } from 'vitest'
import { uploadWithProgress, UPLOAD_TIMEOUT_MS } from './upload-with-progress'

class StalledXHR {
  static last: StalledXHR
  timeout = 0
  upload = { onprogress: null as unknown }
  ontimeout: (() => void) | null = null
  onabort: (() => void) | null = null
  onerror: (() => void) | null = null
  onload: (() => void) | null = null
  constructor() { StalledXHR.last = this }
  open() {}
  send() {}
}

afterEach(() => vi.unstubAllGlobals())

describe('uploadWithProgress', () => {
  it('gives up on a stalled upload with a Latvian message instead of hanging', async () => {
    vi.stubGlobal('XMLHttpRequest', StalledXHR)
    const pending = uploadWithProgress(new File(['x'], 'a.gif', { type: 'image/gif' }), 'galleries/g', () => {})
    await vi.waitFor(() => expect(StalledXHR.last).toBeDefined())
    expect(StalledXHR.last.timeout).toBe(UPLOAD_TIMEOUT_MS)
    StalledXHR.last.ontimeout?.()
    await expect(pending).rejects.toThrow(/Augšupielāde ilga pārāk ilgi/)
  })
  it('rejects when the upload is aborted', async () => {
    vi.stubGlobal('XMLHttpRequest', StalledXHR)
    const pending = uploadWithProgress(new File(['x'], 'a.gif', { type: 'image/gif' }), 'galleries/g', () => {})
    await vi.waitFor(() => expect(StalledXHR.last.onabort).toBeTypeOf('function'))
    StalledXHR.last.onabort?.()
    await expect(pending).rejects.toThrow()
  })
})
