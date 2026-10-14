import { describe, it, expect } from 'vitest'
import { isSafeUploadFolder, isHeicFile, safeUploadBaseName } from './upload-rules'

describe('isSafeUploadFolder', () => {
  it.each(['articles', 'players', 'articles/3f2b1c9e-1d2a-4b7c-9a1e-2f3a4b5c6d7e', 'galleries'])('allows %s', (f) => {
    expect(isSafeUploadFolder(f)).toBe(true)
  })
  it.each(['', '../secrets', 'articles/../x', '/abs', 'a/b/c', 'Articles', 'articles/', 'a b'])('rejects %s', (f) => {
    expect(isSafeUploadFolder(f)).toBe(false)
  })
})

describe('isHeicFile', () => {
  it('detects by type or extension', () => {
    expect(isHeicFile('IMG_1.HEIC', '')).toBe(true)
    expect(isHeicFile('photo', 'image/heif')).toBe(true)
    expect(isHeicFile('photo.jpg', 'image/jpeg')).toBe(false)
  })
})

describe('safeUploadBaseName', () => {
  it('removes path tricks and odd characters', () => {
    const name = safeUploadBaseName('a/../../../../otherbucket/x.jpg')
    expect(name).not.toMatch(/[/\.]/)
    expect(name).toMatch(/^[a-z0-9-]+$/)
  })
  it('keeps a readable name and drops the extension', () => {
    expect(safeUploadBaseName('IMG 001.HEIC')).toBe('img-001')
    expect(safeUploadBaseName('Spēle pret Ežiem.jpeg')).toBe('spele-pret-eziem')
  })
  it('falls back when nothing usable remains', () => {
    expect(safeUploadBaseName('...')).toBe('foto')
  })
})
