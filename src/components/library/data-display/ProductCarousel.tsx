'use client'

import { A11y, Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

import { ProductCard, type ProductCardItem, type ProductCardVariant } from './ProductCard'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export type ProductCarouselProps = {
  products: ProductCardItem[]
  title?: string
  description?: string
  cardVariant?: ProductCardVariant
  slidesPerView?: 2 | 3 | 4
  autoplayDelay?: number | false
  actionLabel?: string
  showFavorite?: boolean
  onAddToCart?: (product: ProductCardItem) => void
  onFavorite?: (product: ProductCardItem) => void
  className?: string
}

export function ProductCarousel({
  products,
  title,
  description,
  cardVariant = 'classic',
  slidesPerView = 4,
  autoplayDelay = false,
  actionLabel,
  showFavorite,
  onAddToCart,
  onFavorite,
  className,
}: ProductCarouselProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section
      className={cn('overflow-hidden py-16 md:py-24', className)}
      aria-labelledby={title ? 'product-carousel-title' : undefined}
    >
      <div className="container">
        {title || description ? (
          <header className="mb-10 max-w-2xl">
            {title ? (
              <h2
                id="product-carousel-title"
                className="text-3xl font-bold tracking-tight md:text-4xl"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </header>
        ) : null}

        <Swiper
          modules={[A11y, Autoplay, Keyboard, Navigation, Pagination]}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          keyboard={{ enabled: true }}
          autoplay={
            autoplayDelay && !reducedMotion
              ? { delay: autoplayDelay, pauseOnMouseEnter: true, disableOnInteraction: true }
              : false
          }
          spaceBetween={24}
          slidesPerView={1.12}
          breakpoints={{
            640: { slidesPerView: Math.min(2, slidesPerView) },
            1024: { slidesPerView: Math.min(3, slidesPerView) },
            1280: { slidesPerView },
          }}
          className="!overflow-visible !pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard
                product={product}
                variant={cardVariant}
                actionLabel={actionLabel}
                showFavorite={showFavorite}
                onAddToCart={onAddToCart}
                onFavorite={onFavorite}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
