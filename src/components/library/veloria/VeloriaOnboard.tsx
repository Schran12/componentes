import * as React from 'react'
import { VL_ONBOARD_CARDS } from './veloriaData'
import { IconArrowUpRight } from './VeloriaIcons'
import { VeloriaRoot } from './VeloriaStyles'

export type VeloriaOnboardProps = {
  className?: string
}

export function VeloriaOnboard({ className }: VeloriaOnboardProps) {
  return (
    <VeloriaRoot scene className={className}>
      <section id="onboard" className="vl-screen vl-onboard-grid" aria-label="Onboard">
        {VL_ONBOARD_CARDS.map((card) => (
          <a
            key={card.id}
            href="#reserve"
            className={['vl-fcard', card.positionClass, card.animClass].join(' ')}
          >
            <img src={card.image} alt={card.alt} loading="lazy" />
            <span className="vl-shade" aria-hidden="true" />
            <span className="vl-t vl-serif">{card.title}</span>
            <span className="vl-go vl-glass">
              <IconArrowUpRight />
            </span>
          </a>
        ))}
        <div className="vl-glide">
          <h2 className="vl-serif vl-tshadow">
            Made to <em>glide</em>
          </h2>
          <p className="vl-tshadow">
            A private chef, a full crew and every water toy aboard. The yacht runs quietly around
            the way you like your days.
          </p>
        </div>
      </section>
    </VeloriaRoot>
  )
}
