'use client'

import * as React from 'react'
import { hlSrc, HL_DEFAULT_ASSET_BASE } from './huelineData'

export type HuelineAssetImageProps = {
  asset: string
  alt: string
  className?: string
  fallbackTint?: string
  fallbackLabel?: string
  assetBase?: string
  style?: React.CSSProperties
}

export function HuelineAssetImage({
  asset,
  alt,
  className,
  fallbackTint = '#2b3fd6',
  fallbackLabel,
  assetBase = HL_DEFAULT_ASSET_BASE,
  style,
}: HuelineAssetImageProps) {
  const [failed, setFailed] = React.useState(false)
  const src = hlSrc(asset, 'jpg', assetBase)

  if (failed) {
    return (
      <div
        className={['hl-media-fallback', className].filter(Boolean).join(' ')}
        style={{ '--fb': fallbackTint, ...style } as React.CSSProperties}
      >
        {fallbackLabel ?? asset}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
