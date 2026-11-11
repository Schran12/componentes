'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from './useReducedMotion'

export type DepthTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  layers?: number
  depth?: number
  className?: string
  layerClassName?: string
}

export function DepthText({
  text,
  as: Tag = 'h2',
  layers = 12,
  depth = 1.4,
  className,
  layerClassName = 'text-primary',
}: DepthTextProps) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const rest = { x: 0.7, y: 0.7 }
    const current = { ...rest }
    const target = { ...rest }
    let frame = 0

    const apply = () => {
      root.style.setProperty('--depth-x', `${current.x * depth}px`)
      root.style.setProperty('--depth-y', `${current.y * depth}px`)
    }
    apply()
    if (reduced) return

    const tick = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      apply()
      frame = requestAnimationFrame(tick)
    }

    const move = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect()
      const clamp = (value: number) => Math.max(-1, Math.min(1, value))
      target.x = -clamp(
        (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2 + 200),
      )
      target.y = -clamp(
        (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2 + 200),
      )
    }
    const leave = () => Object.assign(target, rest)

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [depth, reduced])

  return (
    <Tag
      ref={rootRef as never}
      className={cn('relative inline-grid font-black leading-none tracking-tight', className)}
    >
      {Array.from({ length: layers }, (_, index) => {
        const layer = layers - index
        return (
          <span
            key={layer}
            aria-hidden="true"
            className={cn('col-start-1 row-start-1 select-none', layerClassName)}
            style={{
              opacity: 0.25 + 0.75 * (1 - layer / layers),
              transform: `translate3d(calc(var(--depth-x, 0px) * ${layer}), calc(var(--depth-y, 0px) * ${layer}), 0)`,
            }}
          >
            {text}
          </span>
        )
      })}
      <span className="relative col-start-1 row-start-1">{text}</span>
    </Tag>
  )
}
