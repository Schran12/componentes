import type { ReactNode } from 'react'

import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type CTACenteredCardProps = {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  tone?: AccentTone
  /** `primary` ignora o tom e usa o cartão na cor primária do tema. */
  variant?: 'accent' | 'primary'
  className?: string
}

/** Chamada para ação centralizada em cartão com sombra de brilho em gradiente. */
export function CTACenteredCard({
  title,
  description,
  eyebrow,
  actions,
  tone = 'glow',
  variant = 'accent',
  className,
}: CTACenteredCardProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'

  if (variant === 'primary') {
    return (
      <section className={cn('w-full bg-background py-12 lg:py-16', className)}>
        <div className="container">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-xl shadow-primary/25 sm:px-12">
            {eyebrow ? (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
                {eyebrow}
              </span>
            ) : null}
            <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
            {description ? (
              <p className="max-w-2xl text-base leading-relaxed text-primary-foreground/85 md:text-lg">
                {description}
              </p>
            ) : null}
            {actions ? (
              <div className="flex flex-wrap items-center justify-center gap-4">{actions}</div>
            ) : null}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('w-full py-12 lg:py-16', t.section, className)}>
      <div className="container">
        <div
          className={cn(
            'mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-12 text-center sm:px-12',
            t.panel,
            isGlow
              ? 'rounded-2xl shadow-[0.25rem_0_0.25rem_#86196b,0_0.25rem_0.25rem_#5327b3]'
              : cn('border border-t-4 border-t-amber-500', t.border),
          )}
        >
          {eyebrow ? (
            <span className={cn('text-xs font-semibold uppercase tracking-[0.2em]', t.accent)}>
              {eyebrow}
            </span>
          ) : null}
          <h2 className={cn('text-3xl md:text-4xl', t.heading, isGlow && 'mx-auto')}>{title}</h2>
          {description ? (
            <p className={cn('max-w-2xl text-base leading-relaxed md:text-lg', t.body)}>
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className="flex flex-wrap items-center justify-center gap-4">{actions}</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
