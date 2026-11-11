'use client'

import Image from 'next/image'
import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InteractiveFeature = {
  id: string
  title: string
  description: string
  eyebrow?: string
  icon?: ReactNode
  image: { src: string; alt: string }
  action?: { label: string; href: string }
}

export type InteractiveFeatureShowcaseProps = {
  title?: string
  description?: string
  features: InteractiveFeature[]
  defaultValue?: string
  className?: string
}

export function InteractiveFeatureShowcase({
  title,
  description,
  features,
  defaultValue,
  className,
}: InteractiveFeatureShowcaseProps) {
  const generatedId = useId()
  const reduceMotion = useReducedMotion()
  const [activeId, setActiveId] = useState(defaultValue ?? features[0]?.id)
  const active = features.find((feature) => feature.id === activeId) ?? features[0]

  if (!active) return null

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        {(title || description) && (
          <div className="mb-10 max-w-2xl">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
            ) : null}
          </div>
        )}
        <div className="grid overflow-hidden rounded-3xl border bg-card shadow-xl shadow-black/5 lg:grid-cols-[0.8fr_1.2fr]">
          <div role="tablist" aria-label={title ?? 'Recursos'} className="flex flex-col p-3 md:p-5">
            {features.map((feature, index) => {
              const selected = feature.id === active.id
              return (
                <button
                  type="button"
                  role="tab"
                  id={`${generatedId}-tab-${feature.id}`}
                  aria-controls={`${generatedId}-panel-${feature.id}`}
                  aria-selected={selected}
                  onClick={() => setActiveId(feature.id)}
                  className={cn(
                    'group relative flex w-full gap-4 rounded-2xl p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    selected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                  )}
                  key={feature.id}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-sm font-bold',
                      selected
                        ? 'border-white/15 bg-white/10'
                        : 'bg-background text-muted-foreground',
                    )}
                  >
                    {feature.icon ?? String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    {feature.eyebrow ? (
                      <span
                        className={cn(
                          'block text-[10px] font-bold uppercase tracking-[0.16em]',
                          selected ? 'text-primary-foreground/70' : 'text-primary',
                        )}
                      >
                        {feature.eyebrow}
                      </span>
                    ) : null}
                    <span className="mt-1 block font-semibold">{feature.title}</span>
                    <span
                      className={cn(
                        'mt-1 line-clamp-2 block text-sm',
                        selected ? 'text-primary-foreground/80' : 'text-muted-foreground',
                      )}
                    >
                      {feature.description}
                    </span>
                  </span>
                  {selected ? (
                    <motion.span
                      layoutId={`${generatedId}-indicator`}
                      className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-primary-foreground"
                    />
                  ) : null}
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id={`${generatedId}-panel-${active.id}`}
            aria-labelledby={`${generatedId}-tab-${active.id}`}
            className="relative min-h-[420px] overflow-hidden bg-muted"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                className="absolute inset-0"
                initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0 : 0.4 }}
              >
                <Image
                  src={active.image.src}
                  alt={active.image.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <p className="max-w-xl text-lg leading-7 text-white/75">{active.description}</p>
                  {active.action ? (
                    <a
                      href={active.action.href}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {active.action.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
