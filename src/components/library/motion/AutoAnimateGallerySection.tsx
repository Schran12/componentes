'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import { useReducedMotion } from './useReducedMotion'

export type AutoAnimateGalleryItem = {
  id: string
  title: string
  category: string
  description?: string
  image: { src: string; alt: string }
  href?: string
}

export type AutoAnimateGallerySectionProps = {
  title?: string
  description?: string
  items: readonly AutoAnimateGalleryItem[]
  allLabel?: string
  columns?: 2 | 3 | 4
  className?: string
}

export function AutoAnimateGallerySection({
  title,
  description,
  items,
  allLabel = 'Todos',
  columns = 3,
  className,
}: AutoAnimateGallerySectionProps) {
  const [category, setCategory] = useState('all')
  const reducedMotion = useReducedMotion()
  const [gridRef, enableAnimations] = useAutoAnimate<HTMLDivElement>({
    duration: 320,
    easing: 'ease-out',
  })
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))), [items])
  const visibleItems =
    category === 'all' ? items : items.filter((item) => item.category === category)
  const columnsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  useEffect(() => {
    enableAnimations(!reducedMotion)
  }, [enableAnimations, reducedMotion])

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <header className="max-w-2xl">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </header>
          <div
            className="flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] max-sm:flex-wrap [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filtrar galeria"
          >
            {[
              { value: 'all', label: allLabel },
              ...categories.map((item) => ({ value: item, label: item })),
            ].map((filter) => (
              <button
                type="button"
                key={filter.value}
                onClick={() => setCategory(filter.value)}
                aria-pressed={category === filter.value}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  category === filter.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background hover:border-primary/40 hover:text-primary',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className={cn('mt-10 grid gap-5', columnsClass)}>
          {visibleItems.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                'group overflow-hidden rounded-3xl border bg-card shadow-sm',
                columns !== 4 && index === 0 && visibleItems.length > 2 && 'md:col-span-2',
              )}
            >
              <div
                className={cn(
                  'relative overflow-hidden bg-muted',
                  index === 0 && visibleItems.length > 2 && columns !== 4
                    ? 'aspect-[4/3] md:aspect-[16/8]'
                    : 'aspect-[4/3]',
                )}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold backdrop-blur">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    Explorar <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
