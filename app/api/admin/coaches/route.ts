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

// GET - fetch coaches
export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()
  try {
    const { data, error } = await adminClient.from('coaches').select('*').order('name')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching coaches:', error)
    return NextResponse.json({ error: 'Failed to fetch coaches' }, { status: 500 })
  }
}

// POST - create new coach
export async function POST(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const coach = await request.json()
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.from('coaches').insert(coach).select().single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating coach:', error)
    return NextResponse.json({ error: 'Failed to create coach' }, { status: 500 })
  }
}

// PATCH - update coach
export async function PATCH(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...coach } = await request.json()
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('coaches')
      .update(coach)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating coach:', error)
    return NextResponse.json({ error: 'Failed to update coach' }, { status: 500 })
  }
}

// DELETE - delete coach
export async function DELETE(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    const adminClient = createAdminClient()
    const { error } = await adminClient.from('coaches').delete().eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting coach:', error)
    return NextResponse.json({ error: 'Failed to delete coach' }, { status: 500 })
  }
}
