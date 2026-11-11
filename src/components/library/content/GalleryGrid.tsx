import Image from 'next/image'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type GalleryGridItem = {
  src: string
  alt: string
  title?: string
  description?: string
  href?: string
  width?: number
  height?: number
}

export interface GalleryGridProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: readonly GalleryGridItem[]
  columns?: 2 | 3 | 4
  aspect?: 'square' | 'video' | 'portrait'
  variant?: 'grid' | 'masonry'
  emptyMessage?: string
}

export function GalleryGrid({
  items,
  columns = 3,
  aspect = 'square',
  variant = 'grid',
  emptyMessage = 'Nenhuma imagem disponível.',
  className,
  ...props
}: GalleryGridProps) {
  const columnsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns]
  const aspectClass = { square: 'aspect-square', video: 'aspect-video', portrait: 'aspect-[3/4]' }[
    aspect
  ]

  if (!items.length) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-dashed p-8 text-center text-muted-foreground',
          className,
        )}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <section
      aria-label="Galeria de imagens"
      className={cn('grid grid-cols-1 gap-4', columnsClass, className)}
      {...props}
    >
      {items.map((item, index) => {
        const content = (
          <>
            <div
              className={cn(
                'relative overflow-hidden rounded-2xl bg-muted',
                variant === 'grid' && aspectClass,
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width ?? 900}
                height={item.height ?? 900}
                sizes={`(min-width: 1024px) ${Math.round(100 / columns)}vw, (min-width: 768px) 50vw, 100vw`}
                className={cn(
                  'h-full w-full object-cover transition duration-500 group-hover:scale-105',
                  variant === 'masonry' && 'h-auto',
                )}
              />
              {(item.title || item.description) && variant === 'grid' ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16 text-white">
                  {item.title ? <h3 className="font-semibold">{item.title}</h3> : null}
                  {item.description ? (
                    <p className="mt-1 text-sm text-white/80">{item.description}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
            {(item.title || item.description) && variant === 'masonry' ? (
              <div className="px-1 pt-3">
                {item.title ? <h3 className="font-semibold">{item.title}</h3> : null}
                {item.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                ) : null}
              </div>
            ) : null}
          </>
        )
        return item.href ? (
          <a
            key={`${item.src}-${index}`}
            href={item.href}
            className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {content}
          </a>
        ) : (
          <article key={`${item.src}-${index}`} className="group">
            {content}
          </article>
        )
      })}
    </section>
  )
}
