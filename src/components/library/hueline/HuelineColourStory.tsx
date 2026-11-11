'use client'

import * as React from 'react'
import { HL_DYE_SWATCHES, hlByCode, hlFormatPrice } from './huelineData'
import { HuelineAssetImage } from './HuelineAssetImage'
import { HuelineRoot } from './HuelineStyles'

export type HuelineColourStoryProps = {
  className?: string
  assetBase?: string
}

export function HuelineColourStory({ className, assetBase }: HuelineColourStoryProps) {
  const [active, setActive] = React.useState(0)
  const swatch = HL_DYE_SWATCHES[active]

  return (
    <HuelineRoot
      className={className}
      style={
        {
          '--paper': swatch.fg === '#16141a' ? '#eceef2' : swatch.fg,
        } as React.CSSProperties
      }
    >
      <section
        className="hl-section hl-colour-story"
        id="colour"
        aria-label="Colour story"
        style={{ background: swatch.bg, color: swatch.fg }}
      >
        <div className="hl-colour-sticky">
          <p className="hl-colour-roll-inner">{swatch.name}</p>
          <p className="hl-colour-recipe">
            {swatch.ref} · {swatch.recipe}
          </p>
        </div>
        <div className="hl-section-head">
          <h2>
            One dye <em>pot.</em>
          </h2>
        </div>
        <div className="hl-swatches">
          {HL_DYE_SWATCHES.map((item, index) => {
            const prod = hlByCode(item.productCode)
            return (
              <button
                key={item.key}
                type="button"
                className={['hl-swatch', index === active ? 'is-active' : '']
                  .filter(Boolean)
                  .join(' ')}
                style={{ background: item.bg, color: item.fg }}
                onClick={() => setActive(index)}
                aria-pressed={index === active}
              >
                <p className="t-mono">
                  {item.name} · {item.ref}
                </p>
                <div className="hl-swatch-photo">
                  <HuelineAssetImage
                    asset={item.photo}
                    alt={`${item.name} dye swatch`}
                    fallbackTint={item.bg}
                    assetBase={assetBase}
                  />
                </div>
                <p className="t-price">
                  {prod.name} — {hlFormatPrice(prod.price)}
                </p>
                <div className="hl-swatch-notes">
                  {Object.entries(item.notes).map(([k, v]) => (
                    <p key={k}>
                      {k}: {v}
                    </p>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </HuelineRoot>
  )
}
