'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type ExpandableTextBoxProps = {
  paragraphs: readonly string[]
  collapsedLabel?: string
  expandedLabel?: string
  defaultOpen?: boolean
  tone?: AccentTone
  className?: string
}

/** Caixa "leia mais" que expande parágrafos extras com transição de altura. */
export function ExpandableTextBox({
  paragraphs,
  collapsedLabel = 'Ler mais',
  expandedLabel = 'Mostrar menos',
  defaultOpen = false,
  tone = 'glow',
  className,
}: ExpandableTextBoxProps) {
  const t = getAccentTone(tone)
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className={cn('border', t.border, t.panel, tone === 'glow' && 'rounded-md', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors sm:px-6',
          t.panelHover,
          t.focus,
        )}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className={cn('text-sm font-semibold tracking-wide', t.strong)}>
          {open ? expandedLabel : collapsedLabel}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 transition-transform duration-300',
            t.accent,
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        className={cn(
          'grid transition-all duration-500 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden" aria-hidden={!open}>
          <div
            className={cn(
              'space-y-4 border-t px-5 py-5 text-sm leading-relaxed sm:px-6 sm:py-6 sm:text-base',
              t.border,
              t.body,
            )}
          >
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
