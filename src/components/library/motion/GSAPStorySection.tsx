'use client'

import { useRef } from 'react'
import Image from 'next/image'

import { useGSAP } from '@/lib/hooks/useGSAP'
import { cn } from '@/lib/utils'

import { prefersReducedMotion, useReducedMotion } from './useReducedMotion'

export type GSAPStoryItem = {
  id: string
  number?: string
  title: string
  description: string
  image: { src: string; alt: string }
}

export type GSAPStorySectionProps = {
  eyebrow?: string
  title: string
  description?: string
  items: readonly GSAPStoryItem[]
  pinHeading?: boolean
  className?: string
}

export function GSAPStorySection({
  eyebrow,
  title,
  description,
  items,
  pinHeading = true,
  className,
}: GSAPStorySectionProps) {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(
    ({ gsap, ScrollTrigger }) => {
      const section = root.current
      if (!section || reducedMotion || prefersReducedMotion()) return

      const heading = section.querySelector('[data-gsap-heading]')
      const cards = gsap.utils.toArray<HTMLElement>('[data-gsap-card]', section)

      if (heading) {
        gsap.fromTo(
          heading,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 72%' },
          },
        )
      }

      cards.forEach((card, index) => {
        const media = card.querySelector('[data-gsap-media]')
        gsap.fromTo(
          card,
          { y: 100, opacity: 0, rotate: index % 2 ? 1.5 : -1.5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              end: 'top 42%',
              scrub: 0.7,
            },
          },
        )
        if (media) {
          gsap.fromTo(
            media,
            { scale: 1.15 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }
      })

      return () => ScrollTrigger.getAll().forEach((trigger) => trigger.refresh())
    },
    [items, reducedMotion],
    root,
  )

  return (
    <section ref={root} className={cn('bg-[#0b0c10] py-24 text-white md:py-32', className)}>
      <div className="container grid gap-14 lg:grid-cols-[.7fr_1.3fr]">
        <header
          data-gsap-heading
          className={cn('h-fit max-w-lg', pinHeading && 'lg:sticky lg:top-28')}
        >
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          ) : null}
          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">{title}</h2>
          {description ? (
            <p className="mt-6 text-base leading-8 text-white/60">{description}</p>
          ) : null}
        </header>

        <div className="space-y-12 md:space-y-20">
          {items.map((item, index) => (
            <article
              data-gsap-card
              key={item.id}
              className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div data-gsap-media className="absolute inset-0">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <span className="absolute left-6 top-6 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-bold backdrop-blur">
                  {item.number ?? String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="p-7 md:p-9">
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 max-w-2xl leading-7 text-white/60">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
