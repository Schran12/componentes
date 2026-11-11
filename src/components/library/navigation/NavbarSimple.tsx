import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { MobileDrawer } from './MobileDrawer'
import type { NavigationAction, NavigationBrand, NavigationItem } from './types'

export interface NavbarSimpleProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  brand: NavigationBrand
  items: readonly NavigationItem[]
  actions?: readonly NavigationAction[]
  navigationLabel?: string
  sticky?: boolean
  search?: React.ReactNode
}

export function NavbarSimple({
  brand,
  items,
  actions = [],
  navigationLabel = 'Navegação principal',
  sticky = false,
  search,
  className,
  ...props
}: NavbarSimpleProps) {
  return (
    <header
      className={cn(
        'z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80',
        sticky && 'sticky top-0',
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 md:gap-6 lg:px-8">
        <a
          href={brand.href ?? '/'}
          className="flex shrink-0 items-center gap-3 rounded-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brand.logo}
          <span className={cn(search && 'max-sm:sr-only')}>{brand.label}</span>
        </a>

        <nav
          className={cn('hidden md:block', search ? 'shrink-0' : 'flex-1')}
          aria-label={navigationLabel}
        >
          <ul className="flex items-center justify-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
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
              </li>
            ))}
          </ul>
        </nav>

        {search ? <div className="min-w-0 flex-1 md:ml-auto md:max-w-sm">{search}</div> : null}

        <div className={cn('hidden items-center gap-2 md:flex', !search && 'ml-auto')}>
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

        <div className={cn('shrink-0 md:hidden', !search && 'ml-auto')}>
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
