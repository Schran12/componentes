import * as React from 'react'
import { NM_FOOTER_COPY, NM_FOOTER_LINKS } from './nimbusData'
import { NimbusRoot } from './NimbusStyles'

export type NimbusFooterProps = {
  className?: string
}

export function NimbusFooter({ className }: NimbusFooterProps) {
  return (
    <NimbusRoot className={className}>
      <footer className="nm-footer">
        <div className="nm-footer-inner">
          <div className="nm-footer-brand">
            Nimbus<span className="nm-gradient-text">.</span>
          </div>
          <nav className="nm-footer-links" aria-label="Footer">
            {NM_FOOTER_LINKS.map((link) => (
              <a key={link.href + link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <p className="nm-footer-copy">{NM_FOOTER_COPY}</p>
        </div>
      </footer>
    </NimbusRoot>
  )
}
