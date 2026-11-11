'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type PillNavItem = {
  label: string
  href: string
}

export type PillNavProps = {
  items: PillNavItem[]
  activeHref?: string
  logo?: ReactNode
  logoHref?: string
  ariaLabel?: string
  className?: string
}

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function PillNav({
  items,
  activeHref,
  logo,
  logoHref = '/',
  ariaLabel = 'Navegação principal',
  className,
}: PillNavProps) {
  const pathname = usePathname()
  const [current, setCurrent] = useState(activeHref ?? pathname)
  const [hovered, setHovered] = useState<number | null>(null)
  const [highlight, setHighlight] = useState({ left: 0, width: 0, ready: false })
  const listRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => setCurrent(activeHref ?? pathname), [activeHref, pathname])

  const activeIndex = items.findIndex((item) => item.href === current)
  const targetIndex = hovered ?? activeIndex

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const element = itemRefs.current[targetIndex]
      if (!element) return setHighlight((value) => ({ ...value, width: 0 }))
      setHighlight({ left: element.offsetLeft, width: element.offsetWidth, ready: true })
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (listRef.current) observer.observe(listRef.current)
    return () => observer.disconnect()
  }, [targetIndex, items])

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-full border bg-background/80 p-1.5 shadow-lg shadow-foreground/5 backdrop-blur',
        className,
      )}
    >
      {logo ? (
        <Link
          href={logoHref}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition hover:rotate-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {logo}
        </Link>
      ) : null}
      <ul
        ref={listRef}
        className="relative flex min-w-0 items-center overflow-x-auto [scrollbar-width:none]"
        onPointerLeave={() => setHovered(null)}
      >
        <li
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 rounded-full bg-primary',
            highlight.ready &&
              'transition-[transform,width,opacity] duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)]',
          )}
          style={{
            width: highlight.width,
            transform: `translateX(${highlight.left}px)`,
            transitionTimingFunction: 'cubic-bezier(.22,1,.36,1)',
            opacity: highlight.width ? 1 : 0,
          }}
        />
        {items.map((item, index) => {
          const isActive = index === activeIndex
          const isLit = index === targetIndex
          return (
            <li key={item.href} className="relative">
              <Link
                ref={(element) => {
                  itemRefs.current[index] = element
                }}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onPointerEnter={() => setHovered(index)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                onClick={() => setCurrent(item.href)}
                className={cn(
                  'relative block whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none',
                  isLit ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
