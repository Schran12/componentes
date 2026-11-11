'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@/lib/hooks/useGSAP'
import { prefersReducedMotion, useReducedMotion } from './useReducedMotion'

export type RevealProps = {
  children: ReactNode
  className?: string
  trigger?: 'mount' | 'scroll'
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  duration?: number
  delay?: number
  ease?: string
  once?: boolean
  threshold?: number
}

export function Reveal({
  children,
  className,
  trigger = 'scroll',
  direction = 'up',
  distance = 32,
  duration = 0.7,
  delay = 0,
  ease = 'power2.out',
  once = true,
  threshold = 0.15,
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    ({ gsap }) => {
      const element = root.current
      if (!element || reduced || prefersReducedMotion()) return
      const visibleThreshold = Math.min(1, Math.max(0, threshold))

      const offset = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
        none: {},
      }[direction]

      gsap.from(element, {
        ...offset,
        autoAlpha: 0,
        duration,
        delay,
        ease,
        clearProps: 'transform,opacity,visibility',
        scrollTrigger:
          trigger === 'scroll'
            ? {
                trigger: element,
                start: `top ${Math.round((1 - visibleThreshold) * 100)}%`,
                toggleActions: once ? 'play none none none' : 'play none none reverse',
                once,
              }
            : undefined,
      })
    },
    [delay, direction, distance, duration, ease, once, reduced, threshold, trigger],
    root,
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
