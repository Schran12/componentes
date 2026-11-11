import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type AboutGalleryImage = {
  src: string
  alt: string
}

export type AboutGalleryProps = {
  eyebrow?: string
  title: string
  description: string
  images: readonly AboutGalleryImage[]
  variant?: 'mosaic' | 'gallery' | 'editorial'
  stats?: readonly { value: string; label: string }[]
  action?: { label: string; href: string }
  mediaPosition?: 'left' | 'right'
  className?: string
}

export function AboutGallery({
  eyebrow,
  title,
  description,
  images,
  variant = 'mosaic',
  stats = [],
  action,
  mediaPosition = 'left',
  className,
}: AboutGalleryProps) {
  const visibleImages = images.slice(0, variant === 'gallery' ? 4 : 3)

  return (
    <section className={cn('overflow-hidden py-16 md:py-24', className)}>
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          className={cn(
            'grid min-h-[460px] gap-3',
            variant === 'mosaic' && 'grid-cols-2 grid-rows-2',
            variant === 'gallery' && 'grid-cols-2 grid-rows-2',
            variant === 'editorial' && 'grid-cols-[1fr_.48fr] grid-rows-2',
            mediaPosition === 'right' && 'lg:order-2',
          )}
        >
          {visibleImages.map((image, index) => (
            <figure
              key={`${image.src}-${index}`}
              className={cn(
                'relative min-h-52 overflow-hidden rounded-3xl bg-muted',
                variant === 'mosaic' && index === 0 && 'row-span-2',
                variant === 'editorial' && index === 0 && 'row-span-2',
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(min-width: 1024px) 30vw, 50vw"
              />
            </figure>
          ))}
        </div>

        <div className={cn('max-w-xl', mediaPosition === 'right' && 'lg:order-1')}>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          ) : null}
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
          <p className="mt-6 text-base leading-8 text-muted-foreground">{description}</p>

          {stats.length ? (
            <dl className="mt-8 grid grid-cols-2 gap-5 border-y py-6 sm:grid-cols-3">
              {stats.slice(0, 3).map((stat) => (
                <div key={`${stat.value}-${stat.label}`}>
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 text-2xl font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {action ? (
            <Link
              href={action.href}
              className="mt-8 inline-flex items-center gap-2 rounded-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {action.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
