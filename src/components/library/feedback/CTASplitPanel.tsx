import type { ReactNode } from 'react'

import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type CTASplitPanelProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  tone?: AccentTone
  className?: string
}

/** Painel com borda: texto à esquerda e ações à direita, empilhado no mobile. */
export function CTASplitPanel({
  title,
  description,
  eyebrow,
  actions,
  tone = 'industrial',
  className,
}: CTASplitPanelProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'

  return (
    <section className={cn('w-full py-12 lg:py-16', t.section, className)}>
      <div className="container">
        <div
          className={cn(
            'relative flex flex-col gap-8 overflow-hidden border p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12',
            t.panel,
            t.border,
            isGlow && 'rounded-2xl',
          )}
        >
          <span className={cn('absolute inset-y-0 left-0 w-1', t.line)} aria-hidden />
          <div className="max-w-2xl">
            {eyebrow ? (
              <span
                className={cn(
                  'mb-3 inline-block text-xs font-semibold uppercase tracking-[0.2em]',
                  t.accent,
                )}
              >
                {eyebrow}
              </span>
            ) : null}
            <h2 className={cn('text-2xl md:text-3xl', t.heading)}>{title}</h2>
            {description ? (
              <p className={cn('mt-4 text-base leading-relaxed', t.body)}>{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  )
}
