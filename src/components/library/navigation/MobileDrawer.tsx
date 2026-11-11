'use client'

import * as React from 'react'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import type { NavigationAction, NavigationBrand, NavigationItem } from './types'

export interface MobileDrawerProps {
  brand: NavigationBrand
  items: readonly NavigationItem[]
  actions?: readonly NavigationAction[]
  trigger?: React.ReactNode
  triggerLabel?: string
  navigationLabel?: string
  className?: string
}

function ExternalAttributes({ external }: { external?: boolean }) {
  return external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

export function MobileDrawer({
  brand,
  items,
  actions = [],
  trigger,
  triggerLabel = 'Abrir menu',
  navigationLabel = 'Navegação móvel',
  className,
}: MobileDrawerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" aria-label={triggerLabel}>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          'bottom-0 left-auto right-0 top-0 flex h-dvh w-[min(24rem,90vw)] max-w-none translate-x-0 translate-y-0 flex-col rounded-none p-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
          className,
        )}
      >
        <div className="border-b px-6 py-5 pr-14">
          <DialogTitle className="text-left">
            <a href={brand.href ?? '/'} className="inline-flex items-center gap-3">
              {brand.logo}
              <span>{brand.label}</span>
            </a>
          </DialogTitle>
          <DialogDescription className="sr-only">{navigationLabel}</DialogDescription>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label={navigationLabel}>
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <DialogClose asChild>
                  <a
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      item.current && 'bg-muted text-primary',
                    )}
                    {...ExternalAttributes(item)}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </DialogClose>
                {item.children?.length ? (
                  <ul className="mb-2 ml-5 border-l pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <DialogClose asChild>
                          <a
                            href={child.href}
                            aria-current={child.current ? 'page' : undefined}
                            className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            {...ExternalAttributes(child)}
                          >
                            {child.label}
                          </a>
                        </DialogClose>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        {actions.length ? (
          <div className="grid gap-2 border-t p-4">
            {actions.map((action) => (
              <Button key={action.href} asChild variant={action.variant}>
                <a href={action.href} {...ExternalAttributes(action)}>
                  {action.label}
                </a>
              </Button>
            ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
