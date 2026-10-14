export function normalizeTeamName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('lv')
}

export function findTeamByName<T extends { name: string }>(teams: T[], name: string | null | undefined): T | undefined {
  if (!name) return undefined
  const wanted = normalizeTeamName(name)
  return teams.find((t) => normalizeTeamName(t.name) === wanted)
}

// Our side is null in the fixture: the public pages show the club logo for it
export function fixtureLogos(teamLogo: string | null, isHome: boolean) {
  return isHome ? { home_logo_url: null, away_logo_url: teamLogo } : { home_logo_url: teamLogo, away_logo_url: null }
}

export function teamLogoFromFixture(f: { is_home_game: boolean; home_logo_url?: string | null; away_logo_url?: string | null }): string | null {
  return (f.is_home_game ? f.away_logo_url : f.home_logo_url) ?? null
}

// The logo to store on a saved match. A remembered team without a logo must not wipe the match's own logo.
export function fixtureLogoToSave(
  team: { name: string; logo_url: string | null } | null,
  initial: { opponent: string; is_home_game: boolean; home_logo_url?: string | null; away_logo_url?: string | null } | undefined
): string | null {
  const stored = initial ? teamLogoFromFixture(initial) : null
  if (!team) return stored
  if (team.logo_url) return team.logo_url
  return initial && normalizeTeamName(team.name) === normalizeTeamName(initial.opponent) ? stored : null
}
