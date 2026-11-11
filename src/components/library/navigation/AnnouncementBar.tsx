'use client'

import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AnnouncementBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  message: ReactNode
  action?: { label: string; href: string; external?: boolean }
  variant?: 'default' | 'accent' | 'dark'
  dismissible?: boolean
  dismissLabel?: string
  onDismiss?: () => void
}

export function AnnouncementBar({
  message,
  action,
  variant = 'default',
  dismissible = false,
  dismissLabel = 'Fechar aviso',
  onDismiss,
  className,
  ...props
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Aviso"
      className={cn(
        'relative px-10 py-2.5 text-center text-sm',
        variant === 'default' && 'border-b bg-background text-foreground',
        variant === 'accent' && 'bg-primary text-primary-foreground',
        variant === 'dark' && 'bg-foreground text-background',
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span>{message}</span>
        {action ? (
          <a
            href={action.href}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noopener noreferrer' : undefined}
            className="rounded-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            {action.label}
          </a>
        ) : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          aria-label={dismissLabel}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
