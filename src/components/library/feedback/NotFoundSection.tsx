import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NotFoundSuggestion = {
  label: string
  href: string
  description?: string
  icon?: ReactNode
}

export type NotFoundSectionProps = {
  title: string
  description?: string
  eyebrow?: string
  code?: string
  primaryAction: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  suggestionsTitle?: string
  suggestions?: NotFoundSuggestion[]
  className?: string
}

export function NotFoundSection({
  title,
  description,
  eyebrow,
  code = '404',
  primaryAction,
  secondaryAction,
  suggestionsTitle,
  suggestions = [],
  className,
}: NotFoundSectionProps) {
  return (
    <div className={className}>
      <section className="relative overflow-hidden border-b bg-muted/40">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="container relative flex flex-col items-center py-20 text-center md:py-28">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <p
            aria-hidden
            className="mt-4 bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-[7rem] font-bold leading-none tracking-tighter text-transparent sm:text-[10rem] md:text-[12rem]"
          >
            {code}
          </p>
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={primaryAction.href}
              className="inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              {primaryAction.label}
            </a>
            {secondaryAction ? (
              <a
                href={secondaryAction.href}
                className="inline-flex h-11 items-center rounded-md border bg-background px-8 text-sm font-medium transition hover:bg-muted"
              >
                {secondaryAction.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {suggestions.length ? (
        <section
          aria-labelledby={suggestionsTitle ? 'not-found-suggestions' : undefined}
          className="py-16 md:py-20"
        >
          <div className="container">
            {suggestionsTitle ? (
              <h2
                id="not-found-suggestions"
                className="text-center text-xl font-bold tracking-tight md:text-2xl"
              >
                {suggestionsTitle}
              </h2>
            ) : null}
            <ul
              className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', suggestionsTitle && 'mt-8')}
            >
              {suggestions.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.icon ? (
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:h-5 [&_svg]:w-5">
                        {item.icon}
                      </span>
                    ) : null}
                    <span className="mt-4 flex items-center gap-2 font-semibold">
                      {item.label}
                      <ArrowRight
                        className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                    {item.description ? (
                      <span className="mt-1 text-sm text-muted-foreground">{item.description}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  )
}
