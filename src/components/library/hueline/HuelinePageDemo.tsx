import * as React from 'react'
import { demoUrl } from '@/lib/demoOrigin'
import { HuelineRoot } from './HuelineStyles'

export type HuelinePageDemoProps = {
  src?: string
  title?: string
  className?: string
}

export function HuelinePageDemo({
  src,
  title = 'Hueline Saturation SS27',
  className,
}: HuelinePageDemoProps) {
  const demoSrc = src ?? demoUrl('/hueline/index.html')
  return (
    <HuelineRoot className={className}>
      <iframe className="hl-page-demo-frame" src={demoSrc} title={title} loading="lazy" />
    </HuelineRoot>
  )
}
