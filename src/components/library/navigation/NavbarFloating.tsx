import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MobileDrawer } from './MobileDrawer'
import type { NavigationAction, NavigationBrand, NavigationItem } from './types'

export interface NavbarFloatingProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  brand: NavigationBrand
  items: readonly NavigationItem[]
  actions?: readonly NavigationAction[]
  navigationLabel?: string
  position?: 'inline' | 'sticky' | 'fixed'
}

export function NavbarFloating({
  brand,
  items,
  actions = [],
  navigationLabel = 'Navegação principal',
  position = 'inline',
  className,
  ...props
}: NavbarFloatingProps) {
  return (
    <header
      className={cn(
        'z-50 w-full px-3 py-3',
        position === 'sticky' && 'sticky top-0',
        position === 'fixed' && 'fixed inset-x-0 top-0',
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 rounded-2xl border border-white/20 bg-background/80 px-3 shadow-xl shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sm:px-4">
        <a
          href={brand.href ?? '/'}
          className="flex shrink-0 items-center gap-2 rounded-lg px-1 font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brand.logo}
          <span>{brand.label}</span>
        </a>

        <nav className="hidden flex-1 justify-center md:flex" aria-label={navigationLabel}>
          <ul className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  aria-current={item.current ? 'page' : undefined}
                  className={cn(
                    'block rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-background hover:text-foreground hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    item.current && 'bg-background text-foreground shadow-sm',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {actions.map((action, index) => (
            <Button
              key={action.href}
              asChild
              size="sm"
              variant={action.variant ?? (index === actions.length - 1 ? 'default' : 'ghost')}
              className="rounded-xl"
            >
              <a
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
              >
                {action.label}
                {index === actions.length - 1 ? (
                  <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                ) : null}
              </a>
            </Button>
          ))}
        </div>

        <div className="ml-auto md:hidden">
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
