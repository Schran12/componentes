import Link from 'next/link'
import type { ReactNode } from 'react'
import { CurrentYear } from '@/components/library/primitives/CurrentYear'
import { cn } from '@/lib/utils'

import { BloominCredit } from './BloominCredit'

export type FooterContactColumnsProps = {
  logo: ReactNode
  columns: ReadonlyArray<{ title: string; links: ReadonlyArray<{ label: string; href: string }> }>
  description?: string
  logoHref?: string
  contact?: {
    title?: string
    items: ReadonlyArray<{ icon: ReactNode; label: string; href?: string }>
  }
  /** Nome usado no copyright padrão. */
  brandName?: string
  copyright?: ReactNode
  /** Crédito customizado. Se omitido, usa o logo da Bloomin. */
  credit?: { label?: string; content: ReactNode; href?: string }
  /** Exibe “Desenvolvido por” com o logo da Bloomin quando `credit` não é passado. Padrão: true. */
  showDevelopedBy?: boolean
  className?: string
}

const focus =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-foreground'

function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-sm font-bold uppercase tracking-[0.12em]">
      {children}
      <span className="mt-2.5 block h-0.5 w-6 bg-current opacity-50" aria-hidden="true" />
    </h2>
  )
}

/** Rodapé escuro com marca, colunas de links, contatos com ícones e barra de copyright. */
export function FooterContactColumns({
  logo,
  columns,
  description,
  logoHref = '/',
  contact,
  brandName,
  copyright,
  credit,
  showDevelopedBy = true,
  className,
}: FooterContactColumnsProps) {
  return (
    <footer className={cn('bg-foreground text-background', className)}>
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:flex lg:gap-0">
        <div className="lg:max-w-xs lg:flex-[1.3] lg:pr-10">
          <Link href={logoHref} className={cn('inline-flex', focus)}>
            {logo}
          </Link>
          {description ? <p className="mt-6 text-sm leading-7 opacity-75">{description}</p> : null}
        </div>

        {columns.map((column) => (
          <nav
            key={column.title}
            aria-label={column.title}
            className="lg:flex-1 lg:border-l lg:border-background/15 lg:px-8"
          >
            <ColumnTitle>{column.title}</ColumnTitle>
            <ul className="mt-6 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={cn('text-sm opacity-75 transition hover:opacity-100', focus)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {contact ? (
          <div className="lg:flex-[1.2] lg:border-l lg:border-background/15 lg:pl-8">
            <ColumnTitle>{contact.title ?? 'Contato'}</ColumnTitle>
            <ul className="mt-6 space-y-3.5">
              {contact.items.map((item) => {
                const body = (
                  <>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10 [&_svg]:h-3.5 [&_svg]:w-3.5"
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="whitespace-pre-line pt-1.5 text-sm leading-5">
                      {item.label}
                    </span>
                  </>
                )
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={cn(
                          'flex items-start gap-3 opacity-85 transition hover:opacity-100',
                          focus,
                        )}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="flex items-start gap-3 opacity-85">{body}</div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="bg-primary text-primary-foreground">
        <div className="container flex flex-col items-center justify-between gap-3 py-4 text-sm sm:flex-row">
          <p className="opacity-85">
            {copyright ?? (
              <>
                © <CurrentYear />
                {brandName ? ` ${brandName}` : ''}. Todos os direitos reservados.
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
            {credit ? (
              <p className="flex items-center gap-2.5">
                <span className="opacity-75">{credit.label ?? 'Desenvolvido por'}</span>
                {credit.href ? (
                  <a
                    href={credit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
                  >
                    {credit.content}
                  </a>
                ) : (
                  credit.content
                )}
              </p>
            ) : null}
            {showDevelopedBy ? <BloominCredit className="text-primary-foreground" /> : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
