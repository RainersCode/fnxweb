import { cn } from '@/lib/utils'

interface SectionTitleProps {
  title: string
  titleHighlight?: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

export function SectionTitle({
  title,
  titleHighlight,
  subtitle,
  align = 'left',
}: SectionTitleProps) {
  return (
    <div
      className={cn('mb-8', {
        'text-left': align === 'left',
        'text-center': align === 'center',
        'text-right': align === 'right',
      })}
    >
      <h2 className="text-4xl font-bold tracking-tight text-zinc-900">
        {title} {titleHighlight && <span className="text-teal-800">{titleHighlight}</span>}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-zinc-600">{subtitle}</p>}
    </div>
  )
}
