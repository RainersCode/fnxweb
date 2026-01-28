'use client'

import { useState, useEffect } from 'react'
import { X, Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function DonationPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('donation-popup-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const twentyFourHours = 24 * 60 * 60 * 1000
      if (Date.now() - dismissedTime < twentyFourHours) {
        // Still within 24h window, don't show
        setIsDismissed(true)
        return
      }
      // 24h has passed, clear the old dismissal
      localStorage.removeItem('donation-popup-dismissed')
    }

    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('donation-popup-dismissed', Date.now().toString())
  }

  if (isDismissed || !isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-up max-w-xs">
      <div className="bg-gradient-to-br from-pink-600 via-red-500 to-pink-600 shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Aizvērt"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />

        {/* Content */}
        <div className="p-5 text-center relative">
          {/* Decorative elements */}
          <div className="absolute top-4 left-0 w-8 h-0.5 bg-white/20 skew-x-[-12deg]" />
          <div className="absolute bottom-4 right-0 w-8 h-0.5 bg-white/20 skew-x-[-12deg]" />

          {/* Icon */}
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-0.5 bg-white/40 skew-x-[-12deg]" />
            <Heart className="h-5 w-5 text-white animate-pulse" />
            <div className="w-6 h-0.5 bg-white/40 skew-x-[-12deg]" />
          </div>

          {/* Title - matching homepage style */}
          <h3 className="text-xl font-extrabold tracking-tight mb-1">
            <span className="text-white">AUTISMA </span>
            <span className="text-pink-200 italic font-light">ATBALSTS</span>
          </h3>

          {/* Decorative line */}
          <div className="mx-auto mt-2 mb-3 h-0.5 w-12 bg-white/50 skew-x-[-12deg]" />

          <p className="text-sm text-white/90 mb-4 leading-relaxed">
            Palīdzi mums palīdzēt citiem!
          </p>

          {/* CTA Button - skewed style */}
          <Link
            href="https://gogetfunding.com/fenikss-in-support-of-autism/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="skew-x-[-12deg] transform bg-white px-6 py-2.5 font-bold tracking-wide text-pink-600 shadow-lg transition-all duration-300 hover:bg-pink-100 hover:scale-105">
              <span className="inline-flex skew-x-[12deg] transform items-center gap-2 text-sm">
                <Heart className="h-4 w-4" />
                ZIEDOT
                <ExternalLink className="h-3 w-3" />
              </span>
            </button>
          </Link>

          {/* Later link */}
          <button
            onClick={handleDismiss}
            className="block mx-auto mt-3 text-white/60 hover:text-white text-xs transition-colors"
          >
            Vēlāk
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-gradient-to-r from-white/30 via-white/60 to-white/30" />
      </div>
    </div>
  )
}
