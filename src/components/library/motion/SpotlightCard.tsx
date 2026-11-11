'use client'

import type { MouseEvent, ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type SpotlightCardProps = {
  children: ReactNode
  color?: string
  size?: number
  className?: string
}

export function SpotlightCard({
  children,
  color = 'hsl(var(--primary) / 0.18)',
  size = 280,
  className,
}: SpotlightCardProps) {
  const pointerX = useMotionValue(-size)
  const pointerY = useMotionValue(-size)
  const reduceMotion = useReducedMotion()
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${pointerX}px ${pointerY}px, ${color}, transparent 70%)`

  function updateSpotlight(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(event.clientX - bounds.left)
    pointerY.set(event.clientY - bounds.top)
  }

  return (
    <div
      className={cn('group relative overflow-hidden rounded-2xl border bg-card', className)}
      onMouseMove={reduceMotion ? undefined : updateSpotlight}
      onMouseLeave={
        reduceMotion
          ? undefined
          : () => {
              pointerX.set(-size)
              pointerY.set(-size)
            }
      }
    >
      {!reduceMotion ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  )
}
