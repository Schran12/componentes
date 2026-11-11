'use client'

import * as React from 'react'
import { HL_LOOKS } from './huelineData'
import { HuelineAssetImage } from './HuelineAssetImage'
import { HuelineRoot } from './HuelineStyles'

export type HuelineLookbookProps = {
  className?: string
  assetBase?: string
}

export function HuelineLookbook({ className, assetBase }: HuelineLookbookProps) {
  return (
    <HuelineRoot className={className}>
      <section className="hl-lookbook-wrap" id="lookbook" aria-label="Lookbook">
        <div className="hl-lookbook-scroll">
          {HL_LOOKS.map((look) => (
            <article key={look.num} className="hl-look-panel">
              <div>
                <p className="hl-look-num">{look.num}</p>
                <h2 className="t-cond">{look.title}</h2>
                <p>{look.copy}</p>
              </div>
              <div className="hl-look-frame">
                <HuelineAssetImage
                  asset={look.asset}
                  alt={`Look ${look.num}`}
                  fallbackTint="#6a6773"
                  assetBase={assetBase}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </HuelineRoot>
  )
}
