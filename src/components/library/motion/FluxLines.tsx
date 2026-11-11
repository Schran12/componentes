'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from './useReducedMotion'

export type FluxLinesProps = {
  children?: ReactNode
  className?: string
  lineCount?: number
  amplitude?: number
  speed?: number
  magnetRadius?: number
  magnetStrength?: number
  color?: string
}

type Rgb = [number, number, number]

function toRgb(context: CanvasRenderingContext2D, color: string): Rgb {
  context.fillStyle = '#000'
  context.fillStyle = color
  const value = String(context.fillStyle)
  if (value.startsWith('#')) {
    const hex = parseInt(value.slice(1), 16)
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255]
  }
  const [r = 0, g = 0, b = 0] = value.match(/[\d.]+/g)?.map(Number) ?? []
  return [r, g, b]
}

const mix = (from: Rgb, to: Rgb, amount: number): Rgb =>
  from.map((value, index) => Math.round(value + (to[index] - value) * amount)) as Rgb

const rgba = ([r, g, b]: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`

export function FluxLines({
  children,
  className,
  lineCount = 26,
  amplitude = 38,
  speed = 1,
  magnetRadius = 170,
  magnetStrength = 1,
  color,
}: FluxLinesProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!root || !canvas || !context) return

    const primary = getComputedStyle(root).getPropertyValue('--primary').trim()
    const base = toRgb(context, color ?? (primary ? `hsl(${primary})` : '#a855f7'))
    const glow = mix(base, [255, 255, 255], 0.35)
    const highlight = mix(base, [255, 255, 255], 0.75)

    let width = 0
    let height = 0
    let frame = 0
    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = root.clientWidth
      height = root.clientHeight
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const tracePaths = (time: number) => {
      const t = time * 0.00035 * speed
      const step = 10
      context.beginPath()
      for (let line = 0; line < lineCount; line += 1) {
        const progress = lineCount > 1 ? line / (lineCount - 1) : 0.5
        const baseY = height * (0.08 + progress * 0.84)
        for (let x = -step; x <= width + step; x += step) {
          let px = x
          let py =
            baseY +
            Math.sin(x * 0.0042 + t * 2.1 + line * 0.33) * amplitude * 0.6 +
            Math.sin(x * 0.011 - t * 2.9 + line * 0.85) * amplitude * 0.22 +
            Math.sin(x * 0.0018 + t * 1.3 + progress * 5.5) * amplitude * 0.55
          const dx = px - pointer.x
          const dy = py - pointer.y
          const distance = Math.hypot(dx, dy)
          if (pointer.strength > 0.001 && distance < magnetRadius) {
            const force = (1 - distance / magnetRadius) ** 2 * pointer.strength * magnetStrength
            const angle = force * 1.6
            px = pointer.x + dx * Math.cos(angle) - dy * Math.sin(angle)
            py = pointer.y + dx * Math.sin(angle) + dy * Math.cos(angle)
          }
          if (x === -step) context.moveTo(px, py)
          else context.lineTo(px, py)
        }
      }
    }

    const draw = (time: number) => {
      pointer.strength += (pointer.target - pointer.strength) * 0.08
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = 'lighter'
      context.lineWidth = 1.2
      tracePaths(time)

      context.shadowColor = rgba(glow, 0.9)
      context.shadowBlur = 10
      context.strokeStyle = rgba(glow, 0.32)
      context.stroke()

      if (pointer.strength > 0.01) {
        const radius = magnetRadius * 1.6
        const reveal = context.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          radius,
        )
        reveal.addColorStop(0, rgba(highlight, 0.95 * pointer.strength))
        reveal.addColorStop(1, rgba(highlight, 0))
        context.shadowColor = rgba(highlight, 0.9)
        context.shadowBlur = 16
        context.strokeStyle = reveal
        context.stroke()
      }
      context.shadowBlur = 0
      context.globalCompositeOperation = 'source-over'

      if (!reduced) frame = requestAnimationFrame(draw)
    }

    const move = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
      pointer.target = 1
      if (reduced) draw(0)
    }
    const leave = () => {
      pointer.target = 0
      if (reduced) {
        pointer.strength = 0
        draw(0)
      }
    }

    const observer = new ResizeObserver(() => {
      resize()
      if (reduced) draw(0)
    })
    observer.observe(root)
    resize()
    root.addEventListener('pointermove', move)
    root.addEventListener('pointerleave', leave)
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
    }
  }, [amplitude, color, lineCount, magnetRadius, magnetStrength, reduced, speed])

  return (
    <div
      ref={rootRef}
      className={cn('relative isolate overflow-hidden bg-slate-950 text-white', className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 h-full w-full" aria-hidden="true" />
      {children}
    </div>
  )
}
