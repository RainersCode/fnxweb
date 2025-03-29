import { cn } from "@/lib/utils"

interface SectionContainerProps {
  children: React.ReactNode
  className?: string
  withPadding?: boolean
  withBackground?: boolean
}

export function SectionContainer({
  children,
  className,
  withPadding = true,
  withBackground = false,
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        "relative w-full",
        withPadding && "py-16",
        withBackground && "bg-white",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">{children}</div>
    </section>
  )
} 