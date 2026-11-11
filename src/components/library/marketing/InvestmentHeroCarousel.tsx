'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type CSSProperties } from 'react'
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { A11y, Autoplay, EffectFade, Keyboard, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'

import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'

export type InvestmentHeroSlide = {
  id: string
  eyebrow?: string
  title: string
  subtitle?: string
  description?: string
  image: { src: string; alt: string }
  action?: { label: string; href: string }
}

export type InvestmentHeroCarouselProps = {
  slides: readonly InvestmentHeroSlide[]
  autoplayDelay?: number | false
  scrollLabel?: string | null
  /** Largura/altura do banner. A partir de lg a altura segue a proporção para não cortar a imagem. */
  aspectRatio?: number
  overlay?: boolean
  arrows?: { previous: string; next: string }
  className?: string
}

export function InvestmentHeroCarousel({
  slides,
  autoplayDelay = 6500,
  scrollLabel = 'Explorar conteúdo',
  aspectRatio,
  overlay = true,
  arrows,
  className,
}: InvestmentHeroCarouselProps) {
  const reducedMotion = useReducedMotion()
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)

  if (!slides.length) return null

  const height = aspectRatio
    ? 'min-h-[640px] md:min-h-[88vh] lg:h-full lg:min-h-0'
    : 'min-h-[640px] md:min-h-[88vh]'
  const arrowClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-white/60 text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-[#18221d] text-white',
        aspectRatio
          ? 'min-h-[640px] md:min-h-[88vh] lg:h-[max(30rem,var(--hero-height))] lg:min-h-0'
          : 'min-h-[640px] md:min-h-[88vh]',
        className,
      )}
      style={
        aspectRatio ? ({ '--hero-height': `${100 / aspectRatio}vw` } as CSSProperties) : undefined
      }
    >
      <Swiper
        modules={[A11y, Autoplay, EffectFade, Keyboard, Pagination]}
        onSwiper={setSwiper}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        autoplay={
          autoplayDelay && !reducedMotion
            ? { delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true }
            : false
        }
        loop={slides.length > 1}
        className="absolute inset-0 h-full [&_.swiper-pagination-bullet]:!h-1 [&_.swiper-pagination-bullet]:!w-12 [&_.swiper-pagination-bullet]:!rounded-none [&_.swiper-pagination-bullet]:!bg-white [&_.swiper-pagination]:!bottom-10"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <article className={cn('relative h-full', height)}>
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
              {overlay ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#07120c]/90 via-[#07120c]/45 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07120c]/60 via-transparent to-[#07120c]/15" />
                </>
              ) : null}

              <div
                className={cn(
                  'container relative flex items-start pb-28 pt-20 md:items-center md:py-28',
                  height,
                  aspectRatio && 'lg:py-16',
                )}
              >
                <div className="max-w-4xl">
                  {slide.eyebrow ? (
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/80">
                      {slide.eyebrow}
                    </p>
                  ) : null}
                  <h1 className="mt-6 max-w-4xl font-serif text-3xl leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                    {slide.title}
                  </h1>
                  {slide.subtitle ? (
                    <p className="mt-6 max-w-xl text-xl font-medium leading-8 text-primary">
                      {slide.subtitle}
                    </p>
                  ) : null}
                  {slide.description ? (
                    <p
                      className={cn(
                        'max-w-2xl whitespace-pre-line leading-7 text-white/80',
                        slide.subtitle ? 'mt-2 text-base' : 'mt-7 text-lg leading-8',
                      )}
                    >
                      {slide.description}
                    </p>
                  ) : null}
                  {slide.action ? (
                    <Link
                      href={slide.action.href}
                      className="mt-9 inline-flex items-center gap-3 border-b border-white pb-2 text-sm font-semibold transition hover:gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {slide.action.label}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      {arrows && slides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-[1.6rem] z-10 flex justify-center">
          <div
            className="flex items-center justify-between [&>button]:pointer-events-auto"
            style={{ width: slides.length * 56 + 104 }}
          >
            <button
              type="button"
              aria-label={arrows.previous}
              onClick={() => swiper?.slidePrev()}
              className={arrowClass}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={arrows.next}
              onClick={() => swiper?.slideNext()}
              className={arrowClass}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      {scrollLabel ? (
        <a
          href="#conteudo"
          className="absolute bottom-8 left-6 z-10 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:flex lg:left-12"
        >
          <ArrowDown className="h-4 w-4" aria-hidden />
          {scrollLabel}
        </a>
      ) : null}
    </section>
  )
}
