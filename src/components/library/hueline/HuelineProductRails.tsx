'use client'

import * as React from 'react'
import { HL_ALL, HL_STYLES } from './huelineData'
import { HuelineProductCard } from './HuelineProductCard'
import { HuelineRoot } from './HuelineStyles'

export type HuelineProductRailsProps = {
  className?: string
  assetBase?: string
}

export function HuelineProductRails({ className, assetBase }: HuelineProductRailsProps) {
  const byStyle = React.useMemo(() => {
    const map = new Map<string, typeof HL_ALL>()
    HL_STYLES.forEach((s) => {
      map.set(
        s.code,
        HL_ALL.filter((p) => p.styleCode === s.code),
      )
    })
    return map
  }, [])

  return (
    <HuelineRoot className={className}>
      <section className="hl-section" id="rails" aria-label="Product rails">
        <div className="hl-section-head">
          <h2>
            Style <em>rails</em>
          </h2>
          <p>Horizontal rails per silhouette — scroll to browse each drop.</p>
        </div>
        <div className="hl-rails">
          {HL_STYLES.map((style) => (
            <div key={style.code}>
              <div className="hl-rail-head">
                <span className="t-mono">{style.label}</span>
                <span className="t-mono">{style.items.length} pieces</span>
              </div>
              <div className="hl-rail-track-wrap">
                <div className="hl-rail-track">
                  {(byStyle.get(style.code) ?? []).map((product) => (
                    <HuelineProductCard
                      key={product.code}
                      product={product}
                      assetBase={assetBase}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </HuelineRoot>
  )
}
