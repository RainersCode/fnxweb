import { createClient as createBrowserClient } from '@supabase/supabase-js'

// Create a client-side Supabase client
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  return createBrowserClient(supabaseUrl, supabaseKey)
}
