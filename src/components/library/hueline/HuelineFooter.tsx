'use client'

import * as React from 'react'
import { HuelineRoot } from './HuelineStyles'

const DEFAULT_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'New arrivals', href: '#shop-grid' },
      { label: 'Tailoring', href: '#shop-grid' },
      { label: 'Evening', href: '#shop-grid' },
      { label: 'Knitwear', href: '#shop-grid' },
    ],
  },
  {
    title: 'House',
    links: [
      { label: 'Lookbook', href: '#lookbook' },
      { label: 'Colour story', href: '#colour' },
      { label: 'Atelier', href: '#atelier' },
      { label: 'Care guide', href: '#' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Size guide', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
] as const

export type HuelineFooterProps = {
  className?: string
  onNewsletterSubmit?: (email: string) => void
}

export function HuelineFooter({ className, onNewsletterSubmit }: HuelineFooterProps) {
  const [email, setEmail] = React.useState('')

  return (
    <HuelineRoot className={className}>
      <footer className="hl-footer" role="contentinfo">
        <div className="hl-footer-top">
          <div>
            <a className="hl-wordmark hl-footer-mark" href="#" aria-label="Hueline">
              <span className="hue">HUE</span>
              <span className="line">line</span>
            </a>
            <p style={{ maxWidth: '28ch', fontSize: '0.9rem', color: 'var(--mute)' }}>
              Saturation SS27 — hand-dyed in Jaipur, cut in runs of forty-eight.
            </p>
            <form
              className="hl-newsletter"
              onSubmit={(e) => {
                e.preventDefault()
                onNewsletterSubmit?.(email)
                setEmail('')
              }}
            >
              <input
                type="email"
                placeholder="Email for drops"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Newsletter email"
                required
              />
              <button type="submit">Join</button>
            </form>
          </div>
          {DEFAULT_COLUMNS.map((col) => (
            <div key={col.title} className="hl-footer-col">
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="hl-footer-small">© Hueline · Saturation SS27 · Jaipur</p>
      </footer>
    </HuelineRoot>
  )
}
