import { NextResponse } from 'next/server'
import { getUpcomingWorldMatches } from '@/lib/world-rugby'

// Feeds the ticker above the menu on every page; ESPN is asked at most once an hour
export const revalidate = 3600

export async function GET() {
  const matches = await getUpcomingWorldMatches(8)
  return NextResponse.json(matches, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
