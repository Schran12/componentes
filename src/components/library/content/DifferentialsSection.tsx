import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export type DifferentialsSectionItem = {
  title: string
  description: string
  icon?: ReactNode
  eyebrow?: string
  points?: readonly string[]
}

export type DifferentialsSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  items: readonly DifferentialsSectionItem[]
  variant?: 'cards' | 'numbered' | 'split' | 'spotlight'
  columns?: 2 | 3 | 4
  action?: { label: string; href: string }
  className?: string
}

export function DifferentialsSection({
  eyebrow,
  title,
  description,
  items,
  variant = 'cards',
  columns = 3,
  action,
  className,
}: DifferentialsSectionProps) {
  const dark = variant === 'spotlight'
  const columnsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 xl:grid-cols-4',
  }[columns]

  return (
    <section
      className={cn(
        'overflow-hidden py-20 md:py-28',
        dark ? 'bg-slate-950 text-white' : 'bg-background',
        className,
      )}
    >
      <div
        className={cn(
          'container',
          variant === 'split' && 'grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20',
        )}
      >
        <header
          className={cn(
            'max-w-2xl',
            variant !== 'split' && 'mb-12',
            variant === 'split' && 'h-fit lg:sticky lg:top-28',
          )}
        >
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          ) : null}
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
          {description ? (
            <p
              className={cn(
                'mt-5 text-base leading-8',
                dark ? 'text-white/60' : 'text-muted-foreground',
              )}
            >
              {description}
            </p>
          ) : null}
          {action ? (
            <Link
              href={action.href}
              className="mt-7 inline-flex items-center gap-2 rounded-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {action.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
        </header>

        <div
          className={cn(
            variant === 'cards' && `grid gap-5 ${columnsClass}`,
            variant === 'numbered' && 'divide-y border-y',
            variant === 'split' && 'space-y-4',
            variant === 'spotlight' && `grid gap-5 ${columnsClass}`,
          )}
        >
          {items.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className={cn(
                'group relative',
                variant === 'cards' &&
                  'rounded-3xl border bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl',
                variant === 'numbered' &&
                  'grid gap-5 py-8 md:grid-cols-[80px_1fr_1.2fr] md:items-start',
                variant === 'split' &&
                  'rounded-3xl border bg-card p-7 transition hover:border-primary/40 hover:shadow-lg md:p-8',
                variant === 'spotlight' &&
                  'isolate overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 duration-300 before:absolute before:-right-16 before:-top-16 before:-z-10 before:h-44 before:w-44 before:rounded-full before:bg-primary/10 before:blur-3xl before:transition hover:-translate-y-1 hover:border-primary/40 hover:before:bg-primary/25',
              )}
            >
              {variant === 'numbered' ? (
                <span className="text-sm font-bold tracking-[0.2em] text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
              ) : item.icon ? (
                <span
                  className={cn(
                    'mb-6 flex h-12 w-12 items-center justify-center rounded-2xl',
                    dark ? 'bg-white/10 text-primary' : 'bg-primary/10 text-primary',
                  )}
                >
                  {item.icon}
                </span>
              ) : (
                <span className="mb-6 block text-sm font-bold tracking-[0.2em] text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}

              <div>
                {item.eyebrow ? (
                  <p
                    className={cn(
                      'text-xs font-bold uppercase tracking-[0.18em]',
                      dark ? 'text-white/45' : 'text-muted-foreground',
                    )}
                  >
                    {item.eyebrow}
                  </p>
                ) : null}
                <h3 className={cn('text-xl font-semibold', item.eyebrow && 'mt-2')}>
                  {item.title}
                </h3>
              </div>

              <div>
                <p
                  className={cn(
                    'leading-7',
                    variant === 'numbered' ? 'text-sm' : 'mt-3 text-sm',
                    dark ? 'text-white/60' : 'text-muted-foreground',
                  )}
                >
                  {item.description}
                </p>
                {item.points?.length ? (
                  <ul className="mt-5 space-y-2">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span className={dark ? 'text-white/70' : 'text-muted-foreground'}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
