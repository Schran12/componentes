import * as React from 'react'
import { VL_DESTINATIONS } from './veloriaData'
import { VeloriaRoot } from './VeloriaStyles'

export type VeloriaDestinationsProps = {
  className?: string
}

export function VeloriaDestinations({ className }: VeloriaDestinationsProps) {
  return (
    <VeloriaRoot scene className={className}>
      <section id="destinations" className="vl-screen" aria-label="Destinations">
        <div className="vl-dest-h">
          <div className="vl-eyebrow">Where we sail</div>
          <h2 className="vl-serif vl-tshadow">
            Four coastlines, one <em>season</em> each.
          </h2>
        </div>
        <div className="vl-tiles">
          {VL_DESTINATIONS.map((dest) => (
            <a
              key={dest.num}
              href="#reserve"
              className={['vl-tile', 'vl-glass', dest.animClass].join(' ')}
            >
              <div className="vl-top">
                <span>{dest.num}</span>
                <span>{dest.season}</span>
              </div>
              <div className="vl-n vl-serif">{dest.name}</div>
              <div className="vl-d">{dest.description}</div>
            </a>
          ))}
        </div>
      </section>
    </VeloriaRoot>
  )
}
