import type { CSSProperties } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export type MapEmbedSectionProps = {
  /** Endereço ou termo usado no Google Maps. */
  query: string
  title?: string
  description?: string
  eyebrow?: string
  address?: string
  directionsHref?: string
  directionsLabel?: string
  height?: number
  className?: string
}

export function MapEmbedSection({
  query,
  title,
  description,
  eyebrow,
  address,
  directionsHref,
  directionsLabel = 'Como chegar',
  height = 450,
  className,
}: MapEmbedSectionProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'map-title' : undefined}
    >
      <div className="container">
        {title ? (
          <div className="mb-10 max-w-2xl">
            {eyebrow ? (
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h2
              id="map-title"
              className={cn('text-3xl font-bold tracking-tight md:text-4xl', eyebrow && 'mt-3')}
            >
              {title}
            </h2>
            {description ? <p className="mt-4 text-muted-foreground">{description}</p> : null}
          </div>
        ) : null}
        <div className="overflow-hidden rounded-3xl border bg-muted shadow-sm">
          <iframe
            title={`Mapa: ${query}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
            className="block h-80 w-full border-0 md:h-[var(--map-height)]"
            style={{ '--map-height': `${height}px` } as CSSProperties}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          {address ? (
            <div className="flex flex-col gap-3 border-t bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
              <p className="flex items-start gap-2 text-sm font-medium">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {address}
              </p>
              {directionsHref ? (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  {directionsLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
