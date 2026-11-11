'use client'

import * as React from 'react'
import { NimbusRoot } from './NimbusStyles'

export type NimbusHeroProps = {
  className?: string
}

export function NimbusHero({ className }: NimbusHeroProps) {
  const sectionRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--nm-mx', `${x}%`)
      el.style.setProperty('--nm-my', `${y}%`)
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <NimbusRoot className={className}>
      <section ref={sectionRef} id="hero" className="nm-hero" aria-label="Hero">
        <div className="nm-aurora" aria-hidden="true">
          <div className="nm-aurora-blob nm-aurora-blob--a" />
          <div className="nm-aurora-blob nm-aurora-blob--b" />
          <div className="nm-aurora-blob nm-aurora-blob--c" />
        </div>
        <div className="nm-spotlight" aria-hidden="true" />
        <div className="nm-hero-inner">
          <span className="nm-pill">
            <i aria-hidden="true" />
            Now in public beta
          </span>
          <h1>
            Documents that answer — <span className="nm-gradient-text">with citations</span>
          </h1>
          <p className="nm-hero-support">
            Nimbus AI is an API that summarises PDFs and knowledge bases, then answers questions
            with source spans your team can verify.
          </p>
          <div className="nm-hero-ctas">
            <a href="#pricing" className="nm-btn nm-btn-primary">
              Get API key
            </a>
            <a href="#docs" className="nm-btn nm-btn-ghost">
              View docs
            </a>
          </div>
        </div>
      </section>
    </NimbusRoot>
  )
}
