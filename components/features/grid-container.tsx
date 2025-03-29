import { cn } from '@/lib/utils'

interface GridContainerProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3
  gap?: 'sm' | 'md' | 'lg'
}

export function GridContainer({ children, className, cols = 3, gap = 'md' }: GridContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-6xl grid-cols-1 gap-4',
        {
          'md:grid-cols-2': cols === 2,
          'md:grid-cols-3': cols === 3,
          'gap-4': gap === 'sm',
          'gap-8': gap === 'md',
          'gap-12': gap === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  )
}
