import type { ReactNode } from 'react'
import Link from 'next/link'

import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { CurrentYear } from '@/components/library/primitives/CurrentYear'
import { cn } from '@/lib/utils'

import { BloominCredit } from './BloominCredit'

export type FooterAccentColumn = {
  title: string
  links: readonly { label: string; href: string }[]
}

export type FooterAccentProps = {
  logo: ReactNode
  columns: readonly FooterAccentColumn[]
  description?: string
  logoHref?: string
  socialLinks?: readonly { label: string; href: string; icon: ReactNode }[]
  legalLinks?: readonly { label: string; href: string }[]
  copyright?: ReactNode
  /** Crédito extra além do “Desenvolvido por Bloomin”. */
  credit?: ReactNode
  /** Exibe “Desenvolvido por” com o logo da Bloomin. Padrão: true. */
  showDevelopedBy?: boolean
  tone?: AccentTone
  className?: string
}

/** Rodapé com marca, redes sociais, colunas de links com divisórias e barra legal. */
export function FooterAccent({
  logo,
  columns,
  description,
  logoHref = '/',
  socialLinks = [],
  legalLinks = [],
  copyright,
  credit,
  showDevelopedBy = true,
  tone = 'glow',
  className,
}: FooterAccentProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'
  const link = isGlow
    ? 'text-[#ffb0eb] transition-colors hover:text-[#ae89ff]'
    : tone === 'industrial'
      ? 'text-slate-600 transition-colors hover:text-amber-600'
      : 'text-slate-400 transition-colors hover:text-amber-500'

  return (
    <footer
      className={cn(
        isGlow ? 'bg-[#0e0e0e] text-[#c1c1c1] shadow-[0_-2px_0.5rem_#000]' : t.alt,
        !isGlow && cn('border-t', t.border),
        className,
      )}
    >
      <div className="container">
        <div className="flex flex-wrap gap-8 py-10">
          <div className="min-w-[240px] flex-1">
            <Link href={logoHref} className={cn('inline-block', t.focus)}>
              {logo}
            </Link>
            {description ? (
              <p className={cn('mt-4 max-w-md text-sm leading-relaxed', t.body)}>{description}</p>
            ) : null}
            {socialLinks.length ? (
              <div className="mt-5 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn('grid h-9 w-9 place-items-center', t.iconButton, t.focus)}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {columns.map((column) => (
            <nav key={column.title} className="min-w-[200px] flex-1" aria-label={column.title}>
              <h2
                className={cn(
                  'mb-3 text-lg font-semibold',
                  t.strong,
                  !isGlow && 'text-base uppercase tracking-wide',
                )}
              >
                {column.title}
                <span className={cn('mt-2 block h-0.5 w-10', t.line)} aria-hidden />
              </h2>
              <ul>
                {column.links.map((item) => (
                  <li key={item.label} className={cn('border-b py-2.5', t.border)}>
                    <Link href={item.href} className={cn(link, t.focus)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-4 border-t py-6 text-sm',
            t.border,
            t.body,
          )}
        >
          <p>
            {copyright ?? (
              <>
                Copyright © <CurrentYear />. Todos os direitos reservados.
              </>
            )}
          </p>
          {legalLinks.length || credit || showDevelopedBy ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalLinks.map((item) => (
                <Link key={item.label} href={item.href} className={cn(link, t.focus)}>
                  {item.label}
                </Link>
              ))}
              {credit}
              {showDevelopedBy ? <BloominCredit /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
