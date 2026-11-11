import type { MouseEventHandler, ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import type { AccentTone } from './accentTones'

export type AccentButtonProps = {
  children: ReactNode
  href?: string
  tone?: AccentTone
  size?: 'md' | 'lg'
  icon?: ReactNode
  external?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  className?: string
}

const slideBase =
  'group relative inline-flex w-fit cursor-pointer items-center overflow-hidden rounded-sm font-semibold tracking-wide transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60'

const slideSizes = {
  md: {
    root: 'h-12 p-1.5 ps-5 pe-14 text-sm hover:ps-14 hover:pe-5',
    icon: 'right-1.5 h-9 w-9 group-hover:right-[calc(100%-42px)]',
  },
  lg: {
    root: 'h-14 p-1 ps-6 pe-20 text-base hover:ps-20 hover:pe-6 md:text-lg',
    icon: 'right-1.5 h-11 w-11 group-hover:right-[calc(100%-50px)]',
  },
}

const toneClasses: Record<AccentTone, { root: string; icon: string }> = {
  glow: {
    root: 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#7c39cf] bg-transparent px-4 py-2 font-semibold text-[#ae89ff] transition-[color,border-color,box-shadow,background-color] duration-300 hover:border-[#c642a5] hover:bg-gradient-to-r hover:from-[#86196b] hover:to-[#5327b3] hover:text-white hover:shadow-[0_0_8px_#c642a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c642a5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] disabled:pointer-events-none disabled:opacity-60',
    icon: '',
  },
  industrial: {
    root: 'bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950',
    icon: 'bg-white text-slate-900 group-hover:bg-slate-950 group-hover:text-white',
  },
  'industrial-dark': {
    root: 'bg-amber-500 text-slate-950 hover:bg-white',
    icon: 'bg-white text-slate-950 group-hover:bg-slate-950 group-hover:text-white',
  },
}

/** Botão de ação dos templates: contorno com gradiente (glow) ou ícone deslizante (industrial). */
export function AccentButton({
  children,
  href,
  tone = 'glow',
  size = 'md',
  icon,
  external,
  type = 'button',
  disabled,
  onClick,
  className,
}: AccentButtonProps) {
  const styles = toneClasses[tone]
  const isGlow = tone === 'glow'
  const resolvedIcon = icon ?? <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
  const classes = isGlow
    ? cn(styles.root, size === 'lg' && 'px-6 py-3 text-lg', className)
    : cn(slideBase, slideSizes[size].root, styles.root, className)

  const content = isGlow ? (
    <>
      {icon}
      {children}
    </>
  ) : (
    <>
      <span className="relative z-10 transition-colors duration-500">{children}</span>
      <span
        className={cn(
          'absolute flex items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-12',
          slideSizes[size].icon,
          styles.icon,
        )}
        aria-hidden
      >
        {resolvedIcon}
      </span>
    </>
  )

  if (href) {
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
    if (isExternal) {
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
