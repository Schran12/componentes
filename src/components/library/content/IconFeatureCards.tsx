import type { ReactNode } from 'react'

import { AccentButton } from '@/components/library/primitives/AccentButton'
import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type IconFeatureCardItem = {
  title: string
  description: string
  icon?: ReactNode
  action?: { label: string; href: string }
}

export type IconFeatureCardsProps = {
  title: string
  items: readonly IconFeatureCardItem[]
  eyebrow?: string
  description?: string
  columns?: 2 | 3 | 4
  tone?: AccentTone
  className?: string
}

const columnClasses = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

const cardStyles: Record<AccentTone, { card: string; icon: string }> = {
  glow: {
    card: 'rounded-md bg-[#221d2f]',
    icon: 'rounded-xl bg-[#121212] text-[#ffb0eb]',
  },
  industrial: {
    card: 'border border-slate-200 bg-white',
    icon: 'bg-slate-100 text-amber-600',
  },
  'industrial-dark': {
    card: 'border border-white/10 bg-slate-900',
    icon: 'bg-slate-950 text-amber-500',
  },
}

/** Cards de diferenciais com ícone em destaque, texto e ação individual. */
export function IconFeatureCards({
  title,
  items,
  eyebrow,
  description,
  columns = 3,
  tone = 'glow',
  className,
}: IconFeatureCardsProps) {
  const t = getAccentTone(tone)
  const styles = cardStyles[tone]

  return (
    <section className={cn('w-full py-12 lg:py-16', t.section, className)}>
      <div className="container">
        <EyebrowHeading
          tone={tone}
          eyebrow={eyebrow}
          title={title}
          description={description}
          className="mb-8"
        />
        <div className={cn('grid grid-cols-1 gap-6', columnClasses[columns])}>
          {items.map((item) => (
            <article
              key={item.title}
              className={cn(
                'relative flex min-h-[240px] flex-col items-start gap-3 overflow-hidden p-6',
                styles.card,
              )}
            >
              {item.icon ? (
                <div
                  className={cn(
                    'p-4 [&_img]:h-12 [&_img]:w-12 [&_svg]:h-8 [&_svg]:w-8',
                    styles.icon,
                  )}
                  aria-hidden
                >
                  {item.icon}
                </div>
              ) : null}
              <h3
                className={cn(
                  'text-[clamp(1.25rem,2vw,1.5rem)] font-semibold',
                  tone !== 'glow' && 'uppercase tracking-wide',
                  t.strong,
                )}
              >
                {item.title}
              </h3>
              <p className={cn('m-0', t.body)}>{item.description}</p>
              {item.action ? (
                <AccentButton href={item.action.href} tone={tone} className="mt-auto">
                  {item.action.label}
                </AccentButton>
              ) : null}
              <span className={cn('absolute inset-x-0 bottom-0 h-px', t.line)} aria-hidden />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
