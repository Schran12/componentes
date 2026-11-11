'use client'

import * as React from 'react'
import { HuelineRoot } from './HuelineStyles'

const NAV_LINKS = [
  { label: 'Wardrobe', href: '#wardrobe' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Colour', href: '#colour' },
  { label: 'Shop', href: '#shop-grid' },
] as const

export type HuelineNavbarProps = {
  /** When true, navbar uses paper background (e.g. after scroll). */
  scrolled?: boolean
  /** Transparent over dark hero when false and not scrolled. */
  overDark?: boolean
  fixed?: boolean
  savedCount?: number
  bagCount?: number
  className?: string
  onSearch?: () => void
  onSaved?: () => void
  onBag?: () => void
}

export function HuelineNavbar({
  scrolled: scrolledProp,
  overDark = true,
  fixed = true,
  savedCount = 0,
  bagCount = 0,
  className,
  onSearch,
  onSaved,
  onBag,
}: HuelineNavbarProps) {
  const [scrolledInternal, setScrolledInternal] = React.useState(false)
  const scrolled = scrolledProp ?? scrolledInternal

  React.useEffect(() => {
    if (scrolledProp !== undefined) return
    const onScroll = () => setScrolledInternal(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrolledProp])

  const navClass = [
    'hl-nav',
    fixed ? 'is-fixed' : '',
    scrolled ? 'is-solid' : '',
    overDark && !scrolled ? 'is-over-dark' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <HuelineRoot>
      <header className={navClass} role="banner">
        <a className="hl-wordmark" href="#" aria-label="Hueline home">
          <span className="hue">HUE</span>
          <span className="line">line</span>
        </a>
        <nav className="hl-nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hl-nav-actions">
          <button type="button" className="hl-nav-btn" onClick={onSearch}>
            Search
          </button>
          <button type="button" className="hl-nav-btn" onClick={onSaved}>
            Saved
            {savedCount > 0 ? <span className="hl-badge">{savedCount}</span> : null}
          </button>
          <button type="button" className="hl-nav-btn" onClick={onBag}>
            Bag
            {bagCount > 0 ? <span className="hl-badge">{bagCount}</span> : null}
          </button>
        </div>
      </header>
    </HuelineRoot>
  )
}
