import * as React from 'react'
import type { VariantProps } from 'class-variance-authority'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ActionItem {
  label: React.ReactNode
  href: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  external?: boolean
  ariaLabel?: string
  className?: string
}

export interface ActionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: readonly ActionItem[]
  align?: 'left' | 'center' | 'right'
  mobileStack?: boolean
}

const alignments: Record<NonNullable<ActionGroupProps['align']>, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export function ActionGroup({
  actions = [],
  align = 'left',
  mobileStack = false,
  children,
  className,
  ...props
}: ActionGroupProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        alignments[align],
        mobileStack && 'max-sm:flex-col max-sm:items-stretch',
        className,
      )}
      {...props}
    >
      {actions.map((action) => (
        <Button
          key={`${action.href}-${String(action.label)}`}
          asChild
          variant={action.variant}
          size={action.size}
          className={action.className}
        >
          <a
            href={action.href}
            aria-label={action.ariaLabel}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noopener noreferrer' : undefined}
          >
            {action.label}
          </a>
        </Button>
      ))}
      {children}
    </div>
  )
}
