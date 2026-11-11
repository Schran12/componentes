import * as React from 'react'
import { demoUrl } from '@/lib/demoOrigin'
import { NimbusRoot } from './NimbusStyles'

export type NimbusPageDemoProps = {
  src?: string
  title?: string
  className?: string
}

export function NimbusPageDemo({
  src,
  title = 'Nimbus AI — Document Q&A API',
  className,
}: NimbusPageDemoProps) {
  const demoSrc = src ?? demoUrl('/nimbus/index.html')
  return (
    <NimbusRoot className={className}>
      <iframe className="nm-page-demo-frame" src={demoSrc} title={title} loading="lazy" />
    </NimbusRoot>
  )
}
