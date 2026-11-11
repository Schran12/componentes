'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@/lib/hooks/useGSAP'
import { prefersReducedMotion, useReducedMotion } from './useReducedMotion'

export type MarqueeProps = {
  children: ReactNode
  className?: string
  itemClassName?: string
  speed?: number
  direction?: 'left' | 'right'
  gap?: number
  pauseOnHover?: boolean
  ariaLabel?: string
}

export function Marquee({
  children,
  className,
  itemClassName,
  speed = 60,
  direction = 'left',
  gap = 32,
  pauseOnHover = true,
  ariaLabel,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const firstSet = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    ({ gsap }) => {
      const container = root.current
      const rail = track.current
      const set = firstSet.current
      if (!container || !rail || !set || reduced || prefersReducedMotion()) return

      let tween: gsap.core.Tween | undefined
      const build = (): void => {
        tween?.kill()
        gsap.set(rail, { x: 0 })

        const distance = set.getBoundingClientRect().width + gap
        if (distance <= 0) return

        tween = gsap.fromTo(
          rail,
          { x: direction === 'left' ? 0 : -distance },
          {
            x: direction === 'left' ? -distance : 0,
            duration: distance / Math.max(speed, 1),
            ease: 'none',
            repeat: -1,
          },
        )
      }

      const pause = (): void => {
        tween?.pause()
      }
      const resume = (): void => {
        tween?.resume()
      }
      const resizeObserver =
        typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(build)
      resizeObserver?.observe(set)
      window.addEventListener('resize', build)
      build()

      if (pauseOnHover) {
        container.addEventListener('pointerenter', pause)
        container.addEventListener('pointerleave', resume)
        container.addEventListener('focusin', pause)
        container.addEventListener('focusout', resume)
      }

      return () => {
        resizeObserver?.disconnect()
        window.removeEventListener('resize', build)
        container.removeEventListener('pointerenter', pause)
        container.removeEventListener('pointerleave', resume)
        container.removeEventListener('focusin', pause)
        container.removeEventListener('focusout', resume)
        tween?.kill()
      }
    },
    [direction, gap, pauseOnHover, reduced, speed],
    root,
  )

  const groupStyle = {
    display: 'flex',
    flex: 'none',
    gap,
  } as const

  return (
    <div ref={root} className={className} aria-label={ariaLabel} style={{ overflow: 'hidden' }}>
      <div
        ref={track}
        style={{ display: 'flex', gap, width: 'max-content', willChange: 'transform' }}
      >
        <div ref={firstSet} className={itemClassName} style={groupStyle}>
          {children}
        </div>
        <div
          ref={(node) => node?.setAttribute('inert', '')}
          aria-hidden="true"
          className={itemClassName}
          style={groupStyle}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
