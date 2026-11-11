'use client'

import { demoUrl } from '@/lib/demoOrigin'
import { cn } from '@/lib/utils'

export type KresnaFooterProps = {
  /** URL do demo estático. */
  src?: string
  height?: number | string
  title?: string
  className?: string
}

/**
 * Kresna Footer — card de vídeo + card claro com nav, badge “Feeling lucky?” e subscribe.
 * Demo autocontida em public/kresna-footer/index.html.
 */
export function KresnaFooter({
  src,
  height = 640,
  title = 'Kresna Footer',
  className,
}: KresnaFooterProps) {
  const demoSrc = src ?? demoUrl('/kresna-footer/index.html')
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
