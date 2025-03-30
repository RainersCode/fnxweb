import { ImageResponse } from 'next/server'

export const runtime = 'edge'

export const alt = 'RK Fēnikss - Valmieras Regbija Klubs'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#006644',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Logo placeholder */}
        <div
          style={{
            width: 200,
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 160,
              height: 160,
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#006644',
              fontSize: 90,
              fontWeight: 'bold',
            }}
          >
            RK
          </div>
        </div>
        
        <div
          style={{
            fontSize: 70,
            fontWeight: 600,
            letterSpacing: -1,
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px 30px',
            borderRadius: 10,
          }}
        >
          RK "FĒNIKSS"
        </div>
        
        <div
          style={{
            fontSize: 36,
            opacity: 0.8,
            marginTop: 20,
          }}
        >
          VALMIERAS REGBIJA KLUBS
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 22,
            opacity: 0.6,
          }}
        >
          feniks-rugby.com • Dibināts 2005
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 