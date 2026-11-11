'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { A11y, Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export type HeroCarouselSlide = {
  id: string
  title: string
  description?: string
  image: { src: string; alt: string }
  action?: { label: string; href: string }
}

export type HeroCarouselProps = {
  slides: HeroCarouselSlide[]
  autoplayDelay?: number | false
  className?: string
  label?: string
}

export function HeroCarousel({
  slides,
  autoplayDelay = 6000,
  className,
  label = 'Destaques',
}: HeroCarouselProps) {
  const reducedMotion = useReducedMotion()
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [paused, setPaused] = useState(false)
  const canAutoplay = Boolean(autoplayDelay) && !reducedMotion

  function toggleAutoplay() {
    if (!swiper) return
    if (paused) swiper.autoplay.start()
    else swiper.autoplay.stop()
    setPaused((current) => !current)
  }

  return (
    <section className={cn('relative bg-slate-950 text-white', className)} aria-label={label}>
      <Swiper
        modules={[A11y, Autoplay, Keyboard, Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        autoplay={
          canAutoplay
            ? { delay: Number(autoplayDelay), disableOnInteraction: true, pauseOnMouseEnter: true }
            : false
        }
        loop={slides.length > 1}
        a11y={{ enabled: true }}
        onSwiper={setSwiper}
        className="min-h-[560px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <article className="relative flex min-h-[560px] items-center">
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                priority={index === 0}
                className="object-cover opacity-50"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
              <div className="container relative z-10 py-20">
                <h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
                  {slide.title}
                </h2>
                {slide.description ? (
                  <p className="mt-5 max-w-2xl text-lg text-white/80">{slide.description}</p>
                ) : null}
                {slide.action ? (
                  <Button asChild size="lg" className="mt-8">
                    <Link href={slide.action.href}>{slide.action.label}</Link>
                  </Button>
                ) : null}
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
      {canAutoplay ? (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute bottom-5 right-5 z-20 rounded-full shadow-lg"
          onClick={toggleAutoplay}
          aria-label={paused ? 'Retomar carrossel' : 'Pausar carrossel'}
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      ) : null}
    </section>
  )
}
