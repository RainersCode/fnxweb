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

// GET - fetch players
export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()
  try {
    const { data, error } = await adminClient.from('team_players').select('*').order('name')

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}

// POST - create new player
export async function POST(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const player = await request.json()
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.from('team_players').insert(player).select().single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 })
  }
}

// PATCH - update player
export async function PATCH(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...player } = await request.json()
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('team_players')
      .update(player)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json({ error: 'Failed to update player' }, { status: 500 })
  }
}

// DELETE - delete player
export async function DELETE(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    const adminClient = createAdminClient()
    const { error } = await adminClient.from('team_players').delete().eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 })
  }
}
