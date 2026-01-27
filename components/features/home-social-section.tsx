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
        <div className="grid md:grid-cols-2 gap-8">
          {/* Instagram Card */}
          <div className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] shadow-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />

            {/* Header */}
            <div className="p-5 text-center relative">
              {/* Decorative elements */}
              <div className="absolute top-4 left-0 w-8 h-0.5 bg-white/20 skew-x-[-12deg]" />
              <div className="absolute bottom-4 right-0 w-8 h-0.5 bg-white/20 skew-x-[-12deg]" />

              {/* Icon */}
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 bg-white/40 skew-x-[-12deg]" />
                <Instagram className="h-5 w-5 text-white" />
                <div className="w-6 h-0.5 bg-white/40 skew-x-[-12deg]" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-extrabold tracking-tight mb-1">
                <span className="text-white">INSTA</span>
                <span className="text-pink-200 italic font-light">GRAM</span>
              </h3>

              {/* Decorative line */}
              <div className="mx-auto mt-2 mb-2 h-0.5 w-12 bg-white/50 skew-x-[-12deg]" />

              <p className="text-sm text-white/80">@rk_fenikss</p>
            </div>

            {/* Instagram Embed */}
            <div className="bg-white min-h-[500px]">
              <iframe
                src="https://www.instagram.com/rk_fenikss/embed"
                className="w-full h-[500px] border-0"
                scrolling="no"
                allowTransparency={true}
                allow="encrypted-media"
              />
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
              <Link
                href="https://www.instagram.com/rk_fenikss/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="skew-x-[-12deg] transform bg-white px-6 py-2.5 font-bold tracking-wide text-[#E4405F] shadow-lg transition-all duration-300 hover:bg-pink-100 hover:scale-105">
                  <span className="inline-flex skew-x-[12deg] transform items-center gap-2 text-sm">
                    SKATĪT PROFILU
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </button>
              </Link>
            </div>

            {/* Bottom accent line */}
            <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />
          </div>

          {/* TikTok Card */}
          <div className="bg-gradient-to-br from-[#010101] via-[#1a1a1a] to-[#010101] shadow-2xl overflow-hidden relative">
            {/* TikTok accent colors */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f2ea] via-[#ff0050] to-[#00f2ea]" />

            {/* Header */}
            <div className="p-5 text-center relative">
              {/* Decorative elements */}
              <div className="absolute top-4 left-0 w-8 h-0.5 bg-[#00f2ea]/30 skew-x-[-12deg]" />
              <div className="absolute bottom-4 right-0 w-8 h-0.5 bg-[#ff0050]/30 skew-x-[-12deg]" />

              {/* Icon */}
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-6 h-0.5 bg-[#00f2ea]/60 skew-x-[-12deg]" />
                <TikTokIcon className="h-5 w-5 text-white" />
                <div className="w-6 h-0.5 bg-[#ff0050]/60 skew-x-[-12deg]" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-extrabold tracking-tight mb-1">
                <span className="text-white">TIK</span>
                <span className="text-[#00f2ea] italic font-light">TOK</span>
              </h3>

              {/* Decorative line */}
              <div className="mx-auto mt-2 mb-2 h-0.5 w-12 bg-gradient-to-r from-[#00f2ea] to-[#ff0050] skew-x-[-12deg]" />

              <p className="text-sm text-white/80">@rk_fenikss</p>
            </div>

            {/* TikTok Embed */}
            <div className="bg-white min-h-[500px]">
              <iframe
                src="https://www.tiktok.com/embed/@rk_fenikss"
                className="w-full h-[500px] border-0"
                scrolling="no"
                allow="encrypted-media"
              />
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
              <Link
                href="https://www.tiktok.com/@rk_fenikss"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button className="skew-x-[-12deg] transform bg-white px-6 py-2.5 font-bold tracking-wide text-black shadow-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105">
                  <span className="inline-flex skew-x-[12deg] transform items-center gap-2 text-sm">
                    SKATĪT PROFILU
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </button>
              </Link>
            </div>

            {/* Bottom accent line */}
            <div className="h-1 bg-gradient-to-r from-[#00f2ea] via-[#ff0050] to-[#00f2ea]" />
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
