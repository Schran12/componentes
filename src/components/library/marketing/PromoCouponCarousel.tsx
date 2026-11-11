'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PromoSlide = {
  id: string
  title: string
  description?: string
  badge?: string
  coupon?: string
  action?: { label: string; href: string }
  image: { src: string; alt: string }
}

export type PromoCouponCarouselProps = {
  slides: PromoSlide[]
  interval?: number
  couponLabel?: string
  className?: string
}

export function PromoCouponCarousel({
  slides,
  interval = 6000,
  couponLabel = 'Cupom',
  className,
}: PromoCouponCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()
  const total = slides.length
  const slide = slides[index]

  const go = useCallback(
    (step: number) => setIndex((current) => (current + step + total) % total),
    [total],
  )

  useEffect(() => {
    if (paused || reduceMotion || total < 2) return
    const timer = window.setTimeout(() => go(1), interval)
    return () => window.clearTimeout(timer)
  }, [go, index, interval, paused, reduceMotion, total])

  async function copyCoupon(code: string) {
    await navigator.clipboard?.writeText(code)
    setCopied(code)
    window.setTimeout(() => setCopied(null), 2000)
  }

  if (!slide) return null
  const pad = (value: number) => String(value).padStart(2, '0')

  return (
    <section
      className={cn('relative isolate overflow-hidden bg-foreground text-background', className)}
      aria-roledescription="carrossel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 -z-10"
        >
          <Image
            src={slide.image.src}
            alt={slide.image.alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container flex min-h-[32rem] flex-col justify-center py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 24 }}
            transition={{ duration: 0.45 }}
            className="max-w-xl text-white"
            aria-live="polite"
          >
            {slide.badge ? (
              <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                {slide.badge}
              </span>
            ) : null}
            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{slide.title}</h2>
            {slide.description ? (
              <p className="mt-4 text-lg leading-8 text-white/80">{slide.description}</p>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {slide.action ? (
                <a
                  href={slide.action.href}
                  className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                >
                  {slide.action.label}
                </a>
              ) : null}
              {slide.coupon ? (
                <button
                  type="button"
                  onClick={() => copyCoupon(slide.coupon as string)}
                  className="inline-flex items-center gap-3 rounded-full border border-dashed border-white/60 px-5 py-3 text-sm transition hover:border-white hover:bg-white/10"
                >
                  <span className="text-white/70">{couponLabel}</span>
                  <strong className="font-mono tracking-wider">{slide.coupon}</strong>
                  {copied === slide.coupon ? (
                    <Check className="h-4 w-4 text-green-400" aria-label="Copiado" />
                  ) : (
                    <Copy className="h-4 w-4" aria-label="Copiar cupom" />
                  )}
                </button>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>

        {total > 1 ? (
          <div className="mt-12 flex items-center gap-4 text-white">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition hover:bg-white hover:text-black"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-mono text-sm tabular-nums">
              {pad(index + 1)}/{pad(total)}
            </span>
            <div className="h-0.5 w-32 overflow-hidden rounded bg-white/25">
              <motion.div
                key={`${slide.id}-${paused}`}
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: paused || reduceMotion ? '0%' : '100%' }}
                transition={{ duration: interval / 1000, ease: 'linear' }}
              />
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition hover:bg-white hover:text-black"
              aria-label="Próximo slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
