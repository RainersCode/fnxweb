import { useState, useEffect } from "react"

interface ParallaxHeroSectionProps {
  title: string
  titleHighlight?: string
  subtitle?: string
  backgroundImage: string
}

export function ParallaxHeroSection({
  title,
  titleHighlight,
  subtitle,
  backgroundImage,
}: ParallaxHeroSectionProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: "transform 0.1s linear",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900/80 to-teal-700/80 z-0" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
            <span className="text-white">{title}</span>
            {titleHighlight && <span className="text-white font-light italic ml-2">{titleHighlight}</span>}
          </h1>
          <div className="h-1 w-32 bg-white mx-auto mb-6 transform skew-x-[-12deg]"></div>
          {subtitle && <p className="text-xl text-teal-100">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
} 