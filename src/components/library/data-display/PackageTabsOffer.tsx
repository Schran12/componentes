'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type OfferPackage = {
  id: string
  label: string
  headline: string
  price: string
  priceNote?: string
  description: string
  image?: { src: string; alt: string }
  actions?: Array<{ label: string; href: string; variant?: 'primary' | 'outline' }>
}

export type PackageTabsOfferProps = {
  title?: string
  packages: OfferPackage[]
  className?: string
}

export function PackageTabsOffer({ title, packages, className }: PackageTabsOfferProps) {
  const [activeId, setActiveId] = useState(packages[0]?.id)
  const reduceMotion = useReducedMotion()
  const indicatorId = useId()
  const active = packages.find((item) => item.id === activeId) ?? packages[0]

  if (!active) return null

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        {title ? (
          <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
        ) : null}
        <div className="overflow-hidden rounded-3xl border bg-card shadow-xl">
          <div className="flex overflow-x-auto border-b" role="tablist">
            {packages.map((item) => {
              const selected = item.id === active.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    'relative shrink-0 px-6 py-4 text-sm font-semibold transition',
                    selected ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {item.label}
                  {selected ? (
                    <motion.span
                      layoutId={indicatorId}
                      className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                    />
                  ) : null}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              role="tabpanel"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'grid gap-8 p-6 md:p-10',
                active.image && 'lg:grid-cols-2 lg:items-center',
              )}
            >
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground">{active.headline}</h3>
                <p className="mt-2 text-5xl font-bold tracking-tight text-primary md:text-6xl">
                  {active.price}
                </p>
                {active.priceNote ? (
                  <p className="mt-1 text-sm text-muted-foreground">{active.priceNote}</p>
                ) : null}
                <p className="mt-6 leading-7 text-muted-foreground">{active.description}</p>
                {active.actions?.length ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {active.actions.map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        className={cn(
                          'inline-flex rounded-full px-6 py-3 text-sm font-semibold transition',
                          action.variant === 'outline'
                            ? 'border hover:border-primary hover:text-primary'
                            : 'bg-primary text-primary-foreground hover:bg-primary-hover',
                        )}
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
              {active.image ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={active.image.src}
                    alt={active.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 45vw, 100vw"
                  />
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
