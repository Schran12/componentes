'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export type DialogShowcaseProps = {
  triggerLabel: string
  title: string
  description?: string
  children?: React.ReactNode
  confirmLabel?: string
  onConfirm?: () => void
}

export function DialogShowcase({
  triggerLabel,
  title,
  description,
  children,
  confirmLabel = 'Continuar',
  onConfirm,
}: DialogShowcaseProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children ? <div className="py-2">{children}</div> : null}
        {onConfirm ? (
          <DialogFooter>
            <Button type="button" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
