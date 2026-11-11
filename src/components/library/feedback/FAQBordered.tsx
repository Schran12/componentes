'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type FAQBorderedItem = {
  question: string
  answer: string
}

export type FAQBorderedProps = {
  items: readonly FAQBorderedItem[]
  title?: string
  eyebrow?: string
  description?: string
  embedded?: boolean
  defaultOpenIndex?: number | null
  tone?: AccentTone
  className?: string
}

const answerBackgrounds: Record<AccentTone, string> = {
  glow: 'bg-[#121212]',
  industrial: 'bg-slate-50',
  'industrial-dark': 'bg-slate-950',
}

/** FAQ em bloco contornado com perguntas sobre fundo de painel e respostas expansíveis. */
export function FAQBordered({
  items,
  title,
  eyebrow = 'FAQ',
  description,
  embedded = false,
  defaultOpenIndex = 0,
  tone = 'glow',
  className,
}: FAQBorderedProps) {
  const t = getAccentTone(tone)
  const baseId = useId()
  const [active, setActive] = useState<number | null>(defaultOpenIndex)

  const list = (
    <div className={cn('divide-y border', t.divide, t.border, tone === 'glow' && 'rounded-md')}>
      {items.map((item, index) => {
        const isOpen = active === index
        const panelId = `${baseId}-${index}`
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setActive(isOpen ? null : index)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors sm:px-7',
                  t.panel,
                  t.panelHover,
                  t.focus,
                )}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className={cn('text-sm font-semibold tracking-wide sm:text-base', t.strong)}>
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-300',
                    t.accent,
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              className={cn(
                'grid transition-all duration-500 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden" aria-hidden={!isOpen}>
                <p
                  className={cn(
                    'px-5 py-5 text-sm leading-relaxed sm:px-7 sm:text-base',
                    answerBackgrounds[tone],
                    t.body,
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  if (embedded) {
    return (
      <div className={className}>
        {title ? (
          <EyebrowHeading
            tone={tone}
            eyebrow={eyebrow}
            title={title}
            titleAs="h2"
            className="mb-6"
          />
        ) : null}
        {list}
      </div>
    )
  }

  return (
    <section className={cn(t.section, className)}>
      <div className="container py-14 lg:py-16">
        {title ? (
          <EyebrowHeading
            tone={tone}
            eyebrow={eyebrow}
            title={title}
            description={description}
            layout="split"
            className="mb-10 lg:mb-12"
          />
        ) : null}
        {list}
      </div>
    </section>
  )
}
