import { describe, it, expect, vi } from 'vitest'
import { uploadGalleryPhoto, type UploadMemo } from './gallery-upload'

describe('uploadGalleryPhoto', () => {
  it('does not upload the file again when only saving the row failed', async () => {
    const memo: UploadMemo = {}
    const uploadFile = vi.fn().mockResolvedValue('https://x/media/galleries/g/1.webp')
    const addRow = vi.fn().mockRejectedValueOnce(new Error('Nav savienojuma')).mockResolvedValueOnce(undefined)
    await expect(uploadGalleryPhoto(memo, { uploadFile, addRow })).rejects.toThrow('Nav savienojuma')
    await uploadGalleryPhoto(memo, { uploadFile, addRow })
    expect(uploadFile).toHaveBeenCalledTimes(1)
    expect(addRow).toHaveBeenNthCalledWith(2, 'https://x/media/galleries/g/1.webp')
  })
  it('uploads again when the file upload itself failed', async () => {
    const memo: UploadMemo = {}
    const uploadFile = vi.fn().mockRejectedValueOnce(new Error('timeout')).mockResolvedValueOnce('u2')
    const addRow = vi.fn().mockResolvedValue(undefined)
    await expect(uploadGalleryPhoto(memo, { uploadFile, addRow })).rejects.toThrow()
    await uploadGalleryPhoto(memo, { uploadFile, addRow })
    expect(uploadFile).toHaveBeenCalledTimes(2)
    expect(addRow).toHaveBeenCalledWith('u2')
  })
})
