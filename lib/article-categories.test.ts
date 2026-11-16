import { describe, it, expect } from 'vitest'
import {
  ARTICLE_CATEGORIES, categoryLabel, categoryFromParam, categoryHref, usedCategories,
} from './article-categories'

describe('article categories', () => {
  it('has the four club categories in display order', () => {
    expect(ARTICLE_CATEGORIES.map((c) => c.value)).toEqual(['speles', 'pasakumi', 'veseliba', 'klubs'])
  })

  it('labels a known category and ignores anything else', () => {
    expect(categoryLabel('speles')).toBe('Spēles')
    expect(categoryLabel('veseliba')).toBe('Veselība')
    expect(categoryLabel(null)).toBeNull()
    expect(categoryLabel('nav-tada')).toBeNull()
  })

  it('reads the ?kategorija= filter, falling back to all articles', () => {
    expect(categoryFromParam('klubs')).toBe('klubs')
    expect(categoryFromParam(['pasakumi', 'klubs'])).toBe('pasakumi')
    expect(categoryFromParam(undefined)).toBeNull()
    expect(categoryFromParam('KLUBS')).toBeNull()
    expect(categoryFromParam('<script>')).toBeNull()
  })

  it('links a category to the filtered news page', () => {
    expect(categoryHref('speles')).toBe('/news?kategorija=speles')
    expect(categoryHref(null)).toBe('/news')
  })

  it('lists only categories that have articles, in display order', () => {
    const articles = [{ category: 'klubs' }, { category: null }, { category: 'speles' }, { category: 'klubs' }]
    expect(usedCategories(articles).map((c) => c.value)).toEqual(['speles', 'klubs'])
  })
})
