import * as React from 'react'

import { CurrentYear } from '@/components/library/primitives/CurrentYear'
import { cn } from '@/lib/utils'

import { BloominCredit } from './BloominCredit'
import type { FooterColumn, NavigationBrand, NavigationLink, SocialLink } from './types'

export interface FooterColumnsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  brand: NavigationBrand
  description?: React.ReactNode
  columns: readonly FooterColumn[]
  socialLinks?: readonly SocialLink[]
  legalLinks?: readonly NavigationLink[]
  copyright?: React.ReactNode
  navigationLabel?: string
  hideBrandLabel?: boolean
  /** Exibe “Desenvolvido por” com o logo da Bloomin. Padrão: true. */
  showDevelopedBy?: boolean
}

export function FooterColumns({
  brand,
  description,
  columns,
  socialLinks = [],
  legalLinks = [],
  copyright,
  navigationLabel = 'Navegação do rodapé',
  hideBrandLabel = false,
  showDevelopedBy = true,
  className,
  ...props
}: FooterColumnsProps) {
  const columnGrid =
    columns.length >= 4
      ? 'lg:grid-cols-4'
      : columns.length === 3
        ? 'lg:grid-cols-3'
        : columns.length === 2
          ? 'lg:grid-cols-2'
          : 'lg:grid-cols-1'

  return (
    <footer className={cn('border-t bg-muted/30', className)} {...props}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:px-8 lg:py-16">
        <div>
          <a
            href={brand.href ?? '/'}
            className="inline-flex items-center gap-3 rounded-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {brand.logo}
            <span className={cn(hideBrandLabel && brand.logo && 'sr-only')}>{brand.label}</span>
          </a>
          {description ? (
            <div className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              {description}
            </div>
          ) : null}
          {socialLinks.length ? (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Redes sociais">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav className={cn('grid gap-8 sm:grid-cols-2', columnGrid)} aria-label={navigationLabel}>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      aria-current={link.current ? 'page' : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            {copyright ?? (
              <>
                © <CurrentYear /> {brand.label}
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.length ? (
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {showDevelopedBy ? <BloominCredit /> : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
