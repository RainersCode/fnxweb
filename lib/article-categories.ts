// One category per article; the values are what the database stores and the ?kategorija= filter uses
export const ARTICLE_CATEGORIES = [
  { value: 'speles', label: 'Spēles' },
  { value: 'pasakumi', label: 'Pasākumi' },
  { value: 'veseliba', label: 'Veselība' },
  { value: 'klubs', label: 'Klubs' },
] as const

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]['value']

export const CATEGORY_VALUES = ARTICLE_CATEGORIES.map((c) => c.value) as [ArticleCategory, ...ArticleCategory[]]

function isCategory(value: unknown): value is ArticleCategory {
  return typeof value === 'string' && (CATEGORY_VALUES as string[]).includes(value)
}

export function categoryLabel(value: string | null | undefined): string | null {
  return ARTICLE_CATEGORIES.find((c) => c.value === value)?.label ?? null
}

export function categoryFromParam(param: string | string[] | undefined): ArticleCategory | null {
  const value = Array.isArray(param) ? param[0] : param
  return isCategory(value) ? value : null
}

export function categoryHref(value: ArticleCategory | null): string {
  return value ? `/news?kategorija=${value}` : '/news'
}

// Filter buttons only for categories that have something to show
export function usedCategories(articles: { category?: string | null }[]) {
  const used = new Set(articles.map((a) => a.category))
  return ARTICLE_CATEGORIES.filter((c) => used.has(c.value))
}
