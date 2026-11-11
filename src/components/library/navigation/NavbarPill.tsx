'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { MobileDrawer } from './MobileDrawer'
import type { NavigationAction, NavigationBrand, NavigationItem } from './types'

export type NavbarPillProps = {
  brand: NavigationBrand
  items: readonly NavigationItem[]
  action?: NavigationAction
  theme?: 'dark' | 'light'
  floating?: boolean
  showThemeToggle?: boolean
  themeToggleLabel?: string
  onThemeToggle?: () => void
  utility?: ReactNode
  className?: string
}

export function NavbarPill({
  brand,
  items,
  action,
  theme = 'dark',
  floating = true,
  showThemeToggle = false,
  themeToggleLabel = 'Alternar tema',
  onThemeToggle,
  utility,
  className,
}: NavbarPillProps) {
  const dark = theme === 'dark'

  return (
    <header className={cn('relative z-40 w-full px-4 py-4', className)}>
      <div
        className={cn(
          'mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6',
          floating && 'rounded-2xl border shadow-2xl backdrop-blur-xl',
          dark
            ? 'border-white/10 bg-[#15161b]/95 text-white shadow-black/30'
            : 'border-slate-200 bg-white/95 text-slate-950 shadow-slate-200/60',
        )}
      >
        <Link
          href={brand.href ?? '/'}
          className="flex shrink-0 items-center gap-3 rounded-md font-black tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {brand.logo}
          <span>{brand.label}</span>
        </Link>

        <nav className="hidden flex-1 justify-center lg:flex" aria-label="Navegação principal">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-lg px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    dark
                      ? 'text-white/65 hover:bg-white/5 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                    item.current &&
                      (dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-950'),
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {utility}
          {showThemeToggle ? (
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={themeToggleLabel}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                dark ? 'text-white/70 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          ) : null}
          {action ? (
            <Button
              asChild
              variant={dark ? 'secondary' : 'default'}
              className="gap-2 rounded-xl px-5"
            >
              <Link href={action.href}>
                {action.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="ml-auto lg:hidden">
          <MobileDrawer brand={brand} items={items} actions={action ? [action] : []} />
        </div>
      </div>
    </header>
  )
}
