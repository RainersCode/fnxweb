import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createAdminClient } from '@/lib/supabase'

// POST - record a page view (public, no auth needed)
export async function POST(request: NextRequest) {
  try {
    const { page_path } = await request.json()
    if (!page_path || typeof page_path !== 'string') {
      return NextResponse.json({ error: 'Invalid page_path' }, { status: 400 })
    }

    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('page_views')
      .insert({ page_path })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording page view:', error)
    return NextResponse.json({ error: 'Failed to record page view' }, { status: 500 })
  }
}

// GET - fetch page view stats (admin only)
export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const period = request.nextUrl.searchParams.get('period') || 'week'
  const adminClient = createAdminClient()

  try {
    const now = new Date()

    // Calculate date boundaries
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)

    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - 6)
    weekStart.setHours(0, 0, 0, 0)

    const monthStart = new Date(now)
    monthStart.setDate(monthStart.getDate() - 29)
    monthStart.setHours(0, 0, 0, 0)

    const yearStart = new Date(now)
    yearStart.setMonth(yearStart.getMonth() - 11)
    yearStart.setDate(1)
    yearStart.setHours(0, 0, 0, 0)

    // Get total views
    const { count: totalViews, error: totalError } = await adminClient
      .from('page_views')
      .select('*', { count: 'exact', head: true })
    if (totalError) throw totalError

    // Get today's views
    const { count: todayViews, error: todayError } = await adminClient
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', todayStart.toISOString())
    if (todayError) throw todayError

    // Get this week's views
    const { count: weekViews, error: weekError } = await adminClient
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', weekStart.toISOString())
    if (weekError) throw weekError

    // Get this month's views
    const { count: monthViews, error: monthError } = await adminClient
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', monthStart.toISOString())
    if (monthError) throw monthError

    // Get chart data based on period
    let chartStart: Date
    if (period === 'year') {
      chartStart = yearStart
    } else if (period === 'month') {
      chartStart = monthStart
    } else {
      chartStart = weekStart
    }

    const { data: viewRows, error: chartError } = await adminClient
      .from('page_views')
      .select('viewed_at')
      .gte('viewed_at', chartStart.toISOString())
      .order('viewed_at', { ascending: true })
    if (chartError) throw chartError

    // Build chart data
    let chartData: { date: string; views: number }[]

    if (period === 'year') {
      // Group by month for last 12 months
      const monthCounts = new Map<string, number>()
      for (let i = 0; i < 12; i++) {
        const d = new Date(now)
        d.setMonth(d.getMonth() - (11 - i))
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        monthCounts.set(key, 0)
      }
      for (const row of viewRows || []) {
        const d = new Date(row.viewed_at)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (monthCounts.has(key)) {
          monthCounts.set(key, (monthCounts.get(key) || 0) + 1)
        }
      }
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jūn', 'Jūl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
      chartData = Array.from(monthCounts.entries()).map(([key, views]) => {
        const monthIdx = parseInt(key.split('-')[1]) - 1
        return { date: monthNames[monthIdx], views }
      })
    } else {
      // Group by day
      const days = period === 'month' ? 30 : 7
      const dayCounts = new Map<string, number>()
      for (let i = 0; i < days; i++) {
        const d = new Date(now)
        d.setDate(d.getDate() - (days - 1 - i))
        const key = d.toISOString().split('T')[0]
        dayCounts.set(key, 0)
      }
      for (const row of viewRows || []) {
        const key = new Date(row.viewed_at).toISOString().split('T')[0]
        if (dayCounts.has(key)) {
          dayCounts.set(key, (dayCounts.get(key) || 0) + 1)
        }
      }
      chartData = Array.from(dayCounts.entries()).map(([key, views]) => {
        const d = new Date(key)
        const label = `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
        return { date: label, views }
      })
    }

    return NextResponse.json({
      totalViews: totalViews ?? 0,
      todayViews: todayViews ?? 0,
      weekViews: weekViews ?? 0,
      monthViews: monthViews ?? 0,
      chartData,
    })
  } catch (error) {
    console.error('Error fetching page view stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
