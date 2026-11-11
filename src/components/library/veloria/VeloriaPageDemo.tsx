import * as React from 'react'
import { demoUrl } from '@/lib/demoOrigin'
import { VeloriaRoot } from './VeloriaStyles'

export type VeloriaPageDemoProps = {
  src?: string
  title?: string
  className?: string
}

export function VeloriaPageDemo({
  src,
  title = 'Veloria — Private Yacht Charters',
  className,
}: VeloriaPageDemoProps) {
  const demoSrc = src ?? demoUrl('/veloria/index.html')
  return (
    <VeloriaRoot className={className}>
      <iframe className="vl-page-demo-frame" src={demoSrc} title={title} loading="lazy" />
    </VeloriaRoot>
  )
}
