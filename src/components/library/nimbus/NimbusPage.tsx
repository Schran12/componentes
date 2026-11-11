import * as React from 'react'
import { NimbusCapabilities } from './NimbusCapabilities'
import { NimbusCta } from './NimbusCta'
import { NimbusDemo } from './NimbusDemo'
import { NimbusDeveloper } from './NimbusDeveloper'
import { NimbusFooter } from './NimbusFooter'
import { NimbusHero } from './NimbusHero'
import { NimbusNavbar } from './NimbusNavbar'
import { NimbusPricing } from './NimbusPricing'
import { NimbusRoot } from './NimbusStyles'
import { NimbusUseCases } from './NimbusUseCases'

export type NimbusPageProps = {
  className?: string
}

/** Full landing composition for catalog / Storybook-style previews. */
export function NimbusPage({ className }: NimbusPageProps) {
  return (
    <NimbusRoot className={['nm-page', className].filter(Boolean).join(' ')}>
      <NimbusNavbar />
      <main>
        <NimbusHero />
        <NimbusDemo />
        <NimbusCapabilities />
        <NimbusDeveloper />
        <NimbusUseCases />
        <NimbusPricing />
        <NimbusCta />
      </main>
      <NimbusFooter />
    </NimbusRoot>
  )
}
