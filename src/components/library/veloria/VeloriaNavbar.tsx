'use client'

import * as React from 'react'
import { VL_NAV_LINKS } from './veloriaData'
import { VeloriaRoot } from './VeloriaStyles'

export type VeloriaNavbarProps = {
  fixed?: boolean
  logoHref?: string
  ctaHref?: string
  ctaLabel?: string
  className?: string
}

export function VeloriaNavbar({
  fixed = true,
  logoHref = '#hero',
  ctaHref = '#reserve',
  ctaLabel = 'Book a charter',
  className,
}: VeloriaNavbarProps) {
  return (
    <VeloriaRoot scene className={className}>
      <header className={['vl-header', fixed ? 'is-fixed' : ''].filter(Boolean).join(' ')}>
        <a href={logoHref} className="vl-logo vl-serif vl-glass">
          VELORIA
        </a>
        <nav aria-label="Primary">
          {VL_NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a href={ctaHref} className="vl-cta vl-btn">
          {ctaLabel}
        </a>
      </header>
    </VeloriaRoot>
  )
}
