import { cn } from '@/lib/utils'

export type GlobalMetric = {
  value: string
  label: string
  detail?: string
}

export type GlobalMetricsSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  metrics: readonly GlobalMetric[]
  variant?: 'light' | 'dark' | 'gradient'
  className?: string
}

const variants = {
  light: 'bg-[#f6f9fc] text-[#0a2540]',
  dark: 'bg-[#0a2540] text-white',
  gradient: 'bg-gradient-to-br from-[#0a2540] via-[#132f4c] to-[#312f81] text-white',
}

export function GlobalMetricsSection({
  eyebrow,
  title,
  description,
  metrics,
  variant = 'dark',
  className,
}: GlobalMetricsSectionProps) {
  const inverse = variant !== 'light'

  return (
    <section
      className={cn('relative overflow-hidden py-20 md:py-28', variants[variant], className)}
    >
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#635bff]/30 blur-3xl"
      />
      <div className="container relative">
        <div className="grid gap-7 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            {eyebrow ? (
              <p
                className={cn(
                  'text-sm font-semibold',
                  inverse ? 'text-[#80e9ff]' : 'text-[#635bff]',
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] md:text-6xl">{title}</h2>
          </div>
          {description ? (
            <p
              className={cn(
                'max-w-2xl text-lg leading-8 lg:justify-self-end',
                inverse ? 'text-white/65' : 'text-[#425466]',
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        <dl
          className={cn(
            'mt-14 grid border-t sm:grid-cols-2 lg:grid-cols-4',
            inverse ? 'border-white/15' : 'border-[#dfe7ef]',
          )}
        >
          {metrics.slice(0, 4).map((metric, index) => (
            <div
              key={`${metric.value}-${metric.label}`}
              className={cn(
                'relative py-8 sm:px-7 lg:py-10',
                index > 0 &&
                  (inverse ? 'sm:border-l sm:border-white/15' : 'sm:border-l sm:border-[#dfe7ef]'),
                index % 2 === 0 && 'sm:pl-0 lg:pl-7',
                index === 0 && 'lg:pl-0',
              )}
            >
              <dd className="text-4xl font-bold tracking-[-0.04em] md:text-5xl">{metric.value}</dd>
              <dt
                className={cn(
                  'mt-3 text-sm font-semibold',
                  inverse ? 'text-white/85' : 'text-[#0a2540]',
                )}
              >
                {metric.label}
              </dt>
              {metric.detail ? (
                <p
                  className={cn(
                    'mt-2 text-xs leading-5',
                    inverse ? 'text-white/50' : 'text-[#697386]',
                  )}
                >
                  {metric.detail}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
