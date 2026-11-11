'use client'

import { demoUrl } from '@/lib/demoOrigin'
import { cn } from '@/lib/utils'

export type FlickCardsProps = {
  /** URL do demo estático. Padrão: CDN do catálogo / local em localhost. */
  src?: string
  height?: number | string
  title?: string
  className?: string
}

/**
 * Flick Cards — deck 3D em leque (GSAP): arraste/flick, setas, autoplay e glow ambient.
 * Demo autocontida em public/flick-cards/index.html.
 */
export function FlickCards({
  src,
  height = 560,
  title = 'Flick Cards',
  className,
}: FlickCardsProps) {
  const demoSrc = src ?? demoUrl('/flick-cards/index.html')
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#050505]',
        className,
      )}
      style={{ height }}
    >
      <iframe
        title={title}
        src={demoSrc}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        allow="autoplay"
      />
    </div>
  )
}
