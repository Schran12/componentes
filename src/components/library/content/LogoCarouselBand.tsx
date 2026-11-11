'use client'

import Image from 'next/image'
import { A11y, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

import 'swiper/css'

export type LogoCarouselBandLogo = {
  name: string
  src: string
  href?: string
}

export type LogoCarouselBandProps = {
  logos: readonly LogoCarouselBandLogo[]
  title?: string
  eyebrow?: string
  description?: string
  monochrome?: boolean
  autoplayDelay?: number
  tone?: AccentTone
  className?: string
}

/** Faixa de logos em carrossel contínuo com divisórias e realce no hover. */
export function LogoCarouselBand({
  logos,
  title,
  eyebrow,
  description,
  monochrome = true,
  autoplayDelay = 2200,
  tone = 'glow',
  className,
}: LogoCarouselBandProps) {
  const t = getAccentTone(tone)
  const reduced = useReducedMotion()
  const light = tone === 'industrial'
  const items = logos.length < 8 ? [...logos, ...logos] : logos

  return (
    <section className={cn('relative overflow-hidden', t.section, className)}>
      <div className="container py-14 lg:py-16">
        {title ? (
          <EyebrowHeading
            tone={tone}
            eyebrow={eyebrow}
            title={title}
            description={description}
            layout="split"
            className="mb-10 lg:mb-12"
          />
        ) : null}

        <div
          className={cn(
            'overflow-hidden border',
            t.border,
            t.panel,
            tone === 'glow' && 'rounded-md',
          )}
        >
          <Swiper
            modules={[A11y, Autoplay]}
            spaceBetween={0}
            slidesPerView={2}
            loop
            speed={800}
            autoplay={reduced ? false : { delay: autoplayDelay, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {items.map((logo, index) => {
              const content = (
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={140}
                  height={64}
                  className={cn(
                    'max-h-12 w-auto object-contain opacity-70 transition-all duration-500 group-hover:opacity-100',
                    monochrome &&
                      (light ? 'grayscale group-hover:grayscale-0' : 'brightness-0 invert'),
                  )}
                />
              )
              return (
                <SwiperSlide key={`${logo.name}-${index}`}>
                  <div
                    className={cn(
                      'group flex h-28 items-center justify-center border-l px-6 transition-colors duration-300',
                      t.border,
                      light ? 'hover:bg-slate-50' : 'hover:bg-white/5',
                    )}
                  >
                    {logo.href ? (
                      <a
                        href={logo.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={logo.name}
                        className={t.focus}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </div>
    </section>
  )
}
