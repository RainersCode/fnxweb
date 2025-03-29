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
    const sqlPath = path.join(process.cwd(), 'app/api/admin/update-schema/create-exec-sql.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Execute the SQL statements directly
    const { error } = await adminClient.rpc('exec_sql', { sql_query: sql })
    if (error) {
      // If the function doesn't exist yet, we need to create it directly
      if (error.message.includes('function exec_sql') && error.message.includes('does not exist')) {
        const { error: sqlError } = await adminClient.sql(sql)
        if (sqlError) throw sqlError
      } else {
        throw error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'exec_sql function created/updated successfully',
    })
  } catch (error) {
    console.error('Error setting up exec_sql function:', error)
    return NextResponse.json(
      { error: 'Failed to set up exec_sql function', details: error },
      { status: 500 }
    )
  }
}
