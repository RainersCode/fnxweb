import { describe, it, expect } from 'vitest'
import { isActiveNav, isEditorPath, isPreviewPath } from './admin-nav'

describe('admin navigation', () => {
  it('matches the dashboard only exactly', () => {
    expect(isActiveNav('/admin', '/admin')).toBe(true)
    expect(isActiveNav('/admin/articles', '/admin')).toBe(false)
  })
  it('matches sections by prefix', () => {
    expect(isActiveNav('/admin/articles/abc', '/admin/articles')).toBe(true)
    expect(isActiveNav('/admin/gallery', '/admin/articles')).toBe(false)
  })
  it('detects editor and preview paths', () => {
    expect(isEditorPath('/admin/articles/3f2b')).toBe(true)
    expect(isEditorPath('/admin/articles')).toBe(false)
    expect(isEditorPath('/admin/articles/3f2b/preview')).toBe(false)
    expect(isPreviewPath('/admin/articles/3f2b/preview')).toBe(true)
  })
  it('treats every section form as an editor page', () => {
    expect(isEditorPath('/admin/players/new')).toBe(true)
    expect(isEditorPath('/admin/gallery/3f2b')).toBe(true)
    expect(isEditorPath('/admin/fixtures')).toBe(false)
  })
})
