'use client'

import { useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@/lib/hooks/useGSAP'
import { cn } from '@/lib/utils'

import { prefersReducedMotion } from './useReducedMotion'

export type PageRevealType = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'hero'

export type PageRevealProps = {
  children: ReactNode
  start?: string
  className?: string
}

function getFrom(type: PageRevealType, mobile: boolean): gsap.TweenVars {
  switch (type) {
    case 'left':
      return { opacity: 0, x: mobile ? -24 : -40 }
    case 'right':
      return { opacity: 0, x: mobile ? 24 : 40 }
    case 'down':
      return { opacity: 0, y: mobile ? -16 : -24 }
    case 'fade':
      return { opacity: 0 }
    case 'scale':
      return { opacity: 0, scale: 0.96 }
    case 'hero':
      return { opacity: 0, y: mobile ? 20 : 28 }
    default:
      return { opacity: 0, y: mobile ? 22 : 34 }
  }
}

/**
 * Revela por scroll qualquer elemento descendente marcado com atributos:
 * - `data-reveal="up|down|left|right|fade|scale|hero"`
 * - `data-reveal-delay="0.15"` e `data-reveal-duration="0.9"`
 * - `data-reveal-stagger="up"` no container (anima os filhos diretos) + `data-stagger="0.1"`
 */
export function PageReveal({ children, start = 'top 90%', className }: PageRevealProps) {
  const root = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useGSAP(
    ({ gsap, ScrollTrigger }) => {
      const container = root.current
      if (!container || prefersReducedMotion()) return

      const mobile = window.innerWidth < 768

      container
        .querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-stagger] [data-reveal])')
        .forEach((element) => {
          const type = (element.dataset.reveal || 'up') as PageRevealType
          const delay = Number(element.dataset.revealDelay || 0)
          const duration = Number(element.dataset.revealDuration || 0.9)
          const to = { opacity: 1, x: 0, y: 0, scale: 1, ease: 'power3.out' }

          if (type === 'hero') {
            gsap.fromTo(element, getFrom(type, mobile), {
              ...to,
              duration: 1.05,
              delay: delay || 0.08,
            })
            return
          }

          gsap.fromTo(element, getFrom(type, mobile), {
            ...to,
            duration,
            delay,
            scrollTrigger: { trigger: element, start, once: true },
          })
        })

      container.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>(':scope > *')
        if (!items.length) return

        const type = (group.dataset.revealStagger || 'up') as PageRevealType
        gsap.fromTo(items, getFrom(type === 'hero' ? 'up' : type, mobile), {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.85,
          delay: Number(group.dataset.revealDelay || 0),
          stagger: Number(group.dataset.stagger || 0.1),
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: group, start, once: true },
        })
      })

      const refresh = (): void => ScrollTrigger.refresh()
      const timer = window.setTimeout(refresh, 200)
      window.addEventListener('load', refresh)

      return () => {
        window.clearTimeout(timer)
        window.removeEventListener('load', refresh)
      }
    },
    [pathname, start],
    root,
  )

  return (
    <div ref={root} className={cn(className)}>
      {children}
    </div>
  )
}
