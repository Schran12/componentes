'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ShowcaseLocation = {
  id: string
  name: string
  description?: string
  image: { src: string; alt: string }
  href?: string
}

export type LocationShowcaseProps = {
  title: string
  description?: string
  locations: ShowcaseLocation[]
  action?: { label: string; href: string }
  linkLabel?: string
  className?: string
}

export function LocationShowcase({
  title,
  description,
  locations,
  action,
  linkLabel = 'Saiba mais',
  className,
}: LocationShowcaseProps) {
  const [activeId, setActiveId] = useState(locations[0]?.id)
  const reduceMotion = useReducedMotion()
  const active = locations.find((location) => location.id === activeId) ?? locations[0]

  if (!active) return null

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tight md:text-5xl">{title}</h2>
          {description ? (
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
          <ul className="mt-8 grid gap-1 sm:grid-cols-2" role="tablist" aria-label={title}>
            {locations.map((location) => {
              const selected = location.id === active.id
              return (
                <li key={location.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(location.id)}
                    onMouseEnter={() => setActiveId(location.id)}
                    onFocus={() => setActiveId(location.id)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold transition',
                      selected ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted',
                    )}
                  >
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {location.name}
                  </button>
                </li>
              )
            })}
          </ul>
          {action ? (
            <a
              href={action.href}
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-primary"
            >
              {action.label}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          ) : null}
        </div>

        <div
          className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted shadow-xl"
          role="tabpanel"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={active.image.src}
                alt={active.image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 55vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <h3 className="text-2xl font-bold">{active.name}</h3>
                {active.description ? (
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/80">
                    {active.description}
                  </p>
                ) : null}
                {active.href ? (
                  <a
                    href={active.href}
                    className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-primary hover:text-primary-foreground"
                  >
                    {linkLabel}
                  </a>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
