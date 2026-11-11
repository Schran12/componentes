'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { A11y, EffectCreative, Keyboard, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'

import { cn } from '@/lib/utils'

import { useReducedMotion } from './useReducedMotion'

import 'swiper/css'
import 'swiper/css/effect-creative'
import 'swiper/css/pagination'

export type SwiperShowcaseItem = {
  id: string
  eyebrow?: string
  title: string
  description: string
  image: { src: string; alt: string }
  action?: { label: string; href: string }
}

export type SwiperShowcaseSectionProps = {
  title?: string
  description?: string
  items: readonly SwiperShowcaseItem[]
  theme?: 'light' | 'dark'
  className?: string
}

export function SwiperShowcaseSection({
  title,
  description,
  items,
  theme = 'light',
  className,
}: SwiperShowcaseSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const reducedMotion = useReducedMotion()
  const dark = theme === 'dark'

  return (
    <section
      className={cn(
        'overflow-hidden py-20 md:py-28',
        dark ? 'bg-slate-950 text-white' : 'bg-background',
        className,
      )}
    >
      <div className="container">
        {title || description ? (
          <header className="mb-10 max-w-2xl">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
            ) : null}
            {description ? (
              <p className={cn('mt-4 leading-7', dark ? 'text-white/60' : 'text-muted-foreground')}>
                {description}
              </p>
            ) : null}
          </header>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
            {items.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => swiper?.slideTo(index)}
                aria-pressed={activeIndex === index}
                className={cn(
                  'min-w-52 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:min-w-0',
                  activeIndex === index
                    ? dark
                      ? 'border-white/40 bg-white/10'
                      : 'border-primary bg-primary/5'
                    : dark
                      ? 'border-white/10 text-white/55 hover:bg-white/5'
                      : 'text-muted-foreground hover:border-primary/30',
                )}
              >
                <span className="text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-2 block font-semibold">{item.title}</span>
              </button>
            ))}
          </div>

          <Swiper
            modules={[A11y, EffectCreative, Keyboard, Pagination]}
            effect={reducedMotion ? 'slide' : 'creative'}
            creativeEffect={{
              prev: { shadow: true, translate: ['-12%', 0, -220], opacity: 0 },
              next: { translate: ['100%', 0, 0] },
            }}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            onSwiper={setSwiper}
            onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
            className="w-full overflow-hidden rounded-[2rem]"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <article className="relative min-h-[600px] overflow-hidden rounded-[2rem] bg-slate-900 text-white">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 70vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20" />
                  <div className="absolute inset-x-0 bottom-0 p-7 md:p-12">
                    {item.eyebrow ? (
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                        {item.eyebrow}
                      </p>
                    ) : null}
                    <h3 className="mt-3 text-3xl font-bold md:text-5xl">{item.title}</h3>
                    <p className="mt-4 max-w-2xl leading-7 text-white/65">{item.description}</p>
                    {item.action ? (
                      <Link
                        href={item.action.href}
                        className="mt-6 inline-flex items-center gap-2 rounded-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {item.action.label}
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </Link>
                    ) : null}
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
