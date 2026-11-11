'use client'

import type { HTMLAttributes, ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type EmptyStateAction = {
  label: string
  href?: string
  onClick?: () => void
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  primaryAction?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  variant?: 'default' | 'compact' | 'bordered'
}

function Action({ action, primary }: { action: EmptyStateAction; primary: boolean }) {
  const variant = primary ? 'default' : 'outline'
  return action.href ? (
    <Button asChild variant={variant}>
      <a href={action.href}>{action.label}</a>
    </Button>
  ) : (
    <Button type="button" variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  )
}

export function EmptyState({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'compact' ? 'px-4 py-8' : 'px-6 py-16',
        variant === 'bordered' && 'rounded-2xl border border-dashed bg-muted/20',
        className,
      )}
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      {description ? (
        <div className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</div>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {primaryAction ? <Action action={primaryAction} primary /> : null}
          {secondaryAction ? <Action action={secondaryAction} primary={false} /> : null}
        </div>
      ) : null}
    </div>
  )
}
