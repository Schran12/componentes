import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { MobileDrawer } from './MobileDrawer'
import type { NavigationAction, NavigationBrand, NavigationItem } from './types'

export interface NavbarCenteredProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  brand: NavigationBrand
  items: readonly NavigationItem[]
  actions?: readonly NavigationAction[]
  navigationLabel?: string
  sticky?: boolean
}

export function NavbarCentered({
  brand,
  items,
  actions = [],
  navigationLabel = 'Navegação principal',
  sticky = false,
  className,
  ...props
}: NavbarCenteredProps) {
  return (
    <header
      className={cn(
        'z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        sticky && 'sticky top-0',
        className,
      )}
      {...props}
    >
      <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        <nav className="hidden justify-self-start lg:block" aria-label={navigationLabel}>
          <ul className="flex items-center gap-1">
            {items.slice(0, Math.ceil(items.length / 2)).map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    item.current && 'text-primary',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={brand.href ?? '/'}
          className="col-start-2 inline-flex items-center gap-3 rounded-sm text-center font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brand.logo}
          <span>{brand.label}</span>
        </a>

        <div className="hidden items-center justify-self-end lg:flex">
          <nav aria-label={`${navigationLabel} — continuação`}>
            <ul className="flex items-center gap-1">
              {items.slice(Math.ceil(items.length / 2)).map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      item.current && 'text-primary',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {actions[0] ? (
            <Button asChild variant={actions[0].variant} size="sm" className="ml-3">
              <a
                href={actions[0].href}
                target={actions[0].external ? '_blank' : undefined}
                rel={actions[0].external ? 'noopener noreferrer' : undefined}
              >
                {actions[0].label}
              </a>
            </Button>
          ) : null}
        </div>

        <div className="col-start-3 row-start-1 justify-self-end lg:hidden">
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
