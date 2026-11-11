'use client'

import { useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Swiper as SwiperInstance } from 'swiper'
import { A11y, Autoplay, EffectFade, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { AccentButton } from '@/components/library/primitives/AccentButton'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/effect-fade'

export type ProgressBannerSlide = {
  id: string
  title: string
  image: { src: string; alt: string }
  mobileImage?: string
  eyebrow?: string
  subtitle?: string
  description?: string
  action?: { label: string; href: string }
}

export type ProgressBannerSocialLink = {
  label: string
  href: string
  icon: ReactNode
}

export type ProgressBannerCarouselProps = {
  slides: readonly ProgressBannerSlide[]
  tone?: AccentTone
  autoplayDelay?: number
  showArrows?: boolean
  socialLinks?: readonly ProgressBannerSocialLink[]
  className?: string
}

const overlays: Record<AccentTone, string[]> = {
  glow: [
    'bg-gradient-to-r from-[#121212]/95 via-[#121212]/60 to-[#221d2f]/20',
    'bg-gradient-to-t from-[#121212]/80 via-transparent to-[#121212]/40',
  ],
  industrial: [
    'bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/25',
    'bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30',
  ],
  'industrial-dark': [
    'bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/25',
    'bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30',
  ],
}

/** Banner em tela cheia com fade, barras de progresso do autoplay e trilho de redes sociais. */
export function ProgressBannerCarousel({
  slides,
  tone = 'glow',
  autoplayDelay = 6000,
  showArrows = true,
  socialLinks = [],
  className,
}: ProgressBannerCarouselProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'
  const reducedMotion = useReducedMotion()
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const progressRefs = useRef<(HTMLSpanElement | null)[]>([])

  const resetProgress = (): void => {
    progressRefs.current.forEach((element) => {
      if (element) element.style.transform = 'scaleX(0)'
    })
  }

  const textReveal = (isActive: boolean, delay: number) => ({
    className: cn(
      'transition-all duration-700 ease-out motion-reduce:transition-none',
      isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
    ),
    style: { transitionDelay: isActive ? `${delay}ms` : '0ms' },
  })

  return (
    <section
      className={cn('relative h-[86svh] w-full overflow-hidden', t.section, className)}
      aria-roledescription="carrossel"
    >
      {!isGlow ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-32 bg-gradient-to-t from-slate-950 from-15% via-slate-950/70 to-transparent md:h-40"
          aria-hidden
        />
      ) : null}

      <Swiper
        modules={[A11y, Autoplay, EffectFade, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1100}
        loop={slides.length > 1}
        keyboard={{ enabled: true }}
        autoplay={
          reducedMotion || slides.length < 2
            ? false
            : { delay: autoplayDelay, disableOnInteraction: false }
        }
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        onSlideChangeTransitionStart={resetProgress}
        onAutoplayTimeLeft={(instance, _timeLeft, percentage) => {
          const element = progressRefs.current[instance.realIndex]
          if (element) {
            element.style.transform = `scaleX(${Math.max(0, Math.min(1, 1 - percentage))})`
          }
        }}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="!h-full">
            {({ isActive }) => (
              <div className="relative h-full w-full">
                <Image
                  src={slide.image.src}
                  alt={slide.image.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={cn('object-cover', slide.mobileImage && 'hidden md:block')}
                />
                {slide.mobileImage ? (
                  <Image
                    src={slide.mobileImage}
                    alt={slide.image.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="block object-cover md:hidden"
                  />
                ) : null}
                {overlays[tone].map((overlay) => (
                  <div key={overlay} className={cn('absolute inset-0', overlay)} aria-hidden />
                ))}

                <div className="absolute inset-0 flex items-center pb-28 pt-6 md:pb-24 md:pt-0">
                  <div className="container relative z-10 md:pr-20 lg:pr-24">
                    <div className="max-w-xl text-left text-white md:max-w-2xl">
                      {slide.eyebrow ? (
                        <div {...textReveal(isActive, 150)}>
                          <div className="mb-4 flex items-center gap-3 md:mb-5">
                            <span className={cn('h-px w-8 md:w-10', t.line)} aria-hidden />
                            <span
                              className={cn(
                                'text-[0.65rem] font-medium uppercase tracking-[0.28em] md:text-xs',
                                isGlow ? 'text-[#ffb0eb]' : 'text-amber-500',
                              )}
                            >
                              {slide.eyebrow}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      <div {...textReveal(isActive, 300)}>
                        {(() => {
                          const Title = index === 0 ? 'h1' : 'p'
                          return (
                            <Title
                              className={cn(
                                'mb-3 text-[1.75rem] font-semibold leading-[1.2] sm:text-3xl md:mb-4 md:text-5xl lg:text-[3.5rem]',
                                isGlow
                                  ? 'w-fit bg-gradient-to-r from-[#c642a5] via-[#ffb0eb] to-[#7c39cf] bg-clip-text text-transparent'
                                  : 'uppercase leading-[1.15] tracking-wide',
                              )}
                            >
                              {slide.title}
                            </Title>
                          )
                        })()}
                      </div>

                      {slide.subtitle ? (
                        <div {...textReveal(isActive, 450)}>
                          <p className="mb-3 text-base font-medium leading-snug text-white md:mb-4 md:text-xl lg:text-2xl">
                            {slide.subtitle}
                          </p>
                        </div>
                      ) : null}

                      {slide.description ? (
                        <div {...textReveal(isActive, 600)}>
                          <p
                            className={cn(
                              'mb-6 max-w-md text-sm leading-relaxed md:mb-8 md:max-w-lg md:text-base lg:text-lg',
                              isGlow ? 'text-[#c1c1c1]' : 'text-slate-300/90',
                            )}
                          >
                            {slide.description}
                          </p>
                        </div>
                      ) : null}

                      {slide.action ? (
                        <div {...textReveal(isActive, 750)}>
                          <AccentButton
                            href={slide.action.href}
                            tone={isGlow ? 'glow' : 'industrial-dark'}
                            size={isGlow ? 'md' : 'lg'}
                          >
                            {slide.action.label}
                          </AccentButton>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {slides.length > 1 ? (
        <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 md:bottom-10 md:gap-4">
          {showArrows ? (
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center transition-colors',
                t.iconButton,
                t.focus,
              )}
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}

          <div className="flex items-center gap-2">
            {slides.map((slide, index) => {
              const active = index === activeIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => swiper?.slideToLoop(index)}
                  className={cn('inline-flex items-center py-2', t.focus)}
                  aria-label={`Ir para o slide ${index + 1}`}
                  aria-current={active ? 'true' : undefined}
                >
                  <span
                    className={cn(
                      'relative block h-0.5 overflow-hidden bg-white/35 transition-[width] duration-300',
                      active ? 'w-[3.25rem] bg-white/25' : 'w-10',
                    )}
                  >
                    <span
                      ref={(element) => {
                        progressRefs.current[index] = element
                      }}
                      className={cn(
                        'absolute inset-0 origin-left scale-x-0',
                        isGlow ? t.line : 'bg-amber-500',
                        reducedMotion && active && 'scale-x-100',
                      )}
                    />
                  </span>
                </button>
              )
            })}
          </div>

          {showArrows ? (
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center transition-colors',
                t.iconButton,
                t.focus,
              )}
              aria-label="Próximo slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      ) : null}

      {socialLinks.length ? (
        <aside
          className="absolute right-4 top-[42%] z-40 hidden -translate-y-1/2 md:right-6 md:block lg:right-8"
          aria-label="Redes sociais"
        >
          <div className="flex flex-col items-center gap-5">
            <span
              className={cn(
                'w-px',
                isGlow
                  ? 'h-14 bg-gradient-to-b from-transparent via-[#c642a5] to-transparent'
                  : 'h-7 bg-white/80',
              )}
              aria-hidden
            />
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={cn(
                  'text-white transition-colors duration-300 [&_svg]:h-[15px] [&_svg]:w-[15px]',
                  isGlow ? 'hover:text-[#ffb0eb]' : 'hover:text-amber-500',
                  t.focus,
                )}
              >
                {item.icon}
              </a>
            ))}
            <span
              className={cn(
                'w-px',
                isGlow
                  ? 'h-14 bg-gradient-to-b from-transparent via-[#7c39cf] to-transparent'
                  : 'h-7 bg-white/80',
              )}
              aria-hidden
            />
          </div>
        </aside>
      ) : null}
    </section>
  )
}
