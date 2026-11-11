'use client'

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ScrollProgressProps = {
  position?: 'top' | 'bottom'
  height?: number
  className?: string
  label?: string
}

export function ScrollProgress({
  position = 'top',
  height = 3,
  className,
  label = 'Progresso de leitura',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const reduceMotion = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 1000 : 120,
    damping: reduceMotion ? 100 : 24,
    restDelta: 0.001,
  })

  return (
    <motion.div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'fixed inset-x-0 z-[70] origin-left bg-primary',
        position === 'top' ? 'top-0' : 'bottom-0',
        className,
      )}
      style={{ height, scaleX }}
    />
  )
}
