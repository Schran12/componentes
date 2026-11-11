import Link from 'next/link'
import { ArrowDownToLine } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { MobileDrawer } from './MobileDrawer'
import type { NavigationAction, NavigationBrand, NavigationItem } from './types'

export type NavbarMinimalProps = {
  brand: NavigationBrand
  items: readonly NavigationItem[]
  action?: NavigationAction
  theme?: 'dark' | 'light'
  accent?: boolean
  hideBrandLabel?: boolean
  className?: string
}

export function NavbarMinimal({
  brand,
  items,
  action,
  theme = 'dark',
  accent = true,
  hideBrandLabel = true,
  className,
}: NavbarMinimalProps) {
  const dark = theme === 'dark'

  return (
    <header
      className={cn(
        'relative z-40 w-full border-b',
        accent && 'border-t-2 border-t-primary',
        dark ? 'border-white/10 bg-black text-white' : 'border-slate-200 bg-white text-slate-950',
        className,
      )}
    >
      <div className="container grid h-20 grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href={brand.href ?? '/'}
          className="flex w-fit items-center gap-3 rounded-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {brand.logo}
          <span className={cn(hideBrandLabel && 'sr-only')}>{brand.label}</span>
        </Link>

        <nav className="hidden md:block" aria-label="Navegação principal">
          <ul className="flex items-center justify-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    dark ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-slate-950',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden justify-self-end md:block">
          {action ? (
            <Button
              asChild
              variant={dark ? 'secondary' : 'default'}
              className="gap-2 rounded-full px-6"
            >
              <Link href={action.href}>
                {action.label}
                <ArrowDownToLine className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="col-start-3 row-start-1 justify-self-end md:hidden">
          <MobileDrawer brand={brand} items={items} actions={action ? [action] : []} />
        </div>
      </div>
    </header>
  )
}
