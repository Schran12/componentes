'use client'

import * as React from 'react'
import { PRICE, VL_FEATURED_CHARTER } from './veloriaData'
import { IconArrowDown } from './VeloriaIcons'
import { VeloriaRoot } from './VeloriaStyles'

export type VeloriaHeroProps = {
  videoPoster?: string
  showVideo?: boolean
  className?: string
}

export function VeloriaHero({ videoPoster, showVideo = true, className }: VeloriaHeroProps) {
  const charter = VL_FEATURED_CHARTER

  return (
    <VeloriaRoot video={showVideo} videoPoster={videoPoster} className={className}>
      <section id="hero" className="vl-screen vl-screen--hero" aria-label="Hero">
        <div className="vl-hero-copy">
          <div className="vl-eyebrow">
            <i aria-hidden="true" />
            Private crewed charters
          </div>
          <h1 className="vl-serif vl-tshadow">
            The open sea, <em>reserved</em> for you.
          </h1>
          <p className="vl-tshadow">
            Crewed superyachts across the Mediterranean and the Indian Ocean. Choose the yacht, set
            the course, and every nautical mile is handled.
          </p>
          <div className="vl-hero-ctas">
            <a href="#reserve" className="vl-pill-btn vl-solid vl-btn">
              Reserve a charter
            </a>
            <a href="#onboard" className="vl-pill-btn vl-ghost vl-glass vl-btn">
              Step aboard{' '}
              <b>
                <IconArrowDown />
              </b>
            </a>
          </div>
        </div>

        <article className="vl-feature vl-glass">
          <div className="vl-row">
            <div>
              <div className="vl-k">Featured charter</div>
              <div className="vl-serif" style={{ marginTop: 6, fontSize: 30, fontWeight: 500 }}>
                {charter.name}
              </div>
            </div>
            <div className="vl-serif" style={{ fontSize: 64, lineHeight: 0.9 }}>
              {charter.lengthM}
              <span style={{ fontSize: 26 }}>m</span>
            </div>
          </div>
          <div className="vl-bar">
            <i aria-hidden="true" />
          </div>
          <div
            className="vl-k"
            style={{ marginTop: 10, letterSpacing: '0.16em', color: 'rgba(244,239,230,.6)' }}
          >
            {charter.note}
          </div>
          <div className="vl-stats">
            <div>
              <b>{charter.guests}</b>
              <small>Guests</small>
            </div>
            <div>
              <b>{charter.cabins}</b>
              <small>Cabins</small>
            </div>
            <div>
              <b>{charter.crew}</b>
              <small>Crew</small>
            </div>
            <div>
              <b>{PRICE}</b>
              <small>Per day</small>
            </div>
          </div>
        </article>

        <div className="vl-scroll-cue">
          <i aria-hidden="true" />
          Scroll to set sail
        </div>
      </section>
    </VeloriaRoot>
  )
}
