'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { MobileDrawer } from './MobileDrawer'
import type { NavigationAction, NavigationBrand, NavigationItem } from './types'

export interface NavbarMegaProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  brand: NavigationBrand
  items: readonly NavigationItem[]
  actions?: readonly NavigationAction[]
  navigationLabel?: string
  sticky?: boolean
  /** `cards`: painel largo centralizado com os subitens em cards verticais (ícone/imagem em cima). */
  panelLayout?: 'list' | 'cards'
  hideBrandLabel?: boolean
}

const CLOSE_DELAY = 150
/** Igual à duração do `animate-out` do painel. */
const EXIT_DURATION = 250

export function NavbarMega({
  brand,
  items,
  actions = [],
  navigationLabel = 'Navegação principal',
  sticky = false,
  panelLayout = 'list',
  hideBrandLabel = false,
  className,
  ...props
}: NavbarMegaProps) {
  const headerRef = React.useRef<HTMLElement>(null)
  const cards = panelLayout === 'cards'

  // <details> não fecha sozinho ao clicar fora, apertar Esc ou navegar.
  React.useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const exitTimers = new Map<HTMLDetailsElement, number>()
    const finishClose = (details: HTMLDetailsElement) => {
      window.clearTimeout(exitTimers.get(details))
      exitTimers.delete(details)
      details.removeAttribute('data-closing')
    }
    const closeSmoothly = (details: HTMLDetailsElement) => {
      if (!details.open || exitTimers.has(details)) return
      details.setAttribute('data-closing', '')
      exitTimers.set(
        details,
        window.setTimeout(() => {
          finishClose(details)
          details.removeAttribute('open')
        }, EXIT_DURATION),
      )
    }
    const closeAll = (except?: Node | null) =>
      header.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((details) => {
        if (!except || !details.contains(except)) closeSmoothly(details)
      })

    const onPointerDown = (event: PointerEvent) => closeAll(event.target as Node)
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && closeAll()
    const onLinkClick = (event: MouseEvent) =>
      (event.target as Element).closest('details a') && closeAll()
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    header.addEventListener('click', onLinkClick)

    // Com mouse, abre no hover; o atraso ao sair evita fechar no caminho até o painel.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const cleanups = canHover
      ? Array.from(header.querySelectorAll('details'), (details) => {
          let timer: number | undefined
          const open = () => {
            window.clearTimeout(timer)
            finishClose(details)
            closeAll(details)
            details.setAttribute('open', '')
          }
          const close = () => {
            timer = window.setTimeout(() => closeSmoothly(details), CLOSE_DELAY)
          }
          // Clique de mouse não fecha o painel aberto pelo hover; teclado (detail 0) alterna.
          const onSummaryClick = (event: MouseEvent) => event.detail > 0 && event.preventDefault()
          const summary = details.querySelector('summary')
          details.addEventListener('pointerenter', open)
          details.addEventListener('pointerleave', close)
          summary?.addEventListener('click', onSummaryClick)
          return () => {
            window.clearTimeout(timer)
            details.removeEventListener('pointerenter', open)
            details.removeEventListener('pointerleave', close)
            summary?.removeEventListener('click', onSummaryClick)
          }
        })
      : []

    return () => {
      exitTimers.forEach((exitTimer) => window.clearTimeout(exitTimer))
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      header.removeEventListener('click', onLinkClick)
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [items])

  return (
    <header
      ref={headerRef}
      className={cn(
        'z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        sticky && 'sticky top-0',
        className,
      )}
      {...props}
    >
      <div className="relative mx-auto flex h-20 max-w-7xl items-center gap-8 px-4">
        <a
          href={brand.href ?? '/'}
          className="flex shrink-0 items-center gap-3 rounded-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brand.logo}
          <span className={cn(hideBrandLabel && brand.logo && 'sr-only')}>{brand.label}</span>
        </a>

        <nav className="hidden flex-1 lg:block" aria-label={navigationLabel}>
          <ul className="flex items-center justify-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                {item.children?.length ? (
                  <details className={cn('group [&:not([open])>div]:hidden', !cards && 'relative')}>
                    <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-open:bg-muted group-open:text-foreground [&::-webkit-details-marker]:hidden">
                      {item.label}
                      <ChevronDown
                        className="h-4 w-4 transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div
                      className={cn(
                        'absolute top-full z-50 border bg-popover text-popover-foreground shadow-2xl',
                        'origin-top duration-300 ease-out animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-3',
                        'group-data-[closing]:duration-[250ms] group-data-[closing]:ease-in group-data-[closing]:animate-out group-data-[closing]:fade-out-0 group-data-[closing]:zoom-out-[0.98] group-data-[closing]:slide-out-to-top-3 group-data-[closing]:fill-mode-forwards',
                        "before:absolute before:inset-x-0 before:-top-8 before:h-8 before:content-['']",
                        cards
                          ? 'inset-x-0 mx-auto mt-2 w-[min(64rem,calc(100vw-2rem))] rounded-2xl border-border/60 p-4'
                          : 'left-1/2 mt-3 w-[min(42rem,80vw)] -translate-x-1/2 rounded-xl p-3',
                      )}
                    >
                      <ul
                        className={cn(
                          'grid gap-1',
                          cards ? 'auto-cols-fr grid-flow-col gap-2' : 'grid-cols-2',
                        )}
                      >
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              target={child.external ? '_blank' : undefined}
                              rel={child.external ? 'noopener noreferrer' : undefined}
                              aria-current={child.current ? 'page' : undefined}
                              className={cn(
                                'group/link flex h-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                cards ? 'flex-col gap-3 rounded-xl p-2' : 'gap-3 rounded-lg p-3',
                              )}
                            >
                              {child.icon ? (
                                <span
                                  className={cn(
                                    'text-primary transition-transform duration-500',
                                    cards
                                      ? 'block [&_img]:transition-transform [&_img]:duration-500 group-hover/link:[&_img]:scale-105 group-hover/link:[&_svg]:translate-x-1'
                                      : 'mt-0.5',
                                  )}
                                >
                                  {child.icon}
                                </span>
                              ) : null}
                              <span className={cn(cards && 'px-1 pb-1')}>
                                <span
                                  className={cn(
                                    'block text-sm',
                                    cards ? 'font-semibold' : 'font-medium',
                                  )}
                                >
                                  {child.label}
                                </span>
                                {child.description ? (
                                  <span
                                    className={cn(
                                      'mt-1 block text-muted-foreground',
                                      cards ? 'line-clamp-2 text-xs' : 'text-sm leading-5',
                                    )}
                                  >
                                    {child.description}
                                  </span>
                                ) : null}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ) : (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    aria-current={item.current ? 'page' : undefined}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      item.current && 'bg-muted text-foreground',
                    )}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
          {actions.map((action) => (
            <Button key={action.href} asChild variant={action.variant} size="sm">
              <a
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
              >
                {action.label}
              </a>
            </Button>
          ))}
        </div>

        <div className="ml-auto lg:hidden">
          <MobileDrawer
            brand={brand}
            items={items}
            actions={actions}
            navigationLabel={navigationLabel}
          />
        </div>
      </div>
    </header>
  )
}
