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
  console.log('Preparing image path:', path)
  
  if (!path) {
    console.log('No path provided, using placeholder')
    return '/placeholder.svg'
  }
  
  // Trim the path to remove any whitespace
  path = path.trim()
  
  // If it's already a URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    console.log('Path is already a URL, using as-is')
    return path
  }
  
  // If it's a relative path
  if (path.startsWith('/')) {
    console.log('Path is relative, using as-is')
    return path
  }
  
  // Check if path is in a storage bucket format but missing URL
  if (path.includes('/') && !path.startsWith('http')) {
    console.log('Converting storage path to full URL')
    return getImageUrl('media', path)
  }
  
  // Otherwise, assume it's a Supabase storage path
  console.log('Assuming Supabase storage path')
  return getImageUrl('media', path)
}

// Create admin client with service role key (only use on the server)
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  return createClient(supabaseUrl, supabaseServiceKey)
}
