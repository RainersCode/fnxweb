// The one address Google should index: www, https, no trailing slash
export const SITE_URL = 'https://www.fnx-rugby.lv'

export function pageUrl(path: string): string {
  const clean = ('/' + path).replace(/\/+/g, '/').replace(/\/$/, '')
  return SITE_URL + clean
}
