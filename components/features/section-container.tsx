import { cn } from '@/lib/utils'

interface SectionContainerProps {
  children: React.ReactNode
  withBackground?: boolean
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function SectionContainer({
  children,
  withBackground = false,
  className,
  maxWidth = '2xl',
}: SectionContainerProps) {
  return (
    <section
      className={cn(
        'py-16 md:py-24',
        {
          'bg-gray-100': withBackground,
        },
        className
      )}
    >
      <div
        className={cn('container mx-auto px-4', {
          'max-w-sm': maxWidth === 'sm',
          'max-w-md': maxWidth === 'md',
          'max-w-lg': maxWidth === 'lg',
          'max-w-xl': maxWidth === 'xl',
          'max-w-2xl': maxWidth === '2xl',
          'max-w-full': maxWidth === 'full',
        })}
      >
        {children}
      </div>
    </section>
  )
}
