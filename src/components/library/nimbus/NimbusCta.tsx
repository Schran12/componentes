import * as React from 'react'
import { NimbusRoot } from './NimbusStyles'

export type NimbusCtaProps = {
  className?: string
  href?: string
  label?: string
}

export function NimbusCta({ className, href = '#pricing', label = 'Get API key' }: NimbusCtaProps) {
  return (
    <NimbusRoot className={className}>
      <section className="nm-section" aria-labelledby="nm-cta-title">
        <div className="nm-container">
          <div className="nm-cta-band">
            <h2 id="nm-cta-title">Start building in 5 minutes</h2>
            <p>
              Create a key, upload a sample PDF, and ship your first cited answer before standup
              ends.
            </p>
            <a href={href} className="nm-btn nm-btn-primary">
              {label}
            </a>
          </div>
        </div>
      </section>
    </NimbusRoot>
  )
}
