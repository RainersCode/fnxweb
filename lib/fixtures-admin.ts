export function splitFixtures<T extends { match_date: string }>(fixtures: T[], now: Date = new Date()) {
  const upcoming = fixtures.filter((f) => new Date(f.match_date) >= now).sort((a, b) => a.match_date.localeCompare(b.match_date))
  const played = fixtures.filter((f) => new Date(f.match_date) < now).sort((a, b) => b.match_date.localeCompare(a.match_date))
  return { upcoming, played }
}
