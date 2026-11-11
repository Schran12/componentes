import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type AboutValue = {
  title: string
  description: string
  icon?: LucideIcon
}

export type AboutValuesSectionProps = {
  eyebrow?: string
  title: string
  description: string
  values: AboutValue[]
  statement?: string
  className?: string
}

export function AboutValuesSection({
  eyebrow = 'Sobre nós',
  title,
  description,
  values,
  statement,
  className,
}: AboutValuesSectionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <header className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">{description}</p>
            {statement ? (
              <p className="mt-8 border-l-2 border-primary pl-5 text-lg font-medium leading-8">
                {statement}
              </p>
            ) : null}
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <article
                  key={value.title}
                  className={cn(
                    'group min-h-56 rounded-3xl border bg-card p-6 transition duration-300 hover:border-primary/30 hover:shadow-lg',
                    index === 0 && 'sm:col-span-2 sm:min-h-64',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {Icon ? <Icon className="size-5" aria-hidden="true" /> : `0${index + 1}`}
                    </span>
                    <ArrowUpRight
                      className="size-5 text-muted-foreground transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-10 text-xl font-semibold">{value.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{value.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
