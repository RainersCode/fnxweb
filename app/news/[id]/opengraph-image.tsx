import { ImageResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export const alt = 'RK Fēnikss Article Image'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Fetch article data
  const { data: article } = await supabase
    .from('articles')
    .select('title, image_url, published_at')
    .eq('id', params.id)
    .single()
    
  // Use default if article not found
  const title = article?.title || 'RK Fēnikss Article'
  const date = article?.published_at 
    ? new Date(article.published_at).toLocaleDateString('lv-LV', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('lv-LV')
  
  // Background image with fallback
  const imageUrl = article?.image_url || '/placeholder.svg'
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: '#006644',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          color: 'white',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundColor: '#111',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,102,68,0.8) 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
            padding: 80,
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 80,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                background: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#006644',
                fontSize: 32,
                fontWeight: 'bold',
              }}
            >
              RK
            </div>
            
            <div
              style={{
                fontSize: 32,
                fontWeight: 600,
              }}
            >
              RK "FĒNIKSS"
            </div>
          </div>
        
          <div style={{ fontSize: 22, opacity: 0.8, marginBottom: 16 }}>
            {date}
          </div>
          
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.2,
              marginBottom: 40,
            }}
          >
            {title.length > 70 ? `${title.substring(0, 67)}...` : title}
          </div>
          
          <div
            style={{
              fontSize: 22,
              opacity: 0.7,
            }}
          >
            feniks-rugby.com • Jaunumi
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 