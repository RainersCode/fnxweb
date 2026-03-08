'use client'

import { useState, useRef, useEffect } from 'react'
import { Instagram, ExternalLink, Facebook, Play } from 'lucide-react'
import Link from 'next/link'

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

function LazyEmbed({
  src,
  placeholder,
  label,
}: {
  src: string
  placeholder: React.ReactNode
  icon?: React.ReactNode
  label: string
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="bg-white min-h-[500px] relative">
      {isLoaded && isNearViewport ? (
        <iframe
          src={src}
          className="w-full h-[500px] border-0"
          scrolling="no"
          allow="encrypted-media"
          loading="lazy"
        />
      ) : (
        <button
          onClick={() => setIsLoaded(true)}
          className="w-full h-[500px] flex flex-col items-center justify-center gap-4 bg-[#f5f5f5] hover:bg-[#eee] transition-colors cursor-pointer"
          aria-label={`Ielādēt ${label}`}
        >
          {placeholder}
          <div className="flex items-center gap-2 bg-white shadow-lg px-6 py-3 rounded-full">
            <Play className="h-5 w-5 text-[#111] fill-[#111]" />
            <span className="font-semibold text-[#111] text-sm">Ielādēt {label}</span>
          </div>
        </button>
      )}
    </div>
  )
}

export function HomeSocialSection() {
  return (
    <section className="py-20 bg-[#111] bg-stripes-dark">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-[clamp(42px,5vw,70px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
            Sociālie<br />Tīkli
          </h2>
        </div>

        {/* Social Feeds Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Instagram */}
          <div className="bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] px-6 py-4 flex items-center gap-3">
              <Instagram className="h-5 w-5 text-white" />
              <span className="font-cond text-sm font-bold tracking-[2px] uppercase text-white">
                Instagram
              </span>
              <span className="text-white/70 text-sm ml-auto">@rk_fenikss</span>
            </div>

            <LazyEmbed
              src="https://www.instagram.com/rk_fenikss/embed"
              label="Instagram"
              placeholder={
                <div className="flex flex-col items-center gap-3">
                  <Instagram className="h-16 w-16 text-[#E4405F]" />
                  <span className="text-[#888] text-sm">@rk_fenikss</span>
                </div>
              }
            />

            <div className="p-4 text-center border-t border-[#e5e5e5]">
              <Link
                href="https://www.instagram.com/rk_fenikss/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-[#E4405F] transition-colors duration-200">
                  Skatīt profilu
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* TikTok */}
          <div className="bg-white overflow-hidden">
            <div className="bg-[#010101] px-6 py-4 flex items-center gap-3 relative">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00f2ea] via-[#ff0050] to-[#00f2ea]" />
              <TikTokIcon className="h-5 w-5 text-white" />
              <span className="font-cond text-sm font-bold tracking-[2px] uppercase text-white">
                TikTok
              </span>
              <span className="text-white/70 text-sm ml-auto">@rk_fenikss</span>
            </div>

            <LazyEmbed
              src="https://www.tiktok.com/embed/@rk_fenikss"
              label="TikTok"
              placeholder={
                <div className="flex flex-col items-center gap-3">
                  <TikTokIcon className="h-16 w-16 text-black" />
                  <span className="text-[#888] text-sm">@rk_fenikss</span>
                </div>
              }
            />

            <div className="p-4 text-center border-t border-[#e5e5e5]">
              <Link
                href="https://www.tiktok.com/@rk_fenikss"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-[#010101] transition-colors duration-200">
                  Skatīt profilu
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-3.5 mt-10">
          <Link
            href="https://www.facebook.com/RKFenikss"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-8 h-8 grid place-items-center text-white opacity-70 hover:opacity-100 transition-opacity duration-200"
          >
            <Facebook className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="https://www.instagram.com/rk_fenikss/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 grid place-items-center text-white opacity-70 hover:opacity-100 transition-opacity duration-200"
          >
            <Instagram className="h-[18px] w-[18px]" />
          </Link>
          <Link
            href="https://www.tiktok.com/@rk_fenikss"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="w-8 h-8 grid place-items-center text-white opacity-70 hover:opacity-100 transition-opacity duration-200"
          >
            <TikTokIcon className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
