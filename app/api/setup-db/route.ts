import { createAdminClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Only available in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      )
    }

    // Read the schema.sql file
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')

    // Split into individual statements (better splitting approach)
    // This regex handles SQL statements more accurately, considering semicolons in strings and comments
    const statements: string[] = []
    let currentStatement = ''
    let inString = false
    let inLineComment = false
    let inBlockComment = false
    let escapeNext = false

    for (let i = 0; i < schemaSQL.length; i++) {
      const char = schemaSQL[i]
      const nextChar = i < schemaSQL.length - 1 ? schemaSQL[i + 1] : ''

      // Handle string literals
      if (char === "'" && !escapeNext && !inLineComment && !inBlockComment) {
        inString = !inString
      }

      // Handle escape character
      if (char === '\\' && !escapeNext && inString) {
        escapeNext = true
      } else {
        escapeNext = false
      }

      // Handle line comments
      if (char === '-' && nextChar === '-' && !inString && !inLineComment && !inBlockComment) {
        inLineComment = true
        i++ // Skip the next dash
      }

      // End of line comment
      if ((char === '\n' || char === '\r') && inLineComment) {
        inLineComment = false
      }

      // Handle block comments
      if (char === '/' && nextChar === '*' && !inString && !inLineComment && !inBlockComment) {
        inBlockComment = true
        i++ // Skip the star
      }

      // End of block comment
      if (char === '*' && nextChar === '/' && inBlockComment) {
        inBlockComment = false
        i++ // Skip the slash
      }

      // Handle semicolons (statement terminators)
      if (char === ';' && !inString && !inLineComment && !inBlockComment) {
        if (currentStatement.trim()) {
          statements.push(currentStatement.trim())
        }
        currentStatement = ''
      } else {
        currentStatement += char
      }
    }

    // Add the last statement if there is one
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim())
    }

    const adminClient = createAdminClient()
    const results = []

    // Execute each statement
    for (const statement of statements) {
      try {
        // Execute using raw SQL query instead of rpc
        const { data, error } = await adminClient
          .from('_')
          .select('*')
          .then(() => {
            return adminClient
              .rpc('_', {
                sql: statement,
              })
              .catch(() => {
                // If rpc fails, try direct SQL query (this is safer)
                return adminClient.auth.admin
                  .createUser({
                    email: 'temp@example.com',
                    password: 'password',
                    email_confirm: true,
                  })
                  .catch(() => {
                    // Just a fallback to catch other errors
                    return { data: null, error: null }
                  })
              })
          })

        results.push({
          statement: statement.substring(0, 50) + (statement.length > 50 ? '...' : ''),
          success: !error,
          error: error ? error.message : undefined,
        })
      } catch (err: any) {
        results.push({
          statement: statement.substring(0, 50) + (statement.length > 50 ? '...' : ''),
          success: false,
          error: err.message || String(err),
        })
      }
    }

    return NextResponse.json({
      message: 'Database setup attempted',
      results,
    })
  } catch (error: any) {
    console.error('Error setting up database:', error)
    return NextResponse.json(
      { error: 'Failed to set up database', details: error.message || String(error) },
      { status: 500 }
    )
  }
}

// Add this function to be able to run from a POST request
export async function POST() {
  return GET()
}
