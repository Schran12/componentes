'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FilterableCard = {
  id: string
  title: string
  description?: string
  category: string
  image?: { src: string; alt: string }
  href?: string
  badge?: string
}

export type FilterableCardGridProps = {
  title?: string
  description?: string
  items: FilterableCard[]
  allLabel?: string
  columns?: 2 | 3 | 4
  className?: string
}

export function FilterableCardGrid({
  title,
  description,
  items,
  allLabel = 'Todos',
  columns = 3,
  className,
}: FilterableCardGridProps) {
  const [category, setCategory] = useState('all')
  const reduceMotion = useReducedMotion()
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))), [items])
  const filtered = category === 'all' ? items : items.filter((item) => item.category === category)
  const columnsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div
            className="flex max-w-full gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label="Filtrar cards"
          >
            {[
              { value: 'all', label: allLabel },
              ...categories.map((item) => ({ value: item, label: item })),
            ].map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() => setCategory(filter.value)}
                aria-pressed={category === filter.value}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  category === filter.value
                    ? 'border-foreground bg-foreground text-background'
                    : 'bg-background hover:border-primary/40 hover:text-primary',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className={cn('mt-10 grid gap-5', columnsClass)}>
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.article
                layout
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: reduceMotion ? 0 : 0.25 }}
                className="group min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl"
              >
                {item.image ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, 50vw"
                    />
                    {item.badge ? (
                      <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                    >
                      Explorar <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
