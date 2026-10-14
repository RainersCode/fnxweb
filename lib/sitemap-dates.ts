// The newest real date, or undefined so the sitemap leaves lastmod out instead of claiming "changed now"
export function latestDate(...values: Array<string | Date | null | undefined>): Date | undefined {
  const times = values
    .filter((v): v is string | Date => Boolean(v))
    .map((v) => new Date(v).getTime())
    .filter((t) => !Number.isNaN(t))
  return times.length ? new Date(Math.max(...times)) : undefined
}
