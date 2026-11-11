'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@/lib/hooks/useGSAP'
import { prefersReducedMotion, useReducedMotion } from './useReducedMotion'

export type ParallaxMediaProps = {
  children: ReactNode
  className?: string
  mediaClassName?: string
  amount?: number
  scrub?: boolean | number
}

export function ParallaxMedia({
  children,
  className,
  mediaClassName,
  amount = 10,
  scrub = 0.6,
}: ParallaxMediaProps) {
  const root = useRef<HTMLDivElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    ({ gsap }) => {
      const container = root.current
      const target = media.current
      if (!container || !target || reduced || prefersReducedMotion()) return

      gsap.fromTo(
        target,
        { yPercent: -Math.abs(amount) },
        {
          yPercent: Math.abs(amount),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        },
      )
    },
    [amount, reduced, scrub],
    root,
  )

  return (
    <div ref={root} className={className} style={{ overflow: 'hidden' }}>
      <div ref={media} className={mediaClassName}>
        {children}
      </div>
    </div>
  )
}
