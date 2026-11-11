'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export type ProductOverlayItem = {
  title: string
  href: string
  image: { src: string; alt: string }
}

export type ProductOverlayCarouselProps = {
  title: string
  items: readonly ProductOverlayItem[]
  /** Trecho final do título destacado na cor da marca. */
  highlight?: string
  eyebrow?: string
  description?: string
  viewAll?: { label: string; href: string }
  itemLabel?: string
  className?: string
}

/** Carrossel de produtos com imagem cheia, título sobreposto e navegação por setas. */
export function ProductOverlayCarousel({
  title,
  items,
  highlight,
  eyebrow,
  description,
  viewAll,
  itemLabel = 'ver mais',
  className,
}: ProductOverlayCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [updateArrows, items.length])

  function scrollByCard(direction: -1 | 1) {
    const track = trackRef.current
    const card = track?.firstElementChild as HTMLElement | null
    if (!track || !card) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  const arrowClass =
    'inline-flex h-11 w-11 items-center justify-center rounded-lg border bg-background text-foreground shadow-sm transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <section className={cn('py-16 md:py-20', className)}>
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              {title}
              {highlight ? <span className="text-primary"> {highlight}</span> : null}
            </h2>
            {description ? (
              <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              className={arrowClass}
              aria-label="Produtos anteriores"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              className={arrowClass}
              aria-label="Próximos produtos"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {viewAll ? (
              <Link
                href={viewAll.href}
                className="ml-1 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {viewAll.label}
              </Link>
            ) : null}
          </div>
        </div>

        <ul
          ref={trackRef}
          onScroll={updateArrows}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li
              key={item.href + item.title}
              className="w-[80%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]"
            >
              <Link
                href={item.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <span className="block text-xl font-bold leading-tight">{item.title}</span>
                  <span className="relative mt-2 inline-block text-sm">
                    {itemLabel}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 group-hover:scale-x-110" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
