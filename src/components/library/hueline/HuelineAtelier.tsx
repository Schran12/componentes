import * as React from 'react'
import { HL_ATELIER_STATS } from './huelineData'
import { HuelineAssetImage } from './HuelineAssetImage'
import { HuelineRoot } from './HuelineStyles'

export type HuelineAtelierProps = {
  className?: string
  assetBase?: string
}

export function HuelineAtelier({ className, assetBase }: HuelineAtelierProps) {
  return (
    <HuelineRoot className={className}>
      <section className="hl-section" id="atelier" aria-label="Atelier">
        <div className="hl-atelier-grid">
          <div className="hl-atelier-photo">
            <HuelineAssetImage
              asset="atelier"
              alt="Hueline atelier in Jaipur"
              fallbackTint="#16141a"
              fallbackLabel="Atelier"
              assetBase={assetBase}
            />
          </div>
          <div>
            <div className="hl-section-head">
              <h2>
                Slow colour,
                <br />
                <em>four generations</em>
              </h2>
              <p>
                Made by people who have done it for four generations — mulberry silk, hand block,
                small dye lots.
              </p>
            </div>
            <div className="hl-stats">
              {HL_ATELIER_STATS.map((stat) => (
                <div key={stat.value}>
                  <p className="hl-stat-num">{stat.value}</p>
                  <p className="hl-stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </HuelineRoot>
  )
}
