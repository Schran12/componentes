'use client'

import type { ReactNode } from 'react'
import { Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export type PreviewDialogProps = {
  title: string
  children: ReactNode
  description?: string
  triggerLabel?: string
}

export function PreviewDialog({
  title,
  children,
  description = 'Preview amplo e interativo. Use os controles normalmente para testar o componente.',
  triggerLabel = 'Abrir preview',
}: PreviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <Maximize2 className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] w-[calc(100%-1.5rem)] max-w-[1400px] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b bg-background px-5 py-4 pr-12">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="relative min-h-0 flex-1 overflow-auto bg-background">
          <div className="min-h-full">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
