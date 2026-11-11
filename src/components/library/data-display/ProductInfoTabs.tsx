'use client'

import { useId, useState } from 'react'
import { Phone } from 'lucide-react'

import { AccentButton } from '@/components/library/primitives/AccentButton'
import {
  getAccentTone,
  padIndex,
  type AccentTone,
} from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type ProductInfoTabsProps = {
  paragraphs: readonly string[]
  details: readonly { title: string; description?: string }[]
  descriptionLabel?: string
  detailsLabel?: string
  action?: { label: string; href: string }
  tone?: AccentTone
  className?: string
}

type TabId = 'description' | 'details'

/** Painel de produto com abas Descrição/Detalhes, transição suave e chamada de orçamento. */
export function ProductInfoTabs({
  paragraphs,
  details,
  descriptionLabel = 'Descrição',
  detailsLabel = 'Detalhes',
  action,
  tone = 'industrial',
  className,
}: ProductInfoTabsProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'
  const baseId = useId()
  const [tab, setTab] = useState<TabId>('description')
  const tabs: { id: TabId; label: string }[] = [
    { id: 'description', label: descriptionLabel },
    { id: 'details', label: detailsLabel },
  ]

  const activeTab = isGlow
    ? 'bg-gradient-to-r from-[#86196b] to-[#5327b3] text-white'
    : tone === 'industrial'
      ? 'bg-slate-950 text-white'
      : 'bg-amber-500 text-slate-950'
  const idleTab = isGlow
    ? 'bg-[#121212] text-[#c1c1c1] hover:text-white'
    : tone === 'industrial'
      ? 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      : 'bg-slate-950 text-slate-400 hover:text-white'

  const eyebrow = (label: string) => (
    <div className="mb-4 flex items-center gap-3">
      <span className={cn('h-px w-8', t.line)} aria-hidden />
      <span className={cn('text-[0.65rem] uppercase tracking-[0.28em]', t.accent)}>{label}</span>
    </div>
  )

  return (
    <div
      className={cn(
        'flex min-h-[28rem] flex-col border',
        t.border,
        t.panel,
        isGlow && 'overflow-hidden rounded-2xl',
        className,
      )}
    >
      <div
        className={cn('grid grid-cols-2 border-b', t.border)}
        role="tablist"
        aria-label="Informações do produto"
      >
        {tabs.map((item, index) => {
          const selected = tab === item.id
          return (
            <button
              key={item.id}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  const next: TabId = tab === 'description' ? 'details' : 'description'
                  setTab(next)
                  document.getElementById(`${baseId}-tab-${next}`)?.focus()
                }
              }}
              className={cn(
                'relative px-4 py-4 text-sm font-semibold uppercase tracking-wide transition-all duration-500 ease-out sm:px-6 sm:py-5 sm:text-base',
                index > 0 && cn('border-l', t.border),
                selected ? activeTab : idleTab,
                t.focus,
              )}
            >
              {item.label}
              <span
                className={cn(
                  'absolute inset-x-0 bottom-0 h-0.5 origin-left transition-transform duration-500 ease-out',
                  isGlow ? 'bg-[#ffb0eb]' : 'bg-amber-500',
                  selected ? 'scale-x-100' : 'scale-x-0',
                )}
                aria-hidden
              />
            </button>
          )
        })}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
        <div className="relative flex-1">
          <div
            id={`${baseId}-panel-description`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-description`}
            hidden={tab !== 'description'}
            className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2"
          >
            {eyebrow(descriptionLabel)}
            <div className={cn('space-y-4 text-base leading-relaxed', t.body)}>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div
            id={`${baseId}-panel-details`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-details`}
            hidden={tab !== 'details'}
            className="duration-500 animate-in fade-in-0 slide-in-from-bottom-2"
          >
            {eyebrow(detailsLabel)}
            <ul className={cn('divide-y border-y', t.divide, t.border)}>
              {details.map((detail, index) => (
                <li key={detail.title} className="flex items-start gap-4 py-4 sm:items-center">
                  <span className={cn('text-xs tracking-[0.2em]', t.accent)}>
                    {padIndex(index)}
                  </span>
                  <div>
                    <p className={cn('text-base font-medium', t.strong)}>{detail.title}</p>
                    {detail.description ? (
                      <p className={cn('mt-1 text-sm leading-relaxed', t.muted)}>
                        {detail.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {action ? (
          <div className="mt-auto pt-8">
            <AccentButton
              href={action.href}
              tone={tone === 'industrial' ? 'industrial-dark' : tone}
              icon={<Phone className="h-4 w-4" aria-hidden />}
            >
              {action.label}
            </AccentButton>
          </div>
        ) : null}
      </div>
    </div>
  )
}
