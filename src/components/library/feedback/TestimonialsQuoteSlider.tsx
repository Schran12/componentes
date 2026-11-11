'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import type { Swiper as SwiperInstance } from 'swiper'
import { A11y, Autoplay, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

import { TestimonialAvatar, type AccentTestimonial } from './TestimonialAvatar'

import 'swiper/css'

export type TestimonialsQuoteSliderProps = {
  title: string
  testimonials: readonly AccentTestimonial[]
  eyebrow?: string
  description?: string
  autoplayDelay?: number
  tone?: AccentTone
  className?: string
}

/** Slider de depoimentos com aspas, avaliação em estrelas, paginação e setas. */
export function TestimonialsQuoteSlider({
  title,
  testimonials,
  eyebrow,
  description,
  autoplayDelay = 5500,
  tone = 'industrial',
  className,
}: TestimonialsQuoteSliderProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'
  const reduced = useReducedMotion()
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const star = isGlow ? 'fill-[#ffb0eb] text-[#ffb0eb]' : 'fill-amber-500 text-amber-500'

  return (
    <section className={cn('relative overflow-hidden', t.section, className)}>
      <div className="container py-14 lg:py-16">
        <EyebrowHeading
          tone={tone}
          eyebrow={eyebrow}
          title={title}
          description={description}
          layout="split"
          className="mb-10 lg:mb-12"
        />

        <Swiper
          modules={[A11y, Autoplay, Keyboard]}
          spaceBetween={0}
          slidesPerView={1}
          loop={testimonials.length > 3}
          keyboard={{ enabled: true }}
          autoplay={reduced ? false : { delay: autoplayDelay, disableOnInteraction: false }}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
          className={cn('border', t.border, isGlow && 'rounded-2xl')}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.name + testimonial.content} className="!h-auto">
              <article
                className={cn(
                  'flex h-full min-h-[22rem] flex-col justify-between border-l p-7 sm:p-8',
                  t.panel,
                  t.border,
                )}
              >
                <div>
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <Quote className={cn('h-8 w-8', t.accent)} strokeWidth={1.5} aria-hidden />
                    {testimonial.rating ? (
                      <div
                        className="flex items-center gap-0.5"
                        role="img"
                        aria-label={`${testimonial.rating} de 5 estrelas`}
                      >
                        {Array.from({ length: testimonial.rating }, (_, index) => (
                          <Star key={index} className={cn('h-3.5 w-3.5', star)} aria-hidden />
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <blockquote className={cn('text-base leading-relaxed', t.body)}>
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>
                </div>
                <div className={cn('mt-8 flex items-center gap-4 border-t pt-6', t.border)}>
                  <TestimonialAvatar
                    name={testimonial.name}
                    src={testimonial.avatar}
                    className={cn('border', t.border, t.accent, isGlow && 'rounded-full')}
                  />
                  <div>
                    <p
                      className={cn(
                        'text-sm font-semibold tracking-wide',
                        !isGlow && 'uppercase',
                        t.strong,
                      )}
                    >
                      {testimonial.name}
                    </p>
                    {testimonial.role ? (
                      <p className={cn('mt-0.5 text-xs uppercase tracking-[0.16em]', t.muted)}>
                        {testimonial.role}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.name + index}
                type="button"
                onClick={() => swiper?.slideToLoop(index)}
                className={cn('py-2', t.focus)}
                aria-label={`Ir para o depoimento ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'block h-0.5 transition-all duration-300',
                    index === activeIndex
                      ? cn('w-10', t.line)
                      : cn(
                          'w-7',
                          isGlow
                            ? 'bg-[#493849]'
                            : tone === 'industrial'
                              ? 'bg-slate-300'
                              : 'bg-white/15',
                        ),
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              className={cn(
                'flex h-10 w-10 items-center justify-center transition-colors',
                t.iconButton,
                t.focus,
              )}
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              className={cn(
                'flex h-10 w-10 items-center justify-center transition-colors',
                t.iconButton,
                t.focus,
              )}
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
