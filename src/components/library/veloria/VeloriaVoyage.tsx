import * as React from 'react'
import { IconArrowRight } from './VeloriaIcons'
import { VeloriaRoot } from './VeloriaStyles'

export type VeloriaVoyageProps = {
  destinationsHref?: string
  className?: string
}

export function VeloriaVoyage({
  destinationsHref = '#destinations',
  className,
}: VeloriaVoyageProps) {
  return (
    <VeloriaRoot scene className={className}>
      <section id="voyage" className="vl-screen" aria-label="The voyage">
        <div className="vl-voyage-h">
          <div className="vl-line" aria-hidden="true" />
          <h2 className="vl-serif vl-tshadow">
            Charter the coastline <em>nobody else</em> can reach.
          </h2>
        </div>
        <div className="vl-voyage-p">
          <p className="vl-tshadow">
            Your captain plans the route around weather, anchorages and your pace. Quiet coves at
            dawn, a harbour dinner at dusk, and open water in between.
          </p>
          <a href={destinationsHref}>
            See where we sail <IconArrowRight />
          </a>
        </div>
      </section>
    </VeloriaRoot>
  )
}
