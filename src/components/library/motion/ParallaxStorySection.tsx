'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ParallaxStorySectionProps = {
  eyebrow?: string
  title: string
  description: string
  primaryImage: { src: string; alt: string }
  secondaryImage?: { src: string; alt: string }
  action?: { label: string; href: string }
  depth?: 'subtle' | 'medium' | 'strong'
  tone?: 'light' | 'dark'
  className?: string
}

const depthValues = {
  subtle: 40,
  medium: 80,
  strong: 130,
}

export function ParallaxStorySection({
  eyebrow,
  title,
  description,
  primaryImage,
  secondaryImage,
  action,
  depth = 'medium',
  tone = 'light',
  className,
}: ParallaxStorySectionProps) {
  const root = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ['start end', 'end start'],
  })
  const distance = depthValues[depth]
  const primaryY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [-distance, distance],
  )
  const secondaryY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [distance * 0.7, -distance * 0.7],
  )

  return (
    <section
      ref={root}
      className={cn(
        'relative isolate overflow-hidden py-24 md:py-36',
        tone === 'dark' ? 'bg-slate-950 text-white' : 'bg-background text-foreground',
        className,
      )}
    >
      <div className="container grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
        <div className="relative z-10 max-w-xl">
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          ) : null}
          <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {title}
          </h2>
          <p
            className={cn(
              'mt-6 text-lg leading-8',
              tone === 'dark' ? 'text-white/65' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>
          {action ? (
            <Link
              href={action.href}
              className="mt-8 inline-flex items-center gap-2 rounded-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {action.label}
              <ArrowDownRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className="relative min-h-[620px]">
          <motion.figure
            style={{ y: primaryY }}
            className="absolute left-0 top-16 h-[480px] w-[78%] overflow-hidden rounded-[2.5rem] bg-muted shadow-2xl"
          >
            <Image
              src={primaryImage.src}
              alt={primaryImage.alt}
              fill
              className="scale-110 object-cover"
              sizes="(min-width: 1024px) 45vw, 80vw"
            />
          </motion.figure>

          {secondaryImage ? (
            <motion.figure
              style={{ y: secondaryY }}
              className="absolute bottom-8 right-0 h-72 w-[48%] overflow-hidden rounded-3xl border-8 border-background bg-muted shadow-2xl"
            >
              <Image
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                fill
                className="scale-110 object-cover"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </motion.figure>
          ) : null}
        </div>
      </div>
    </section>
  )
}
