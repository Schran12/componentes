import type { MouseEventHandler, ReactNode } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export type PillButtonProps = {
  children: ReactNode
  href?: string
  variant?: 'solid' | 'outline' | 'glass'
  icon?: ReactNode
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  className?: string
}

const variants = {
  solid:
    'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.35)_inset] hover:-translate-y-0.5',
  outline:
    'border border-amber-500/30 bg-white text-slate-800 hover:border-amber-500/60 hover:bg-amber-500/10',
  glass:
    'border border-white/20 bg-white/10 text-white backdrop-blur hover:border-amber-500/50 hover:bg-amber-500 hover:text-slate-950',
}

/** Botão em pílula com variações sólida, contorno com brilho e vidro. */
export function PillButton({
  children,
  href,
  variant = 'solid',
  icon,
  type = 'button',
  disabled,
  onClick,
  className,
}: PillButtonProps) {
  const classes = cn(
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:scale-95',
    variants[variant],
    disabled && 'pointer-events-none opacity-60',
    className,
  )

  const content = (
    <>
      {variant === 'outline' ? (
        <>
          <span
            className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
            aria-hidden
          />
          <span
            className="absolute inset-x-0 -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
            aria-hidden
          />
        </>
      ) : null}
      {icon}
      <span className="relative">{children}</span>
    </>
  )

  if (href) {
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  )
}
