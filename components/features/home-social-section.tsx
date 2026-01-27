'use client'

import { Instagram, ExternalLink, Share2, Facebook } from 'lucide-react'
import Link from 'next/link'

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export function HomeSocialSection() {

  return (
    <section className="relative py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400" />
      <div className="absolute top-16 left-0 w-32 h-0.5 bg-teal-400/20 skew-x-[-12deg]" />
      <div className="absolute top-20 left-0 w-20 h-0.5 bg-teal-400/10 skew-x-[-12deg]" />
      <div className="absolute bottom-32 right-0 w-40 h-0.5 bg-teal-400/20 skew-x-[-12deg]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-teal-400 skew-x-[-12deg]" />
            <Share2 className="h-5 w-5 text-teal-300" />
            <div className="w-10 h-0.5 bg-teal-400 skew-x-[-12deg]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <span className="text-white">SOCIĀLIE </span>
            <span className="text-teal-300 italic font-light">TĪKLI</span>
          </h2>
          <p className="mt-4 text-teal-100 max-w-md mx-auto">
            Seko mūsu jaunākajām ziņām un notikumiem sociālajos tīklos!
          </p>
          <div className="mx-auto mt-4 h-1 w-20 bg-teal-400 skew-x-[-12deg]" />
        </div>

        {/* Social Feeds Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Instagram Feed */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Instagram className="h-6 w-6 text-[#E4405F]" />
              </div>
              <div>
                <h3 className="text-white font-bold">Instagram</h3>
                <p className="text-white/80 text-sm">@rk_fenikss</p>
              </div>
              <Link
                href="https://www.instagram.com/rk_fenikss/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-white/80 hover:text-white transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>

            {/* Instagram Embed */}
            <div className="p-4 bg-white min-h-[400px]">
              <iframe
                src="https://www.instagram.com/rk_fenikss/embed"
                className="w-full h-[450px] border-0"
                scrolling="no"
                allowTransparency={true}
                allow="encrypted-media"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white/5">
              <Link
                href="https://www.instagram.com/rk_fenikss/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-medium hover:text-teal-300 transition-colors"
              >
                <span>Skatīt Instagram profilu</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* TikTok Feed */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
            {/* Header */}
            <div className="bg-black px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <TikTokIcon className="h-6 w-6 text-black" />
              </div>
              <div>
                <h3 className="text-white font-bold">TikTok</h3>
                <p className="text-white/80 text-sm">@rk_fenikss</p>
              </div>
              <Link
                href="https://www.tiktok.com/@rk_fenikss"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-white/80 hover:text-white transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>

            {/* TikTok Embed */}
            <div className="p-4 bg-white min-h-[400px]">
              <iframe
                src="https://www.tiktok.com/embed/@rk_fenikss"
                className="w-full h-[450px] border-0"
                scrolling="no"
                allow="encrypted-media"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white/5">
              <Link
                href="https://www.tiktok.com/@rk_fenikss"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-medium hover:text-teal-300 transition-colors"
              >
                <span>Skatīt TikTok profilu</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-10">
          <Link
            href="https://www.facebook.com/RKFenikss"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/10 hover:bg-[#1877F2] rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <Facebook className="h-6 w-6" />
          </Link>
          <Link
            href="https://www.instagram.com/rk_fenikss/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/10 hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <Instagram className="h-6 w-6" />
          </Link>
          <Link
            href="https://www.tiktok.com/@rk_fenikss"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 bg-white/10 hover:bg-black rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          >
            <TikTokIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </section>
  )
}
