'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type MotionRevealProps = {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  delay?: number
  duration?: number
  once?: boolean
  className?: string
}

export function MotionReveal({
  children,
  direction = 'up',
  distance = 32,
  delay = 0,
  duration = 0.55,
  once = true,
  className,
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion()
  const offset = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  }[direction]

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}
