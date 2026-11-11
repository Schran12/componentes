import type { ReactNode } from 'react'

import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import {
  getAccentTone,
  padIndex,
  type AccentTone,
} from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type NumberedCardGridItem = {
  title: string
  description: string
  icon?: ReactNode
}

export type NumberedCardGridProps = {
  items: readonly NumberedCardGridItem[]
  title?: string
  eyebrow?: string
  description?: string
  variant?: 'cards' | 'band'
  columns?: 2 | 3 | 4
  hoverFill?: boolean
  tone?: AccentTone
  className?: string
}

const columnClasses = {
  2: 'sm:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

const gridLines: Record<AccentTone, string> = {
  glow: 'bg-[#493849] border-[#493849]',
  industrial: 'bg-slate-200 border-slate-200',
  'industrial-dark': 'bg-white/10 border-white/10',
}

const hoverFills: Record<AccentTone, { card: string; text: string; muted: string }> = {
  glow: {
    card: 'hover:bg-gradient-to-br hover:from-[#c642a5] hover:to-[#7c39cf]',
    text: 'group-hover:text-white',
    muted: 'group-hover:text-white/90',
  },
  industrial: {
    card: 'hover:bg-slate-950',
    text: 'group-hover:text-white',
    muted: 'group-hover:text-slate-300',
  },
  'industrial-dark': {
    card: 'hover:bg-amber-500',
    text: 'group-hover:text-slate-950',
    muted: 'group-hover:text-slate-900',
  },
}

/** Grade de cards numerados unidos por linhas finas, com preenchimento no hover ou faixa editorial. */
export function NumberedCardGrid({
  items,
  title,
  eyebrow,
  description,
  variant = 'cards',
  columns = 3,
  hoverFill = true,
  tone = 'glow',
  className,
}: NumberedCardGridProps) {
  const t = getAccentTone(tone)
  const band = variant === 'band'
  const fill = hoverFills[tone]
  const filled = hoverFill && !band

  return (
    <section className={cn(t.section, className)}>
      <div className={cn('container', band ? 'py-0' : 'py-14 lg:py-16')}>
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

        <div
          className={cn(
            'grid grid-cols-1 gap-px',
            columnClasses[columns],
            gridLines[tone],
            !band && 'border',
          )}
        >
          {items.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                'group flex flex-col transition-colors duration-500',
                band
                  ? cn('px-6 py-10 sm:px-7 sm:py-12', t.section)
                  : cn('min-h-[15rem] justify-between p-7 sm:p-8', t.panel),
                filled && fill.card,
              )}
            >
              {band ? (
                <span className={cn('text-4xl font-semibold tracking-wide sm:text-5xl', t.accent)}>
                  {padIndex(index)}
                </span>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      'text-xs tracking-[0.22em] transition-colors duration-500',
                      t.accent,
                      filled && fill.text,
                    )}
                  >
                    {padIndex(index)}
                  </span>
                  {item.icon ? (
                    <span
                      className={cn(
                        'transition-colors duration-500 [&_svg]:h-5 [&_svg]:w-5',
                        t.muted,
                        filled && fill.text,
                      )}
                      aria-hidden
                    >
                      {item.icon}
                    </span>
                  ) : null}
                </div>
              )}
              <div className={band ? 'mt-5' : 'mt-8'}>
                <h3
                  className={cn(
                    'text-xl font-semibold tracking-wide transition-colors duration-500',
                    tone !== 'glow' && 'uppercase',
                    t.strong,
                    filled && fill.text,
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    'mt-3 text-sm leading-relaxed transition-colors duration-500',
                    t.body,
                    filled && fill.muted,
                  )}
                >
                  {item.description}
                </p>
                {!band && tone !== 'glow' ? (
                  <span
                    className={cn(
                      'mt-6 block h-px w-8 bg-amber-500 transition-all duration-500 group-hover:w-14',
                      filled && tone === 'industrial-dark' && 'group-hover:bg-slate-950',
                    )}
                    aria-hidden
                  />
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
