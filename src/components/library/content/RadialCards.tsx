'use client'

import { demoUrl } from '@/lib/demoOrigin'
import { cn } from '@/lib/utils'

export type RadialCardsProps = {
  /** URL do demo estático. Padrão: CDN do catálogo / local em localhost. */
  src?: string
  height?: number | string
  title?: string
  className?: string
}

/**
 * Radial Cards — polaroids no arco de uma roda invisível (GSAP).
 * Demo autocontida em public/radial-cards/index.html.
 */
export function RadialCards({
  src,
  height = 560,
  title = 'Radial Cards',
  className,
}: RadialCardsProps) {
  const demoSrc = src ?? demoUrl('/radial-cards/index.html')
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#2b302a]',
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
