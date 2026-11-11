'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@/lib/hooks/useGSAP'
import { prefersReducedMotion, useReducedMotion } from './useReducedMotion'

export type StaggerProps = {
  children: ReactNode
  className?: string
  selector?: string
  trigger?: 'mount' | 'scroll'
  stagger?: number
  distance?: number
  duration?: number
  delay?: number
  ease?: string
  once?: boolean
}

export function Stagger({
  children,
  className,
  selector,
  trigger = 'scroll',
  stagger = 0.1,
  distance = 24,
  duration = 0.6,
  delay = 0,
  ease = 'power2.out',
  once = true,
}: StaggerProps) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    ({ gsap }) => {
      const element = root.current
      if (!element || reduced || prefersReducedMotion()) return

      const items = selector
        ? gsap.utils.toArray<Element>(selector, element)
        : Array.from(element.children)

      if (items.length === 0) return

      gsap.from(items, {
        autoAlpha: 0,
        y: distance,
        duration,
        delay,
        stagger,
        ease,
        clearProps: 'transform,opacity,visibility',
        scrollTrigger:
          trigger === 'scroll'
            ? {
                trigger: element,
                start: 'top 85%',
                toggleActions: once ? 'play none none none' : 'play none none reverse',
                once,
              }
            : undefined,
      })
    },
    [delay, distance, duration, ease, once, reduced, selector, stagger, trigger],
    root,
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
