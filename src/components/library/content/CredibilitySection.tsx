'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type CredibilityStat = { value: number; suffix?: string; label: string }
export type CredibilityReason = { title: string; description: string }

export type CredibilitySectionProps = {
  title: string
  description?: string
  stats?: CredibilityStat[]
  reasons: CredibilityReason[]
  image?: { src: string; alt: string }
  caption?: string
  className?: string
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (!inView || reduceMotion) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, value])

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  )
}

export function CredibilitySection({
  title,
  description,
  stats = [],
  reasons,
  image,
  caption,
  className,
}: CredibilitySectionProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {stats.length ? (
          <dl className="mt-10 grid gap-6 border-y py-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-5xl font-bold text-primary">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </dd>
                <dd className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className={cn('mt-12 grid gap-10', image && 'lg:grid-cols-[0.8fr_1.2fr]')}>
          {image ? (
            <figure className="lg:sticky lg:top-24 lg:self-start">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 35vw, 100vw"
                />
              </div>
              {caption ? (
                <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>
              ) : null}
            </figure>
          ) : null}
          <ol className="grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2">
            {reasons.map((reason, index) => (
              <motion.li
                key={reason.title}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: (index % 2) * 0.1 }}
                className="group bg-background p-6 transition hover:bg-primary/5"
              >
                <span className="font-mono text-sm font-bold text-primary transition group-hover:tracking-widest">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{reason.description}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
