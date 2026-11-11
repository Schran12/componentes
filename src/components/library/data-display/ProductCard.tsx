'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, ShoppingBag, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ProductCardVariant = 'classic' | 'minimal' | 'horizontal' | 'overlay'

export type ProductCardItem = {
  id: string
  name: string
  description?: string
  image: { src: string; alt: string }
  href: string
  price?: string
  previousPrice?: string
  badge?: string
  rating?: number
}

export type ProductCardProps = {
  product: ProductCardItem
  variant?: ProductCardVariant
  actionLabel?: string
  showFavorite?: boolean
  onAddToCart?: (product: ProductCardItem) => void
  onFavorite?: (product: ProductCardItem) => void
  className?: string
}

export function ProductCard({
  product,
  variant = 'classic',
  actionLabel = 'Adicionar',
  showFavorite = false,
  onAddToCart,
  onFavorite,
  className,
}: ProductCardProps) {
  const horizontal = variant === 'horizontal'
  const overlay = variant === 'overlay'

  return (
    <article
      className={cn(
        'group relative flex h-full min-w-0 overflow-hidden rounded-3xl bg-card transition-all duration-500',
        variant === 'classic' && 'flex-col border shadow-sm hover:-translate-y-1 hover:shadow-xl',
        variant === 'minimal' && 'flex-col rounded-none border-0 bg-transparent',
        horizontal && 'min-h-56 flex-row border shadow-sm hover:border-primary/40',
        overlay && 'min-h-[420px] flex-col justify-end bg-slate-950 text-white shadow-xl',
        className,
      )}
    >
      <Link
        href={product.href}
        className={cn(
          'relative block overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          horizontal ? 'min-h-full w-2/5 shrink-0' : 'aspect-[4/5] w-full',
          overlay && 'absolute inset-0 aspect-auto',
        )}
        aria-label={`Ver ${product.name}`}
      >
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes={horizontal ? '(min-width: 768px) 30vw, 45vw' : '(min-width: 1024px) 25vw, 50vw'}
        />
        {overlay ? (
          <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20" />
        ) : null}
      </Link>

      {product.badge ? (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur">
          {product.badge}
        </span>
      ) : null}

      {showFavorite ? (
        <button
          type="button"
          onClick={() => onFavorite?.(product)}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:scale-110 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Favoritar ${product.name}`}
        >
          <Heart className="h-4 w-4" aria-hidden />
        </button>
      ) : null}

      <div
        className={cn(
          'relative z-[1] flex flex-1 flex-col p-5',
          horizontal && 'justify-center p-6',
          overlay && 'justify-end p-7',
          variant === 'minimal' && 'px-0',
        )}
      >
        {product.rating ? (
          <div
            className={cn(
              'mb-2 flex items-center gap-1 text-xs text-muted-foreground',
              overlay && 'text-white/70',
            )}
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            {product.rating.toFixed(1)}
          </div>
        ) : null}

        <Link
          href={product.href}
          className="w-fit rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {product.description ? (
          <p
            className={cn(
              'mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground',
              overlay && 'text-white/70',
            )}
          >
            {product.description}
          </p>
        ) : null}

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            {product.price ? <strong className="text-lg">{product.price}</strong> : null}
            {product.previousPrice ? (
              <span
                className={cn(
                  'ml-2 text-xs text-muted-foreground line-through',
                  overlay && 'text-white/50',
                )}
              >
                {product.previousPrice}
              </span>
            ) : null}
          </div>

          {onAddToCart ? (
            <Button
              type="button"
              size={horizontal ? 'default' : 'icon'}
              variant={overlay ? 'secondary' : 'default'}
              onClick={() => onAddToCart(product)}
              aria-label={`${actionLabel}: ${product.name}`}
              className="shrink-0 gap-2 rounded-full"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              {horizontal ? actionLabel : <span className="sr-only">{actionLabel}</span>}
            </Button>
          ) : (
            <Link
              href={product.href}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              Ver <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
