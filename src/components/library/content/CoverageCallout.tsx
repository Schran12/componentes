import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CoverageCalloutProps = {
  title: string
  description?: string
  eyebrow?: string
  cardTitle?: string
  cardDescription?: string
  action?: { label: string; href: string }
  badge: { value: string; label: string; caption?: string }
  className?: string
}

export function CoverageCallout({
  title,
  description,
  eyebrow,
  cardTitle,
  cardDescription,
  action,
  badge,
  className,
}: CoverageCalloutProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          {eyebrow ? (
            <p className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
              {'// '}
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
          {cardTitle || action ? (
            <div className="mt-8 rounded-2xl border bg-muted/40 p-6">
              {cardTitle ? <h3 className="text-lg font-semibold">{cardTitle}</h3> : null}
              {cardDescription ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{cardDescription}</p>
              ) : null}
              {action ? (
                <a
                  href={action.href}
                  className="group mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/10 [animation-duration:3s]" />
          <span className="absolute inset-6 rounded-full border-2 border-dashed border-primary/30" />
          <div className="relative flex aspect-square w-3/4 flex-col items-center justify-center rounded-full bg-primary p-8 text-center text-primary-foreground shadow-2xl">
            {badge.caption ? (
              <span className="text-xs font-bold uppercase tracking-widest opacity-75">
                {badge.caption}
              </span>
            ) : null}
            <span className="mt-1 text-6xl font-bold">{badge.value}</span>
            <span className="mt-2 text-sm opacity-85">{badge.label}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
