'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, Copy, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({
  value,
  label = 'Copiar código',
  iconOnly = false,
  icon = 'copy',
  className,
}: {
  value: string
  label?: string
  iconOnly?: boolean
  icon?: 'copy' | 'sparkles'
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const IdleIcon = icon === 'sparkles' ? Sparkles : Copy

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  if (iconOnly) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={copy}
        aria-label={label}
        title={label}
        className={cn('w-8 px-0', className)}
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <IdleIcon className="h-4 w-4" />}
      </Button>
    )
  }

  const visibleLabel = label === 'Copiar código' ? 'Copiar' : label

  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={copy}
      aria-label={label}
      className={className}
    >
      {copied ? <Check className="mr-2 h-4 w-4" /> : <IdleIcon className="mr-2 h-4 w-4" />}
      {copied ? 'Copiado' : visibleLabel}
    </Button>
  )
}
