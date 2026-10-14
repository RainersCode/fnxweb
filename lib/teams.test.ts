import { describe, it, expect } from 'vitest'
import { normalizeTeamName, findTeamByName, fixtureLogos, teamLogoFromFixture, fixtureLogoToSave } from './teams'

describe('team names', () => {
  it('normalises spacing and case', () => {
    expect(normalizeTeamName('  RK  Eži ')).toBe('rk eži')
  })
  it('finds an existing team despite spacing or case differences', () => {
    const teams = [{ id: '1', name: 'RK Eži' }, { id: '2', name: 'Jūrmala' }]
    expect(findTeamByName(teams, 'rk eži ')?.id).toBe('1')
    expect(findTeamByName(teams, 'Livonija')).toBeUndefined()
    expect(findTeamByName(teams, null)).toBeUndefined()
  })
})

describe('fixture logos', () => {
  it('puts the opponent logo on the opponent side; our side stays null (club logo)', () => {
    expect(fixtureLogos('t.png', true)).toEqual({ home_logo_url: null, away_logo_url: 't.png' })
    expect(fixtureLogos('t.png', false)).toEqual({ home_logo_url: 't.png', away_logo_url: null })
  })
  it('reads the opponent logo back from a fixture', () => {
    expect(teamLogoFromFixture({ is_home_game: true, away_logo_url: 'a.png', home_logo_url: null })).toBe('a.png')
    expect(teamLogoFromFixture({ is_home_game: false, home_logo_url: 'h.png' })).toBe('h.png')
  })
})

describe('fixtureLogoToSave', () => {
  const old = { opponent: 'RK Eži', is_home_game: true, home_logo_url: null, away_logo_url: 'old.png' }
  it('keeps the match logo when the same team has no logo of its own', () => {
    expect(fixtureLogoToSave({ name: 'RK Eži ', logo_url: null }, old)).toBe('old.png')
  })
  it('uses the team logo when there is one', () => {
    expect(fixtureLogoToSave({ name: 'RK Eži', logo_url: 'team.png' }, old)).toBe('team.png')
  })
  it('does not carry the old logo over to a different team', () => {
    expect(fixtureLogoToSave({ name: 'Jūrmala', logo_url: null }, old)).toBeNull()
  })
  it('keeps the stored logo when no team is picked', () => {
    expect(fixtureLogoToSave(null, old)).toBe('old.png')
    expect(fixtureLogoToSave(null, undefined)).toBeNull()
  })
})
