'use client'

import Image from 'next/image'
import { A11y, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Quote } from 'lucide-react'
import type { Testimonial } from './TestimonialsGrid'
import { cn } from '@/lib/utils'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export type TestimonialsCarouselProps = {
  title?: string
  testimonials: Testimonial[]
  className?: string
  label?: string
}

export function TestimonialsCarousel({
  title,
  testimonials,
  className,
  label = 'Depoimentos de clientes',
}: TestimonialsCarouselProps) {
  return (
    <section className={cn('py-16 md:py-24', className)} aria-label={label}>
      <div className="container">
        {title ? (
          <h2 className="mb-10 text-center text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}
        <Swiper
          modules={[A11y, Keyboard, Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          spaceBetween={24}
          slidesPerView={1}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={`${testimonial.name}-${index}`}>
              <figure className="mx-auto max-w-3xl px-12 pb-12 text-center">
                <Quote className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
                <blockquote className="mt-5 text-xl leading-9 md:text-2xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center justify-center gap-3">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt=""
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : null}
                  <span className="text-left">
                    <span className="block font-semibold">{testimonial.name}</span>
                    <span className="block text-sm text-muted-foreground">
                      {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
