'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { A11y, Autoplay, Keyboard, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/navigation'

export type ServiceCarouselItem = {
  id: string
  title: string
  description: string
  href: string
  image?: { src: string; alt: string }
  icon?: React.ReactNode
}

export type ServicesCarouselSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  items: readonly ServiceCarouselItem[]
  action?: { label: string; href: string }
  autoplayDelay?: number | false
  className?: string
}

export function ServicesCarouselSection({
  eyebrow,
  title,
  description,
  items,
  action,
  autoplayDelay = false,
  className,
}: ServicesCarouselSectionProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section className={cn('overflow-hidden bg-[#f4f0f6] py-20 md:py-28', className)}>
      <div className="container">
        <header className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#752871]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#10100e] md:text-5xl">
              {title}
            </h2>
            {description ? (
              <p className="mt-5 max-w-2xl leading-7 text-[#5a5560]">{description}</p>
            ) : null}
          </div>
          {action ? (
            <Link
              href={action.href}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#752871]/20 bg-white px-5 py-3 text-sm font-semibold text-[#752871] transition hover:border-[#752871]/40 hover:shadow-md"
            >
              {action.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
        </header>

        <Swiper
          modules={[A11y, Autoplay, Keyboard, Navigation]}
          navigation
          keyboard={{ enabled: true }}
          autoplay={
            autoplayDelay && !reducedMotion
              ? { delay: autoplayDelay, pauseOnMouseEnter: true, disableOnInteraction: true }
              : false
          }
          spaceBetween={20}
          slidesPerView={1.08}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 3.4 },
          }}
          className="mt-12 !overflow-visible !pb-3"
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.id} className="h-auto">
              <article className="group flex h-full min-h-[480px] flex-col overflow-hidden rounded-[2rem] border border-[#752871]/10 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold tracking-[0.2em] text-[#752871]">
                    {String(index + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
                  </span>
                  {item.icon ? (
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#752871]/10 text-[#752871]">
                      {item.icon}
                    </span>
                  ) : null}
                </div>

                {item.image ? (
                  <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-2xl bg-[#ede8ef]">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 1024px) 30vw, 80vw"
                    />
                  </div>
                ) : (
                  <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-2xl bg-[#3f2644]">
                    <span className="absolute -bottom-12 -right-8 h-44 w-44 rounded-full bg-[#752871]" />
                    <span className="absolute -left-8 top-8 h-32 w-32 rounded-[40%_60%] bg-[#9b4b96]" />
                  </div>
                )}

                <h3 className="mt-7 text-2xl font-semibold text-[#10100e]">{item.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5a5560]">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#752871]"
                >
                  Leia mais
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
