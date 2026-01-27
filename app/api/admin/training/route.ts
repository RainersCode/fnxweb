import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createAdminClient } from '@/lib/supabase'

// Only allow authorized admin users
const checkAuth = () => {
  const { userId } = auth()
  if (!userId) {
    return false
  }
  return true
}

// GET - fetch training sessions
export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()
  try {
    const { data, error } = await adminClient
      .from('training_sessions')
      .select('*')
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching training sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch training sessions' }, { status: 500 })
  }
}

// POST - create new training session
export async function POST(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const session = await request.json()
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('training_sessions')
      .insert(session)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating training session:', error)
    return NextResponse.json({ error: 'Failed to create training session' }, { status: 500 })
  }
}

// PATCH - update training session
export async function PATCH(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...session } = await request.json()
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('training_sessions')
      .update(session)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating training session:', error)
    return NextResponse.json({ error: 'Failed to update training session' }, { status: 500 })
  }
}

// DELETE - delete training session
export async function DELETE(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from('training_sessions')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting training session:', error)
    return NextResponse.json({ error: 'Failed to delete training session' }, { status: 500 })
  }
}
