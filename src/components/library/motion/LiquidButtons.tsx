'use client'

import { demoUrl } from '@/lib/demoOrigin'
import { cn } from '@/lib/utils'

export type LiquidButtonsProps = {
  /** URL do demo (build estático). Padrão: CDN do catálogo / local em localhost. */
  src?: string
  /** Altura do preview. */
  height?: number | string
  title?: string
  className?: string
}

/**
 * Preview dos Liquid Buttons (Three.js): botões de vidro com refração,
 * ripple na base e barrel roll 360° no clique.
 * Demo estático em public/liquid-buttons (repo kunal-chaudhary-design/liquid-buttons).
 */
export function LiquidButtons({
  src,
  height = 480,
  title = 'Liquid Buttons',
  className,
}: LiquidButtonsProps) {
  const demoSrc = src ?? demoUrl('/liquid-buttons/')
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-2xl border bg-[#e7e8e5]', className)}
      style={{ height }}
    >
      <iframe
        title={title}
        src={demoSrc}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        allow="accelerometer; gyroscope"
      />
    </div>
  )
}
