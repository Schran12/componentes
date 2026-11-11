import * as React from 'react'
import { NM_USE_CASES } from './nimbusData'
import { NimbusRoot } from './NimbusStyles'

export type NimbusUseCasesProps = {
  className?: string
}

export function NimbusUseCases({ className }: NimbusUseCasesProps) {
  return (
    <NimbusRoot className={className}>
      <section id="use-cases" className="nm-section" aria-labelledby="nm-use-title">
        <div className="nm-container">
          <p className="nm-eyebrow">Use cases</p>
          <h2 id="nm-use-title" className="nm-h2">
            Built for teams that must show their work
          </h2>
          <p className="nm-lead">
            Support, research, and legal all need answers they can audit — not black-box chat.
          </p>
          <div className="nm-use-grid">
            {NM_USE_CASES.map((item) => (
              <article key={item.id} className="nm-use-card">
                <p className="nm-eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </NimbusRoot>
  )
}
