'use client'

import { useRef } from 'react'
import { useGSAP } from '@/lib/hooks/useGSAP'
import { prefersReducedMotion, useReducedMotion } from './useReducedMotion'

export type CounterProps = {
  value: number
  from?: number
  duration?: number
  delay?: number
  decimals?: number
  locale?: string
  prefix?: string
  suffix?: string
  className?: string
  trigger?: 'mount' | 'scroll'
  formatter?: (value: number) => string
}

export function Counter({
  value,
  from = 0,
  duration = 1.5,
  delay = 0,
  decimals = 0,
  locale = 'pt-BR',
  prefix = '',
  suffix = '',
  className,
  trigger = 'scroll',
  formatter,
}: CounterProps) {
  const root = useRef<HTMLSpanElement>(null)
  const output = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  const safeValue = Number.isFinite(value) ? value : 0
  const safeFrom = Number.isFinite(from) ? from : 0
  const precision = Math.min(20, Math.max(0, Math.trunc(decimals)))
  const numberFormat = new Intl.NumberFormat(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })
  const format = (current: number): string =>
    `${prefix}${formatter ? formatter(current) : numberFormat.format(current)}${suffix}`
  const finalText = format(safeValue)

  useGSAP(
    ({ gsap }) => {
      const element = root.current
      const text = output.current
      if (!element || !text) return

      if (reduced || prefersReducedMotion()) {
        text.textContent = finalText
        return
      }

      const state = { value: safeFrom }
      gsap.to(state, {
        value: safeValue,
        duration,
        delay,
        ease: 'power2.out',
        onStart: () => {
          text.textContent = format(safeFrom)
        },
        onUpdate: () => {
          text.textContent = format(state.value)
        },
        onComplete: () => {
          text.textContent = finalText
        },
        scrollTrigger:
          trigger === 'scroll'
            ? {
                trigger: element,
                start: 'top 90%',
                once: true,
              }
            : undefined,
      })

      return () => {
        text.textContent = finalText
      }
    },
    [
      delay,
      duration,
      finalText,
      formatter,
      locale,
      precision,
      prefix,
      reduced,
      safeFrom,
      safeValue,
      suffix,
      trigger,
    ],
    root,
  )

  return (
    <span ref={root} className={className} aria-label={finalText}>
      <span ref={output} aria-hidden="true">
        {finalText}
      </span>
    </span>
  )
}
