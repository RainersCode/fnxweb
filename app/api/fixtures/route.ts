import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') // 'upcoming' or 'past'
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

  try {
    let query = supabase.from('fixtures').select('id, opponent, match_date, location, score, is_home_game, result, description, home_logo_url, away_logo_url')

    // If type is specified, filter accordingly
    if (type === 'upcoming') {
      // Get fixtures where match date is today or in the future
      const today = new Date().toISOString().split('T')[0] // Get only the date part YYYY-MM-DD
      query = query.gte('match_date', today).order('match_date', { ascending: true })
    } else if (type === 'past') {
      // Get fixtures where match date is in the past
      const today = new Date().toISOString().split('T')[0] // Get only the date part YYYY-MM-DD
      query = query.lt('match_date', today).order('match_date', { ascending: false })
    } else {
      // If no type specified, order by match date (future first, then past)
      query = query.order('match_date', { ascending: true })
    }

    // Apply limit if provided
    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 })
  }
}
