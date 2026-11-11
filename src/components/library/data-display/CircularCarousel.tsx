'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

export type CircularCarouselItem = {
  image: { src: string; alt: string }
  title: string
  description?: string
}

export type CircularCarouselProps = {
  items: CircularCarouselItem[]
  autoplay?: boolean
  interval?: number
  cardWidth?: number
  ariaLabel?: string
  className?: string
}

export function CircularCarousel({
  items,
  autoplay = true,
  interval = 3500,
  cardWidth = 200,
  ariaLabel = 'Carrossel circular',
  className,
}: CircularCarouselProps) {
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const dragStart = useRef<number | null>(null)

  const count = items.length
  const angle = 360 / Math.max(count, 1)
  const radius = Math.round(cardWidth / 2 / Math.tan(Math.PI / Math.max(count, 3)) + 24)
  const active = ((step % count) + count) % count

  useEffect(() => {
    if (!autoplay || paused || reduced || count < 2) return
    const timer = window.setInterval(() => setStep((value) => value + 1), interval)
    return () => window.clearInterval(timer)
  }, [autoplay, count, interval, paused, reduced])

  if (!count) return null

  const go = (delta: number) => setStep((value) => value + delta)

  return (
    <section
      aria-roledescription="carrossel"
      aria-label={ariaLabel}
      className={cn('relative w-full overflow-hidden py-6', className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false)
        dragStart.current = null
      }}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1)
        if (event.key === 'ArrowLeft') go(-1)
      }}
    >
      <div
        className="relative mx-auto flex h-[22rem] cursor-grab touch-pan-y select-none items-center justify-center [perspective:1100px] active:cursor-grabbing"
        onPointerDown={(event) => {
          dragStart.current = event.clientX
        }}
        onPointerUp={(event) => {
          if (dragStart.current === null) return
          const delta = event.clientX - dragStart.current
          if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1)
          dragStart.current = null
        }}
      >
        <div
          className={cn(
            'relative h-64 [transform-style:preserve-3d]',
            !reduced && 'transition-transform duration-700',
          )}
          style={{
            width: cardWidth,
            transform: `translateZ(${-radius}px) rotateY(${-step * angle}deg)`,
            transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
          }}
        >
          {items.map((item, index) => {
            const isActive = index === active
            return (
              <figure
                key={item.title}
                aria-hidden={!isActive}
                className={cn(
                  'absolute inset-0 overflow-hidden rounded-2xl border bg-card shadow-xl transition duration-500 [backface-visibility:hidden]',
                  isActive ? 'opacity-100' : 'opacity-60',
                )}
                style={{ transform: `rotateY(${index * angle}deg) translateZ(${radius}px)` }}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes={`${cardWidth}px`}
                  draggable={false}
                  className="object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10 text-sm font-semibold text-white">
                  {item.title}
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>

      <div className="mx-auto mt-2 flex max-w-md flex-col items-center text-center">
        <div aria-live="polite" className="min-h-14">
          <p className="font-semibold">{items[active].title}</p>
          {items[active].description ? (
            <p className="mt-1 text-sm text-muted-foreground">{items[active].description}</p>
          ) : null}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {items.map((item, index) => (
              <button
                type="button"
                key={item.title}
                onClick={() => go(index - active)}
                aria-label={`Ir para ${item.title}`}
                aria-current={index === active}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === active
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Próximo"
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-background transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
