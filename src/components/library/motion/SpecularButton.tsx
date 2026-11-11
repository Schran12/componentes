'use client'

import Link from 'next/link'
import {
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from './useReducedMotion'

export type SpecularButtonProps = {
  children: ReactNode
  href?: string
  onClick?: MouseEventHandler<HTMLElement>
  type?: 'button' | 'submit' | 'reset'
  tone?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

const tones = {
  dark: 'border-white/15 bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_10px_30px_-12px_rgba(0,0,0,.6)] [--specular:255,255,255]',
  light:
    'border-foreground/10 bg-background/60 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_10px_30px_-14px_hsl(var(--primary)/.45)] [--specular:255,255,255]',
}

const edgeMask: CSSProperties = {
  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
}

export function SpecularButton({
  children,
  href,
  onClick,
  type = 'button',
  tone = 'dark',
  size = 'md',
  disabled = false,
  className,
}: SpecularButtonProps) {
  const rootRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const current = { x: 0.5, y: 0 }
    const target = { x: 0.5, y: 0 }
    let frame = 0

    const apply = () => {
      root.style.setProperty('--spec-x', `${current.x * 100}%`)
      root.style.setProperty('--spec-y', `${current.y * 100}%`)
    }
    const tick = () => {
      current.x += (target.x - current.x) * (reduced ? 1 : 0.12)
      current.y += (target.y - current.y) * (reduced ? 1 : 0.12)
      apply()
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.001) {
        frame = requestAnimationFrame(tick)
      } else frame = 0
    }
    const start = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const move = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect()
      target.x = (event.clientX - bounds.left) / bounds.width
      target.y = (event.clientY - bounds.top) / bounds.height
      start()
    }
    const leave = () => {
      target.x = 0.5
      target.y = 0
      start()
    }

    apply()
    root.addEventListener('pointermove', move)
    root.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
    }
  }, [reduced])

  const classes = cn(
    'group relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full border font-semibold backdrop-blur-md transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50',
    sizes[size],
    tones[tone],
    className,
  )

  const content = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(90px circle at var(--spec-x, 50%) var(--spec-y, 0%), rgba(var(--specular), .28), transparent 70%)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full p-px opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          ...edgeMask,
          background:
            'radial-gradient(70px circle at var(--spec-x, 50%) var(--spec-y, 0%), rgba(var(--specular), 1), rgba(var(--specular), .08) 70%)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
      {children}
    </>
  )

  if (href && !disabled) {
    return (
      <Link
        ref={rootRef as never}
        href={href}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        className={classes}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      ref={rootRef as never}
      type={type}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  )
}
