'use client'

import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ExpandableCardItem = {
  id: string
  title: string
  description: string
  image: { src: string; alt: string }
  eyebrow?: string
  icon?: ReactNode
  action?: { label: string; href: string }
}

export type ExpandableCardsProps = {
  title?: string
  description?: string
  items: ExpandableCardItem[]
  defaultValue?: string
  className?: string
}

export function ExpandableCards({
  title,
  description,
  items,
  defaultValue,
  className,
}: ExpandableCardsProps) {
  const [activeId, setActiveId] = useState(defaultValue ?? items[0]?.id)
  const reduceMotion = useReducedMotion()

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
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {items.map((item) => (
            <article
              key={item.id}
              className="relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 text-white"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                className="-z-10 object-cover opacity-60"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              {item.eyebrow ? (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  {item.eyebrow}
                </p>
              ) : null}
              <h3 className="mt-2 text-2xl font-bold tracking-tight">{item.title}</h3>
              <p className="mt-3 leading-7 text-white/75">{item.description}</p>
              {item.action ? (
                <a
                  href={item.action.href}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
                >
                  {item.action.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">: {item.title}</span>
                </a>
              ) : null}
            </article>
          ))}
        </div>
        <div className="hidden min-h-[480px] gap-3 lg:flex lg:flex-row">
          {items.map((item) => {
            const active = item.id === activeId
            return (
              <motion.article
                layout
                key={item.id}
                className={cn(
                  'group relative isolate min-h-64 cursor-pointer overflow-hidden rounded-3xl bg-slate-900 text-white',
                  active ? 'lg:flex-[3]' : 'lg:flex-1',
                )}
                onClick={() => setActiveId(item.id)}
                onFocus={() => setActiveId(item.id)}
                transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className={cn(
                    'object-cover transition duration-700',
                    active ? 'scale-100 opacity-65' : 'scale-105 opacity-35 group-hover:opacity-50',
                  )}
                  sizes={active ? '(min-width: 1024px) 60vw, 100vw' : '25vw'}
                />
                <div className="absolute inset-0 -z-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <button
                  type="button"
                  aria-expanded={active}
                  aria-controls={`expandable-${item.id}`}
                  className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                  onClick={() => setActiveId(item.id)}
                >
                  <span className="sr-only">Abrir {item.title}</span>
                </button>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      {item.eyebrow ? (
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                          {item.eyebrow}
                        </p>
                      ) : null}
                      <h3
                        className={cn(
                          'mt-2 font-bold tracking-tight transition',
                          active ? 'text-2xl md:text-3xl' : 'text-xl',
                        )}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur">
                      {item.icon ?? (
                        <Plus
                          className={cn('h-5 w-5 transition', active && 'rotate-45')}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {active ? (
                      <motion.div
                        id={`expandable-${item.id}`}
                        initial={reduceMotion ? false : { opacity: 0, height: 0, y: 8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, height: 0, y: 8 }}
                        transition={{ duration: reduceMotion ? 0 : 0.3 }}
                      >
                        <p className="mt-4 max-w-xl leading-7 text-white/70">{item.description}</p>
                        {item.action ? (
                          <a
                            href={item.action.href}
                            className="pointer-events-auto mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
                          >
                            {item.action.label}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        ) : null}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
