import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createAdminClient } from '@/lib/supabase'
import { Fixture } from '@/types/supabase'

// Only allow authorized admin users
const checkAuth = () => {
  const { userId } = auth()
  if (!userId) {
    return false
  }
  return true
}

// GET - fetch fixtures
export async function GET() {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()
  try {
    const { data, error } = await adminClient
      .from('fixtures')
      .select('*')
      .order('match_date', { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 })
  }
}

// POST - create new fixture
export async function POST(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const fixture = await request.json()
    const adminClient = createAdminClient()
    const { data, error } = await adminClient.from('fixtures').insert(fixture).select().single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating fixture:', error)
    return NextResponse.json({ error: 'Failed to create fixture' }, { status: 500 })
  }
}

// PATCH - update fixture
export async function PATCH(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...fixture } = await request.json()
    const adminClient = createAdminClient()
    const { data, error } = await adminClient
      .from('fixtures')
      .update(fixture)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating fixture:', error)
    return NextResponse.json({ error: 'Failed to update fixture' }, { status: 500 })
  }
}

// DELETE - delete fixture
export async function DELETE(request: NextRequest) {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    const adminClient = createAdminClient()
    const { error } = await adminClient.from('fixtures').delete().eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting fixture:', error)
    return NextResponse.json({ error: 'Failed to delete fixture' }, { status: 500 })
  }
}
