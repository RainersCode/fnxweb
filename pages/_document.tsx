import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="lv">
      <Head>
        {/* Facebook OpenGraph tags to ensure image display */}
        <meta property="fb:app_id" content="1234567890" />
        <meta property="og:image" content="https://www.fnx-rugby.lv/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="RK Fēnikss - Valmieras Regbija Klubs" />
        
        {/* More detailed image type */}
        <meta property="og:image:type" content="image/jpeg" />
        
        {/* Force Facebook to recrawl when sharing */}
        <meta property="og:ttl" content="600" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 