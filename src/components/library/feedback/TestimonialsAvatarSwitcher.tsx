'use client'

import Image from 'next/image'
import { Quote, Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export type TestimonialsAvatarSwitcherItem = {
  quote: string
  name: string
  role?: string
  avatar: { src: string; alt: string }
  rating?: number
}

export type TestimonialsAvatarSwitcherProps = {
  title: string
  items: readonly TestimonialsAvatarSwitcherItem[]
  eyebrow?: string
  description?: string
  className?: string
}

/** Depoimento em destaque com estrelas, autor abaixo e avatares para alternar entre clientes. */
export function TestimonialsAvatarSwitcher({
  title,
  items,
  eyebrow,
  description,
  className,
}: TestimonialsAvatarSwitcherProps) {
  const [active, setActive] = useState(0)
  const current = items[active]
  if (!current) return null
  const rating = Math.max(0, Math.min(5, Math.round(current.rating ?? 5)))

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container grid items-center gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-14">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <figure key={active} className="min-w-0 flex-1 duration-500 animate-in fade-in">
            <div className="relative rounded-2xl bg-foreground p-7 text-background shadow-2xl md:p-9">
              <div className="flex gap-1 text-amber-400" aria-label={`${rating} de 5 estrelas`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={cn('h-4 w-4', index < rating ? 'fill-current' : 'opacity-30')}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-5 text-lg italic leading-8 opacity-90">
                “{current.quote}”
              </blockquote>
              <Quote
                className="absolute bottom-6 right-6 h-10 w-10 fill-current opacity-15"
                aria-hidden="true"
              />
            </div>
            <figcaption className="mt-6 flex items-center gap-4">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border">
                <Image
                  src={current.avatar.src}
                  alt={current.avatar.alt}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </span>
              <span>
                <span className="block font-bold">{current.name}</span>
                {current.role ? (
                  <span className="block text-sm text-muted-foreground">{current.role}</span>
                ) : null}
              </span>
            </figcaption>
          </figure>

          {items.length > 1 ? (
            <div
              className="flex gap-3 sm:flex-col"
              role="tablist"
              aria-label="Escolher depoimento"
              aria-orientation="vertical"
            >
              {items.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Depoimento de ${item.name}`}
                  onClick={() => setActive(index)}
                  className={cn(
                    'relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-16 md:w-16',
                    index === active
                      ? 'border-foreground/70'
                      : 'border-border opacity-60 grayscale hover:opacity-100 hover:grayscale-0',
                  )}
                >
                  <Image src={item.avatar.src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
