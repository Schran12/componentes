'use client'

import * as React from 'react'
import type { HlProduct } from './huelineData'
import { hlFormatPrice } from './huelineData'
import { HuelineAssetImage } from './HuelineAssetImage'

export type HuelineProductCardProps = {
  product: HlProduct
  assetBase?: string
  onSelect?: (product: HlProduct) => void
}

export function HuelineProductCard({ product, assetBase, onSelect }: HuelineProductCardProps) {
  const main = product.images[0]
  return (
    <article
      className="hl-card"
      data-product={product.code}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(product)}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onSelect(product)
        }
      }}
    >
      <div className="hl-card-media">
        <HuelineAssetImage
          asset={main}
          alt={product.name}
          fallbackTint={product.colourHex}
          assetBase={assetBase}
        />
      </div>
      <div className="hl-card-body">
        <p className="hl-card-name">{product.name}</p>
        <p className="hl-card-fabric">{product.fabric}</p>
        <div className="hl-card-meta">
          <span className="t-price">{hlFormatPrice(product.price)}</span>
          <span
            className="hl-dye-dot"
            style={{ '--dot': product.colourHex } as React.CSSProperties}
            aria-label={product.colour}
          />
        </div>
      </div>
    </article>
  )
}
