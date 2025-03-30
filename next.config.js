/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['dummyimage.com'],
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