'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ProblemSolutionItem = {
  label: string
  title: string
  description: string
}

export type ProblemSolutionCardsProps = {
  title: string
  description?: string
  eyebrow?: string
  items: ProblemSolutionItem[]
  highlightLast?: boolean
  className?: string
}

export function ProblemSolutionCards({
  title,
  description,
  eyebrow,
  items,
  highlightLast = true,
  className,
}: ProblemSolutionCardsProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className={cn('bg-muted/40 py-16 md:py-24', className)}>
      <div className="container">
        <div className="max-w-2xl">
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
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => {
            const highlighted = highlightLast && index === items.length - 1
            return (
              <motion.li
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className={cn(
                  'relative flex flex-col rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl',
                  highlighted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-xs font-bold uppercase tracking-widest',
                    highlighted ? 'text-primary-foreground/75' : 'text-primary',
                  )}
                >
                  {item.label} · {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p
                  className={cn(
                    'mt-3 text-sm leading-6',
                    highlighted ? 'text-primary-foreground/85' : 'text-muted-foreground',
                  )}
                >
                  {item.description}
                </p>
                {index < items.length - 1 ? (
                  <span
                    className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-xs text-primary md:flex"
                    aria-hidden="true"
                  >
                    →
                  </span>
                ) : null}
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
