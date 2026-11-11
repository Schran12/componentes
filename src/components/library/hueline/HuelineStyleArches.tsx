import * as React from 'react'
import { HL_STYLES, HL_STYLE_ARCH_ASSETS } from './huelineData'
import { HuelineAssetImage } from './HuelineAssetImage'
import { HuelineRoot } from './HuelineStyles'

export type HuelineStyleArchesProps = {
  className?: string
  assetBase?: string
}

export function HuelineStyleArches({ className, assetBase }: HuelineStyleArchesProps) {
  return (
    <HuelineRoot className={className}>
      <section className="hl-section" id="styles" aria-label="Style arches">
        <div className="hl-section-head">
          <h2>
            Every style, <em>one saturation</em>
          </h2>
          <p>Six arches, six moods — tailoring through denim, each dyed in the same Jaipur vats.</p>
        </div>
        <div className="hl-arches">
          {HL_STYLES.map((style, i) => {
            const asset = HL_STYLE_ARCH_ASSETS[i]
            return (
              <article key={style.code} className="hl-arch">
                <HuelineAssetImage
                  asset={asset}
                  alt={`${style.label} arch`}
                  fallbackTint={style.tint}
                  assetBase={assetBase}
                />
                <div className="hl-arch-cap">
                  <p className="t-cond">{style.label}</p>
                  <p className="t-mono">{style.items.length} pieces</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </HuelineRoot>
  )
}
