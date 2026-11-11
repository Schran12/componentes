'use client'

import type { MouseEvent, ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { cn } from '@/lib/utils'

export type HoverTiltCardProps = {
  children: ReactNode
  intensity?: number
  scale?: number
  glare?: boolean
  className?: string
}

export function HoverTiltCard({
  children,
  intensity = 10,
  scale = 1.02,
  glare = true,
  className,
}: HoverTiltCardProps) {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [intensity, -intensity]), {
    stiffness: 220,
    damping: 24,
  })
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-intensity, intensity]), {
    stiffness: 220,
    damping: 24,
  })
  const glareX = useTransform(pointerX, [0, 1], ['0%', '100%'])
  const glareY = useTransform(pointerY, [0, 1], ['0%', '100%'])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, white 0%, transparent 55%)`

  function updatePointer(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width)
    pointerY.set((event.clientY - bounds.top) / bounds.height)
  }

  function resetPointer() {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <motion.div
      className={cn('group relative transform-gpu overflow-hidden', className)}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduceMotion ? undefined : { scale }}
      onMouseMove={reduceMotion ? undefined : updatePointer}
      onMouseLeave={reduceMotion ? undefined : resetPointer}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
    >
      {children}
      {glare && !reduceMotion ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      ) : null}
    </motion.div>
  )
}
