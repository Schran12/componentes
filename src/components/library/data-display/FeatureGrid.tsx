import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FeatureGridProps = {
  title?: string
  description?: string
  features: Array<{ title: string; description: string; icon?: LucideIcon }>
  className?: string
}

export function FeatureGrid({ title, description, features, className }: FeatureGridProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'features-title' : undefined}
    >
      <div className="container">
        {title ? (
          <h2 id="features-title" className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
        ) : null}
        <div
          className={cn(
            'mt-10 grid gap-5 md:grid-cols-2',
            features.length % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
          )}
        >
          {features.map(({ title: featureTitle, description: featureDescription, icon: Icon }) => (
            <article
              key={featureTitle}
              className="rounded-2xl border bg-card p-6 text-card-foreground shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {Icon ? (
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              ) : null}
              <h3 className="text-lg font-semibold">{featureTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{featureDescription}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
