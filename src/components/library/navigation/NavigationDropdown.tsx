'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type NavigationDropdownItem = {
  label: string
  href?: string
  description?: string
  icon?: ReactNode
  shortcut?: string
  disabled?: boolean
  onSelect?: () => void
}

export type NavigationDropdownProps = {
  label: string
  items: readonly NavigationDropdownItem[]
  heading?: string
  variant?: 'compact' | 'rich' | 'icons'
  align?: 'start' | 'center' | 'end'
  trigger?: ReactNode
  className?: string
}

export function NavigationDropdown({
  label,
  items,
  heading,
  variant = 'compact',
  align = 'start',
  trigger,
  className,
}: NavigationDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className={cn('gap-2', className)}>
            {label}
            <ChevronDown className="h-4 w-4" aria-hidden />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn('rounded-xl p-2 shadow-xl', variant === 'rich' ? 'w-80' : 'min-w-56')}
      >
        {heading ? (
          <>
            <DropdownMenuLabel className="px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground">
              {heading}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {items.map((item) => {
          const itemContent = (
            <>
              {item.icon ? (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {item.icon}
                </span>
              ) : null}
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{item.label}</span>
                {variant === 'rich' && item.description ? (
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
              </span>
              {item.shortcut ? (
                <kbd className="ml-4 text-[10px] font-medium text-muted-foreground">
                  {item.shortcut}
                </kbd>
              ) : null}
            </>
          )

          return (
            <DropdownMenuItem
              key={`${item.label}-${item.href ?? 'action'}`}
              disabled={item.disabled}
              onSelect={item.onSelect}
              asChild={Boolean(item.href)}
              className={cn(
                'gap-3 rounded-lg px-3 py-2 focus:bg-primary/10',
                variant === 'rich' && 'items-start py-3',
              )}
            >
              {item.href ? <Link href={item.href}>{itemContent}</Link> : itemContent}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
