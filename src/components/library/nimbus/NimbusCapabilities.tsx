import * as React from 'react'
import { NM_CAPABILITIES } from './nimbusData'
import { NM_ICON_MAP } from './NimbusIcons'
import { NimbusRoot } from './NimbusStyles'

export type NimbusCapabilitiesProps = {
  className?: string
}

export function NimbusCapabilities({ className }: NimbusCapabilitiesProps) {
  return (
    <NimbusRoot className={className}>
      <section id="capabilities" className="nm-section" aria-labelledby="nm-cap-title">
        <div className="nm-container">
          <p className="nm-eyebrow">Capabilities</p>
          <h2 id="nm-cap-title" className="nm-h2">
            Six primitives for document intelligence
          </h2>
          <p className="nm-lead">
            Compose summarise, extract, and ask endpoints — or run them alone against your corpus.
          </p>
          <div className="nm-cap-grid">
            {NM_CAPABILITIES.map((cap) => {
              const Icon = NM_ICON_MAP[cap.icon]
              return (
                <article key={cap.id} className="nm-cap-card">
                  <div className="nm-cap-icon">
                    <Icon />
                  </div>
                  <h3>{cap.title}</h3>
                  <p>{cap.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </NimbusRoot>
  )
}
