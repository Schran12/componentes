'use client'

import { MoreHorizontal, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type DropdownAction = {
  label: string
  onSelect: () => void
  icon?: LucideIcon
  disabled?: boolean
  destructive?: boolean
}
export type DropdownActionsProps = { actions: DropdownAction[]; label?: string; menuLabel?: string }

export function DropdownActions({
  actions,
  label = 'Abrir ações',
  menuLabel = 'Ações disponíveis',
}: DropdownActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" size="icon" variant="ghost" aria-label={label}>
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map(({ label: actionLabel, onSelect, icon: Icon, disabled, destructive }) => (
          <DropdownMenuItem
            key={actionLabel}
            onSelect={onSelect}
            disabled={disabled}
            className={destructive ? 'text-destructive focus:text-destructive' : undefined}
          >
            {Icon ? <Icon className="mr-2 h-4 w-4" aria-hidden="true" /> : null}
            {actionLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
