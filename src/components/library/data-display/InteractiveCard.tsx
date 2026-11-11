import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type InteractiveCardVariant = 'bordered' | 'elevated' | 'glass' | 'editorial' | 'spotlight'

export type InteractiveCardProps = {
  title: string
  description?: string
  eyebrow?: string
  image?: { src: string; alt: string }
  icon?: ReactNode
  href?: string
  actionLabel?: string
  variant?: InteractiveCardVariant
  className?: string
}

const variants: Record<InteractiveCardVariant, string> = {
  bordered: 'border bg-card hover:border-primary/50',
  elevated: 'border bg-card shadow-md hover:-translate-y-2 hover:shadow-2xl',
  glass:
    'border border-white/20 bg-white/10 text-white shadow-xl backdrop-blur-xl hover:bg-white/15',
  editorial:
    'border-0 bg-slate-950 text-white shadow-xl hover:[&_img]:scale-110 [&_.card-copy]:bg-gradient-to-t [&_.card-copy]:from-black/90 [&_.card-copy]:via-black/30',
  spotlight:
    'border bg-card before:absolute before:-right-16 before:-top-16 before:h-40 before:w-40 before:rounded-full before:bg-primary/15 before:blur-3xl hover:before:bg-primary/30',
}

export function InteractiveCard({
  title,
  description,
  eyebrow,
  image,
  icon,
  href,
  actionLabel = 'Saiba mais',
  variant = 'bordered',
  className,
}: InteractiveCardProps) {
  const content = (
    <>
      {image ? (
        <div
          className={cn(
            'relative aspect-[4/3] overflow-hidden bg-muted',
            variant === 'editorial' && 'absolute inset-0 aspect-auto',
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-700"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>
      ) : null}

      <div
        className={cn(
          'card-copy relative flex flex-1 flex-col p-6',
          variant === 'editorial' && 'min-h-80 justify-end',
        )}
      >
        {icon ? (
          <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </span>
        ) : null}
        {eyebrow ? (
          <p
            className={cn(
              'text-xs font-bold uppercase tracking-[0.18em] text-primary',
              (variant === 'glass' || variant === 'editorial') && 'text-white/65',
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p
            className={cn(
              'mt-3 text-sm leading-6 text-muted-foreground',
              (variant === 'glass' || variant === 'editorial') && 'text-white/70',
            )}
          >
            {description}
          </p>
        ) : null}
        {href ? (
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            {actionLabel}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        ) : null}
      </div>
    </>
  )

  const classes = cn(
    'group relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl transition-all duration-500',
    variants[variant],
    href && 'focus-within:ring-2 focus-within:ring-ring',
    className,
  )

  return href ? (
    <article className={classes}>
      <Link
        href={href}
        className="flex h-full flex-col focus-visible:outline-none"
        aria-label={`${actionLabel}: ${title}`}
      >
        {content}
      </Link>
    </article>
  ) : (
    <article className={classes}>{content}</article>
  )
}
