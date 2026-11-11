import * as React from 'react'
import { NM_PRICING_NOTE, NM_PRICING_TIERS } from './nimbusData'
import { NimbusRoot } from './NimbusStyles'

export type NimbusPricingProps = {
  className?: string
}

export function NimbusPricing({ className }: NimbusPricingProps) {
  return (
    <NimbusRoot className={className}>
      <section id="pricing" className="nm-section" aria-labelledby="nm-price-title">
        <div className="nm-container">
          <p className="nm-eyebrow">Pricing</p>
          <h2 id="nm-price-title" className="nm-h2">
            Usage-based plans that scale with you
          </h2>
          <p className="nm-price-note">{NM_PRICING_NOTE}</p>
          <div className="nm-price-grid">
            {NM_PRICING_TIERS.map((tier) => (
              <article
                key={tier.id}
                className={['nm-price-card', tier.highlighted ? 'is-hot' : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <h3>{tier.name}</h3>
                <div className="nm-price-amount">
                  {tier.price}
                  {tier.period ? <small>{tier.period}</small> : null}
                </div>
                <p className="nm-price-blurb">{tier.blurb}</p>
                <ul className="nm-price-list">
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a href="#pricing" className="nm-btn nm-btn-primary">
                  {tier.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </NimbusRoot>
  )
}
