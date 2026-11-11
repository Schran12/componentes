'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type NumberTickerProps = {
  value: number
  from?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  once?: boolean
  className?: string
  locale?: string
}

export function NumberTicker({
  value,
  from = 0,
  duration = 1.5,
  decimals = 0,
  prefix = '',
  suffix = '',
  once = true,
  className,
  locale = 'pt-BR',
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once, amount: 0.5 })
  const reduceMotion = useReducedMotion()
  const motionValue = useMotionValue(from)
  const [display, setDisplay] = useState(from)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setDisplay(value)
      return
    }

    const unsubscribe = motionValue.on('change', (latest) => setDisplay(latest))
    const controls = animate(motionValue, value, { duration, ease: 'easeOut' })
    return () => {
      unsubscribe()
      controls.stop()
    }
  }, [duration, inView, motionValue, reduceMotion, value])

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display)

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
