'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { downloadRegistryItemZip } from '@/lib/downloadSource'
import { Check, Download, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function DownloadSourceButton({
  itemId,
  label = 'Baixar arquivos',
  variant = 'outline',
  size = 'sm',
  className,
}: {
  /** ID do registry: `navbar-accent` ou `recipe-industrial-services`. */
  itemId: string
  label?: string
  variant?: 'outline' | 'ghost' | 'default' | 'secondary'
  size?: 'sm' | 'default' | 'icon'
  className?: string
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleClick() {
    setStatus('loading')
    try {
      await downloadRegistryItemZip(itemId)
      setStatus('done')
      window.setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      window.setTimeout(() => setStatus('idle'), 2500)
    }
  }

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={status === 'loading'}
      className={cn(className)}
      title="Baixa o código-fonte em ZIP, sem CLI e sem URL do catálogo"
    >
      {status === 'loading' ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : status === 'done' ? (
        <Check className="mr-1.5 h-4 w-4" />
      ) : (
        <Download className="mr-1.5 h-4 w-4" />
      )}
      {status === 'loading'
        ? 'Baixando…'
        : status === 'done'
          ? 'Baixado'
          : status === 'error'
            ? 'Falhou'
            : label}
    </Button>
  )
}
