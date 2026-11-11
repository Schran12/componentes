import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface LoadingSkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: 'text' | 'card' | 'list' | 'avatar'
  count?: number
  lines?: number
  label?: string
}

const Pulse = ({ className }: { className?: string }) => (
  <span
    className={cn('block animate-pulse rounded-md bg-muted motion-reduce:animate-none', className)}
  />
)

export function LoadingSkeleton({
  variant = 'card',
  count = 1,
  lines = 3,
  label = 'Carregando conteúdo',
  className,
  ...props
}: LoadingSkeletonProps) {
  const safeCount = Math.max(1, count)
  const safeLines = Math.max(1, lines)

  return (
    <div role="status" aria-label={label} className={cn('w-full', className)} {...props}>
      <span className="sr-only">{label}</span>
      <div
        className={cn(
          variant === 'list' && 'grid gap-3',
          variant === 'card' && safeCount > 1 && 'grid gap-4 md:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {Array.from({ length: safeCount }).map((_, itemIndex) => {
          if (variant === 'avatar') {
            return <Pulse key={itemIndex} className="h-12 w-12 rounded-full" />
          }
          if (variant === 'text') {
            return (
              <div key={itemIndex} className="space-y-2">
                {Array.from({ length: safeLines }).map((__, lineIndex) => (
                  <Pulse
                    key={lineIndex}
                    className={cn('h-4', lineIndex === safeLines - 1 && 'w-2/3')}
                  />
                ))}
              </div>
            )
          }
          if (variant === 'list') {
            return (
              <div key={itemIndex} className="flex items-center gap-4 rounded-xl border p-4">
                <Pulse className="h-11 w-11 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Pulse className="h-4 w-1/3" />
                  <Pulse className="h-3 w-2/3" />
                </div>
              </div>
            )
          }
          return (
            <div key={itemIndex} className="overflow-hidden rounded-2xl border p-4">
              <Pulse className="aspect-video w-full rounded-xl" />
              <div className="mt-4 space-y-2">
                <Pulse className="h-5 w-2/3" />
                <Pulse className="h-4 w-full" />
                <Pulse className="h-4 w-4/5" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
