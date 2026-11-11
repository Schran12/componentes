import * as React from 'react'

import { CurrentYear } from '@/components/library/primitives/CurrentYear'
import { cn } from '@/lib/utils'

import { BloominCredit } from './BloominCredit'
import type { NavigationBrand, NavigationLink, SocialLink } from './types'

export interface FooterCompactProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  brand: NavigationBrand
  links?: readonly NavigationLink[]
  socialLinks?: readonly SocialLink[]
  copyright?: React.ReactNode
  navigationLabel?: string
  /** Exibe “Desenvolvido por” com o logo da Bloomin. Padrão: true. */
  showDevelopedBy?: boolean
}

export function FooterCompact({
  brand,
  links = [],
  socialLinks = [],
  copyright,
  navigationLabel = 'Navegação do rodapé',
  showDevelopedBy = true,
  className,
  ...props
}: FooterCompactProps) {
  return (
    <footer className={cn('border-t bg-background', className)} {...props}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <a
          href={brand.href ?? '/'}
          className="inline-flex items-center gap-3 rounded-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brand.logo}
          <span>{brand.label}</span>
        </a>

        {links.length ? (
          <nav className="lg:ml-auto" aria-label={navigationLabel}>
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {links.map((link) => (
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
          </nav>
        ) : null}

        {socialLinks.length ? (
          <ul className="flex items-center gap-2" aria-label="Redes sociais">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div className="text-center sm:text-left">
            {copyright ?? (
              <>
                © <CurrentYear /> {brand.label}
              </>
            )}
          </div>
          {showDevelopedBy ? <BloominCredit className="text-xs" /> : null}
        </div>
      </div>
    </footer>
  )
}
