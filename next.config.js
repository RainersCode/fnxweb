/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'dummyimage.com',
      'placekitten.com',
      'placeholder.pics',
      'placeholder.com',
      'placeholdit.imgix.net',
      'cloudflare-ipfs.com',
      'loremflickr.com',
      'picsum.photos',
      'img.clerk.com',
      'your-domain.com',
      'feniks-rugby.com',
      'res.cloudinary.com',
      'images.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  experimental: {
    // Suppress warnings about certain APIs not being available in the Edge Runtime
    serverComponentsExternalPackages: ['scheduler'],
  },
};

module.exports = nextConfig; 