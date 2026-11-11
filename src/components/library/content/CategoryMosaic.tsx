import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type CategoryMosaicItem = {
  id: string
  label: string
  href: string
  image: { src: string; alt: string }
  size?: 'standard' | 'tall' | 'wide'
}

export type CategoryMosaicProps = {
  items: readonly CategoryMosaicItem[]
  title?: string
  description?: string
  labelStyle?: 'card' | 'glass' | 'plain'
  rounded?: boolean
  className?: string
}

export function CategoryMosaic({
  items,
  title,
  description,
  labelStyle = 'card',
  rounded = true,
  className,
}: CategoryMosaicProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'category-mosaic-title' : undefined}
    >
      <div className="container">
        {title || description ? (
          <header className="mb-10 max-w-2xl">
            {title ? (
              <h2
                id="category-mosaic-title"
                className="text-3xl font-bold tracking-tight md:text-5xl"
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </header>
        ) : null}

        <div className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const inferredSize = item.size ?? (index < 2 ? 'tall' : 'standard')

            return (
              <Link
                href={item.href}
                key={item.id}
                className={cn(
                  'group relative isolate flex overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  rounded && 'rounded-2xl',
                  inferredSize === 'tall' && 'sm:row-span-2',
                  inferredSize === 'wide' && 'sm:col-span-2',
                )}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/25" />
                <span
                  className={cn(
                    'relative m-auto inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-[0.24em] transition duration-300 group-hover:scale-105',
                    labelStyle === 'card' && 'bg-white text-slate-950 shadow-xl',
                    labelStyle === 'glass' &&
                      'border border-white/30 bg-black/25 text-white backdrop-blur-md',
                    labelStyle === 'plain' && 'text-white drop-shadow-lg',
                    rounded && labelStyle !== 'plain' && 'rounded-lg',
                  )}
                >
                  {item.label}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100"
                    aria-hidden
                  />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
