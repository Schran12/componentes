'use client'

import * as React from 'react'
import { hlSrc } from './huelineData'
import { HuelineRoot } from './HuelineStyles'

export type HuelineHeroProps = {
  eyebrow?: string
  shopHref?: string
  posterAsset?: string
  videoSrc?: string
  className?: string
}

export function HuelineHero({
  eyebrow = 'SS27 · Collection 04 · Saturation',
  shopHref = '#shop-grid',
  posterAsset = 'hero-poster',
  videoSrc,
  className,
}: HuelineHeroProps) {
  const poster = hlSrc(posterAsset, 'jpg')
  const video = videoSrc ?? hlSrc('hero-main', 'webm')

  return (
    <HuelineRoot className={className}>
      <section className="hl-hero" aria-label="Hero film">
        <div className="hl-hero-pin">
          <div className="hl-hero-media">
            <video autoPlay muted loop playsInline poster={poster}>
              <source src={video} type="video/webm" />
            </video>
            <div className="hl-hero-fallback" aria-hidden="true" />
          </div>
          <div className="hl-hero-content">
            <p className="hl-hero-eyebrow t-mono">{eyebrow}</p>
            <h1 className="hl-hero-title t-cond">
              <span>WEAR THE</span>
              <span className="colour">colour</span>
              <span>OUT LOUD</span>
            </h1>
            <div className="hl-hero-foot">
              <p className="hl-hero-copy">
                Six silhouettes. Twelve dyes. Mixed by hand in Bagru and cut in Jaipur, in runs of
                48 pieces per colourway.
              </p>
              <div className="hl-hero-actions">
                <a className="hl-pill" href={shopHref}>
                  Shop the drop →
                </a>
                <span className="hl-scroll-cue">Scroll</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HuelineRoot>
  )
}
