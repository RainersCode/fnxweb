import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - fetch active training sessions (public)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching training sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch training sessions' }, { status: 500 })
  }
}
