'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

export type HoloCardProps = {
  image: { src: string; alt: string }
  name: string
  role: string
  handle?: string
  status?: string
  action?: { label: string; href: string }
  maxTilt?: number
  className?: string
}

const foil =
  'repeating-linear-gradient(115deg, hsl(0 100% 70% / .55) 0%, hsl(50 100% 65% / .55) 8%, hsl(140 90% 65% / .55) 16%, hsl(200 100% 65% / .55) 24%, hsl(270 100% 70% / .55) 32%, hsl(330 100% 70% / .55) 40%)'
const pattern =
  'repeating-linear-gradient(45deg, rgba(255,255,255,.12) 0 2px, transparent 2px 9px), repeating-linear-gradient(-45deg, rgba(255,255,255,.12) 0 2px, transparent 2px 9px)'

export function HoloCard({
  image,
  name,
  role,
  handle,
  status,
  action,
  maxTilt = 14,
  className,
}: HoloCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return

    const rest = { x: 0.5, y: 0.5, active: 0 }
    const current = { ...rest }
    const target = { ...rest }
    let frame = 0

    const tick = () => {
      current.x += (target.x - current.x) * 0.1
      current.y += (target.y - current.y) * 0.1
      current.active += (target.active - current.active) * 0.1
      root.style.setProperty('--holo-x', `${current.x * 100}%`)
      root.style.setProperty('--holo-y', `${current.y * 100}%`)
      root.style.setProperty('--holo-active', current.active.toFixed(3))
      root.style.setProperty('--holo-rx', `${(0.5 - current.y) * maxTilt * 2 * current.active}deg`)
      root.style.setProperty('--holo-ry', `${(current.x - 0.5) * maxTilt * 2 * current.active}deg`)
      const settled =
        Math.abs(target.x - current.x) +
        Math.abs(target.y - current.y) +
        Math.abs(target.active - current.active)
      frame = settled > 0.001 ? requestAnimationFrame(tick) : 0
    }
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const move = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect()
      target.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width))
      target.y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height))
      target.active = 1
      start()
    }
    const leave = () => {
      Object.assign(target, rest)
      start()
    }

    root.addEventListener('pointermove', move)
    root.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
    }
  }, [maxTilt, reduced])

  return (
    <div className={cn('mx-auto w-full max-w-xs [perspective:900px]', className)}>
      <div
        ref={rootRef}
        className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-950 text-white shadow-2xl shadow-primary/25 [transform-style:preserve-3d]"
        style={{
          transform: 'rotateX(var(--holo-rx, 0deg)) rotateY(var(--holo-ry, 0deg))',
        }}
      >
        <Image src={image.src} alt={image.alt} fill sizes="320px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-color-dodge"
          style={{
            backgroundImage: `${pattern}, ${foil}`,
            backgroundSize: '100% 100%, 400% 400%',
            backgroundPosition: 'center, var(--holo-x, 50%) var(--holo-y, 50%)',
            opacity: 'calc(.18 + var(--holo-active, 0) * .5)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            background:
              'radial-gradient(circle at var(--holo-x, 50%) var(--holo-y, 50%), rgba(255,255,255,.75), transparent 45%)',
            opacity: 'var(--holo-active, 0)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-5 [transform:translateZ(40px)]">
          {status ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {status}
            </span>
          ) : null}
          <h3 className="mt-3 text-2xl font-bold tracking-tight">{name}</h3>
          <p className="mt-1 text-sm text-white/70">{role}</p>
          {handle || action ? (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 p-2 pl-3 backdrop-blur">
              {handle ? <span className="truncate text-sm text-white/80">{handle}</span> : <span />}
              {action ? (
                <Link
                  href={action.href}
                  className="shrink-0 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {action.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
