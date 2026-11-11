'use client'

import { demoUrl } from '@/lib/demoOrigin'
import { cn } from '@/lib/utils'

export type LiquidGlassCarouselProps = {
  /** URL do demo estático. Padrão: CDN do catálogo / local em localhost. */
  src?: string
  height?: number | string
  title?: string
  className?: string
}

/**
 * Liquid Glass — carrossel infinito com faixa de fotos e bend WebGL (cilindro de vidro).
 * Demo autocontida em public/liquid-glass-carousel/index.html (GSAP + WebGL raw).
 */
export function LiquidGlassCarousel({
  src,
  height = 520,
  title = 'Liquid Glass Carousel',
  className,
}: LiquidGlassCarouselProps) {
  const demoSrc = src ?? demoUrl('/liquid-glass-carousel/index.html')
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-2xl border bg-white', className)}
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
