import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { getAccentTone, type AccentTone } from './accentTones'

export type EyebrowHeadingProps = {
  title: ReactNode
  eyebrow?: ReactNode
  description?: ReactNode
  tone?: AccentTone
  align?: 'left' | 'center'
  layout?: 'stacked' | 'split'
  size?: 'md' | 'lg'
  titleAs?: 'h1' | 'h2' | 'h3'
  action?: ReactNode
  className?: string
}

const titleSizes = {
  md: 'text-3xl leading-[1.15] sm:text-4xl lg:text-[2.5rem]',
  lg: 'text-3xl leading-[1.12] sm:text-4xl md:text-5xl lg:text-[3.25rem]',
}

/** Cabeçalho de seção com linha de destaque, título temático e descrição opcional ao lado. */
export function EyebrowHeading({
  title,
  eyebrow,
  description,
  tone = 'glow',
  align = 'left',
  layout = 'stacked',
  size = 'md',
  titleAs: Title = 'h2',
  action,
  className,
}: EyebrowHeadingProps) {
  const t = getAccentTone(tone)
  const centered = align === 'center'
  const split = layout === 'split' && !centered

  const line = <span className={cn('h-px w-8 shrink-0', t.line)} aria-hidden />

  return (
    <div
      className={cn(
        split && 'flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between',
        centered && 'mx-auto max-w-3xl text-center',
        className,
      )}
    >
      <div className={cn(split ? 'max-w-2xl' : centered ? '' : 'max-w-3xl')}>
        {eyebrow ? (
          <div className={cn('mb-4 flex items-center gap-3', centered && 'justify-center')}>
            {line}
            <span
              className={cn('text-[0.65rem] font-medium uppercase tracking-[0.28em]', t.accent)}
            >
              {eyebrow}
            </span>
            {centered ? line : null}
          </div>
        ) : null}
        <Title className={cn(t.heading, titleSizes[size], centered && 'mx-auto')}>{title}</Title>
        {!split && description ? (
          <p
            className={cn(
              'mt-5 max-w-2xl text-base leading-relaxed md:text-lg',
              t.body,
              centered && 'mx-auto',
            )}
          >
            {description}
          </p>
        ) : null}
        {!split && action ? (
          <div className={cn('mt-8 flex flex-wrap gap-3', centered && 'justify-center')}>
            {action}
          </div>
        ) : null}
      </div>
      {split && (description || action) ? (
        <div className="max-w-md space-y-5">
          {description ? (
            <p className={cn('text-sm leading-relaxed lg:text-base', t.body)}>{description}</p>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  )
}
