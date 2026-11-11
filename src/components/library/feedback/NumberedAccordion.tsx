'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import {
  getAccentTone,
  padIndex,
  type AccentTone,
} from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type NumberedAccordionItem = {
  title: string
  description: string
}

export type NumberedAccordionProps = {
  items: readonly NumberedAccordionItem[]
  defaultOpenIndex?: number | null
  tone?: AccentTone
  className?: string
}

/** Lista de especificações numeradas em acordeão, com um item aberto por vez. */
export function NumberedAccordion({
  items,
  defaultOpenIndex = 0,
  tone = 'glow',
  className,
}: NumberedAccordionProps) {
  const t = getAccentTone(tone)
  const baseId = useId()
  const [active, setActive] = useState<number | null>(defaultOpenIndex)

  return (
    <div className={cn('divide-y border-y', t.divide, t.border, className)}>
      {items.map((item, index) => {
        const isOpen = active === index
        const panelId = `${baseId}-${index}`
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setActive(isOpen ? null : index)}
              className={cn(
                'flex w-full items-center justify-between gap-6 py-5 text-left transition-colors',
                t.panelHover,
                t.focus,
              )}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span className="flex items-start gap-4 sm:items-center">
                <span className={cn('text-xs tracking-[0.2em]', t.accent)}>{padIndex(index)}</span>
                <span className={cn('text-base font-medium', t.strong)}>{item.title}</span>
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-300',
                  isOpen ? cn('rotate-180', t.accent) : t.muted,
                )}
                aria-hidden
              />
            </button>
            <div
              id={panelId}
              className={cn(
                'grid transition-all duration-500 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden" aria-hidden={!isOpen}>
                <p
                  className={cn('pb-5 ps-10 text-sm leading-relaxed sm:ps-12 sm:text-base', t.body)}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
