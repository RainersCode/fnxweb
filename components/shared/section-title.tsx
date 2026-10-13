interface SectionTitleProps {
  title: string
  titleHighlight?: string
  className?: string
  align?: "left" | "center"
}

export function SectionTitle({ title, titleHighlight, className = "", align = "left" }: SectionTitleProps) {
  return (
    <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight text-club mb-6 ${className}`}>
      <span className="relative">
        <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-club uppercase">{title}</span>
        {titleHighlight && <span className="text-2xl sm:text-3xl md:text-4xl font-light italic tracking-wide text-club uppercase ml-2">{titleHighlight}</span>}
        <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-club-mint to-club skew-x-[-12deg]"></span>
      </span>
    </h2>
  )
} 