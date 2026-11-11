'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@/lib/hooks/useGSAP'
import { prefersReducedMotion, useReducedMotion } from './useReducedMotion'

export type MagneticHoverProps = {
  children: ReactNode
  className?: string
  strength?: number
  duration?: number
  disabled?: boolean
}

export function MagneticHover({
  children,
  className,
  strength = 0.25,
  duration = 0.35,
  disabled = false,
}: MagneticHoverProps) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useGSAP(
    ({ gsap }) => {
      const element = root.current
      if (
        !element ||
        disabled ||
        reduced ||
        prefersReducedMotion() ||
        !window.matchMedia('(pointer: fine)').matches
      ) {
        return
      }

      const xTo = gsap.quickTo(element, 'x', { duration, ease: 'power3.out' })
      const yTo = gsap.quickTo(element, 'y', { duration, ease: 'power3.out' })

      const move = (event: PointerEvent): void => {
        const bounds = element.getBoundingClientRect()
        xTo((event.clientX - (bounds.left + bounds.width / 2)) * strength)
        yTo((event.clientY - (bounds.top + bounds.height / 2)) * strength)
      }

      const reset = (): void => {
        xTo(0)
        yTo(0)
      }

      element.addEventListener('pointermove', move)
      element.addEventListener('pointerleave', reset)
      element.addEventListener('pointercancel', reset)

      return () => {
        element.removeEventListener('pointermove', move)
        element.removeEventListener('pointerleave', reset)
        element.removeEventListener('pointercancel', reset)
      }
    },
    [disabled, duration, reduced, strength],
    root,
  )

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  )
}
