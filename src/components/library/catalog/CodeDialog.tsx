'use client'

import { useState } from 'react'
import { Check, Code2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type CodeDialogProps = {
  title: string
  code: string
  description?: string
  triggerLabel?: string
  triggerClassName?: string
}

export function CodeDialog({
  title,
  code,
  description = 'Copie o snippet e ajuste conteúdo, imagens e ações pelas props.',
  triggerLabel = 'Ver código',
  triggerClassName,
}: CodeDialogProps) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className={triggerClassName}>
          <Code2 className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[88vh] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between border-b bg-slate-900 px-4 py-2 text-xs text-slate-400">
          <span>tsx</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={copyCode}
            className={cn(
              'text-slate-200 hover:bg-white/10 hover:text-white',
              copied && 'text-emerald-400',
            )}
          >
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copiado' : 'Copiar código'}
          </Button>
        </div>
        <pre className="min-h-0 flex-1 overflow-auto bg-slate-950 p-5 text-xs leading-6 text-slate-100 sm:text-sm">
          <code>{code}</code>
        </pre>
      </DialogContent>
    </Dialog>
  )
}
