import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

import {
  getAccentTone,
  padIndex,
  type AccentTone,
} from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type SuccessStateStep = {
  title: string
  description?: string
}

export type SuccessStateCardProps = {
  title: string
  description?: string
  icon?: ReactNode
  steps?: readonly SuccessStateStep[]
  stepsTitle?: string
  helper?: ReactNode
  actions?: ReactNode
  tone?: AccentTone
  className?: string
}

/** Página/estado de confirmação (ex.: "obrigado") com próximos passos e ações. */
export function SuccessStateCard({
  title,
  description,
  icon,
  steps,
  stepsTitle = 'Próximos passos',
  helper,
  actions,
  tone = 'glow',
  className,
}: SuccessStateCardProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'

  return (
    <section className={cn('w-full py-16 lg:py-24', t.section, className)}>
      <div className="container">
        <div
          className={cn(
            'mx-auto flex max-w-3xl flex-col items-center gap-6 border px-6 py-12 text-center sm:px-12',
            t.panel,
            t.border,
            isGlow ? 'rounded-2xl' : 'border-t-4 border-t-amber-500',
          )}
        >
          <span
            className={cn(
              'flex h-16 w-16 items-center justify-center',
              t.fill,
              t.onFill,
              isGlow ? 'rounded-full' : '',
            )}
            aria-hidden
          >
            {icon ?? <CheckCircle2 className="h-8 w-8" />}
          </span>
          <h1 className={cn('text-3xl md:text-4xl', t.heading, isGlow && 'mx-auto')}>{title}</h1>
          {description ? (
            <p className={cn('max-w-xl text-base leading-relaxed md:text-lg', t.body)}>
              {description}
            </p>
          ) : null}

          {steps?.length ? (
            <div className="w-full text-left">
              <h2
                className={cn('mb-4 text-sm font-semibold uppercase tracking-[0.18em]', t.accent)}
              >
                {stepsTitle}
              </h2>
              <ol className={cn('divide-y border', t.divide, t.border, isGlow && 'rounded-xl')}>
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4 p-4 sm:p-5">
                    <span className={cn('text-sm font-semibold tabular-nums', t.accent)}>
                      {padIndex(index)}
                    </span>
                    <div>
                      <p className={cn('font-semibold', t.strong)}>{step.title}</p>
                      {step.description ? (
                        <p className={cn('mt-1 text-sm', t.muted)}>{step.description}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {helper ? <div className={cn('text-sm', t.muted)}>{helper}</div> : null}
          {actions ? (
            <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
