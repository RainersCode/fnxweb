import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createAdminClient } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST() {
  // Only allow authorized admin users
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminClient = createAdminClient()

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'app/api/admin/update-schema/create-tables.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Execute the SQL statements
    const { error } = await adminClient.rpc('exec_sql', { sql_query: sql })

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Schema updated successfully' })
  } catch (error) {
    console.error('Error updating schema:', error)
    return NextResponse.json({ error: 'Failed to update schema', details: error }, { status: 500 })
  }
}
