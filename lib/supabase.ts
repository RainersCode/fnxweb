import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
})

// Function to get the full URL for an image stored in Supabase storage
export const getImageUrl = (bucket: string, path: string | null): string => {
  if (!path) {
    return '/placeholder.svg'
  }
  
  // If path is already a full URL, return it directly
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // For local development with relative paths
  if (path.startsWith('/')) {
    return path
  }
  
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

// Helper function to prepare image paths for Next.js Image component
export const prepareImagePath = (path: string | null): string => {
  if (!path) return '/placeholder.svg'
  
  // If it's already a URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // If it's a relative path
  if (path.startsWith('/')) {
    return path
  }
  
  // Otherwise, assume it's a Supabase storage path
  return getImageUrl('images', path)
}

// Create admin client with service role key (only use on the server)
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  return createClient(supabaseUrl, supabaseServiceKey)
}
