'use client'

import * as React from 'react'
import { NM_NAV_LINKS } from './nimbusData'
import { NimbusRoot } from './NimbusStyles'

export type NimbusNavbarProps = {
  logoHref?: string
  ctaHref?: string
  ctaLabel?: string
  className?: string
}

export function NimbusNavbar({
  logoHref = '#hero',
  ctaHref = '#pricing',
  ctaLabel = 'Get API key',
  className,
}: NimbusNavbarProps) {
  const headerRef = React.useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <NimbusRoot className={className}>
      <header
        ref={headerRef}
        className={['nm-header', scrolled ? 'is-scrolled' : ''].filter(Boolean).join(' ')}
      >
        <div className="nm-header-inner">
          <a href={logoHref} className="nm-logo">
            Nimbus<span>.</span>
          </a>
          <nav className="nm-nav" aria-label="Primary">
            {NM_NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href={ctaHref} className="nm-btn nm-btn-primary nm-nav-cta">
              {ctaLabel}
            </a>
          </nav>
          <button
            type="button"
            className="nm-menu-btn"
            aria-expanded={open}
            aria-controls="nm-mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
        <div
          id="nm-mobile-nav"
          className={['nm-mobile-nav', open ? 'is-open' : ''].filter(Boolean).join(' ')}
        >
          {NM_NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href={ctaHref} className="nm-btn nm-btn-primary" onClick={() => setOpen(false)}>
            {ctaLabel}
          </a>
        </div>
      </header>
    </NimbusRoot>
  )
}
