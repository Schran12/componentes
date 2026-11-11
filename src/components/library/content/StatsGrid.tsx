import { cn } from '@/lib/utils'

export type StatsGridProps = {
  title?: string
  description?: string
  stats: Array<{ value: string; label: string; detail?: string }>
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ title, description, stats, columns = 4, className }: StatsGridProps) {
  const columnClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns]
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'stats-title' : undefined}
    >
      <div className="container">
        {title ? (
          <h2 id="stats-title" className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p> : null}
        <dl
          className={cn(
            'mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border',
            columnClass,
          )}
        >
          {stats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className="bg-background p-7">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="mt-2 text-4xl font-bold tracking-tight text-primary">{stat.value}</dd>
              {stat.detail ? (
                <p className="mt-2 text-sm text-muted-foreground">{stat.detail}</p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
