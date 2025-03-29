import { createClient as createServerClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Create a server-only Supabase client
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return cookies().get(name)?.value
      },
    },
  })
}
