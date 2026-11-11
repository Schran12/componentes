import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type MetricItem = {
  value: string
  label: string
  detail?: string
  icon?: ReactNode
}

export interface MetricsBandProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  metrics: readonly MetricItem[]
  variant?: 'default' | 'primary' | 'dark'
  align?: 'left' | 'center'
  emptyMessage?: string
}

export function MetricsBand({
  metrics,
  variant = 'default',
  align = 'center',
  emptyMessage = 'Nenhuma métrica disponível.',
  className,
  ...props
}: MetricsBandProps) {
  return (
    <section
      className={cn(
        'border-y py-8 md:py-10',
        variant === 'default' && 'bg-background',
        variant === 'primary' && 'border-primary bg-primary text-primary-foreground',
        variant === 'dark' && 'border-foreground bg-foreground text-background',
        className,
      )}
      aria-label="Principais métricas"
      {...props}
    >
      <div className="container">
        {metrics.length ? (
          <dl
            className={cn(
              'grid gap-8',
              metrics.length > 1 && 'sm:grid-cols-2',
              metrics.length > 2 && 'lg:grid-cols-4',
            )}
          >
            {metrics.map((metric) => (
              <div
                key={`${metric.value}-${metric.label}`}
                className={cn(
                  'group min-w-0',
                  align === 'center' && 'text-center',
                  variant === 'default' && 'lg:border-r lg:last:border-r-0',
                )}
              >
                {metric.icon ? (
                  <div className="mb-2 inline-flex transition-transform group-hover:-translate-y-1">
                    {metric.icon}
                  </div>
                ) : null}
                <dd className="text-3xl font-bold tracking-tight md:text-4xl">{metric.value}</dd>
                <dt
                  className={cn(
                    'mt-1 font-medium',
                    variant === 'default' ? 'text-muted-foreground' : 'opacity-80',
                  )}
                >
                  {metric.label}
                </dt>
                {metric.detail ? <p className="mt-1 text-sm opacity-70">{metric.detail}</p> : null}
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-center opacity-70">{emptyMessage}</p>
        )}
      </div>
    </section>
  )
}
