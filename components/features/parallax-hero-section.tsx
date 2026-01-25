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
  return (
    <section className="relative overflow-hidden py-24">
      {/* CSS-based parallax - GPU accelerated, no JS lag */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-teal-900/80 to-teal-700/80" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
            <span className="text-white">{title}</span>
            {titleHighlight && (
              <span className="ml-2 font-light italic text-white">{titleHighlight}</span>
            )}
          </h1>
          <div className="mx-auto mb-6 h-1 w-32 skew-x-[-12deg] transform bg-white"></div>
          {subtitle && <p className="text-xl text-teal-100">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}
