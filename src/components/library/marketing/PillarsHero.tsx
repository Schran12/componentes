'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PillarsHeroProps = {
  title: string
  description?: string
  eyebrow?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  chips?: string[]
  pillars?: Array<{ title: string; description: string; icon?: ReactNode }>
  image: { src: string; alt: string }
  stat?: { value: string; label: string }
  className?: string
}

export function PillarsHero({
  title,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  chips = [],
  pillars = [],
  image,
  stat,
  className,
}: PillarsHeroProps) {
  const reduceMotion = useReducedMotion()
  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        }

  return (
    <section className={cn('relative overflow-hidden py-16 md:py-24', className)}>
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="container grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {eyebrow ? (
            <motion.p
              {...enter(0)}
              className="font-mono text-sm font-semibold uppercase tracking-widest text-primary"
            >
              {'// '}
              {eyebrow}
            </motion.p>
          ) : null}
          <motion.h1
            {...enter(0.08)}
            className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
          {description ? (
            <motion.p
              {...enter(0.16)}
              className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
            >
              {description}
            </motion.p>
          ) : null}
          {primaryAction || secondaryAction ? (
            <motion.div {...enter(0.24)} className="mt-8 flex flex-wrap gap-3">
              {primaryAction ? (
                <a
                  href={primaryAction.href}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                >
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              ) : null}
              {secondaryAction ? (
                <a
                  href={secondaryAction.href}
                  className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  {secondaryAction.label}
                </a>
              ) : null}
            </motion.div>
          ) : null}
          {chips.length ? (
            <motion.ul {...enter(0.32)} className="mt-8 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li
                  key={chip}
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {chip}
                </li>
              ))}
            </motion.ul>
          ) : null}
        </div>

        <motion.div {...enter(0.2)} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted shadow-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          {stat ? (
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 left-4 max-w-[14rem] rounded-2xl bg-primary p-5 text-primary-foreground shadow-xl md:-left-8"
            >
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm opacity-85">{stat.label}</p>
            </motion.div>
          ) : null}
        </motion.div>
      </div>

      {pillars.length ? (
        <div className="container mt-16">
          <ul className="grid gap-px overflow-hidden rounded-2xl border bg-border md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <motion.li
                key={pillar.title}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-background p-6 transition hover:bg-primary/5"
              >
                {pillar.icon ? (
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    {pillar.icon}
                  </span>
                ) : null}
                <h2 className="text-lg font-semibold">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.description}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
