'use client'

import { Check, Terminal } from 'lucide-react'
import { useState } from 'react'

export function ComponentIdChip({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)
  const command = `componentes-bloomin add ${id}`

  async function copy() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copiar: ${command}`}
      aria-label={`Copiar comando de instalação: ${command}`}
      className="group/id mt-1 inline-flex max-w-full items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {copied ? (
        <Check className="h-3 w-3 shrink-0 text-emerald-600" aria-hidden="true" />
      ) : (
        <Terminal className="h-3 w-3 shrink-0" aria-hidden="true" />
      )}
      <span className="truncate">{copied ? 'comando copiado' : id}</span>
    </button>
  )
}
