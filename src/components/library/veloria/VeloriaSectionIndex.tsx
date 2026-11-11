'use client'

import * as React from 'react'
import { VL_SECTION_INDEX } from './veloriaData'

export type VeloriaSectionIndexProps = {
  activeIndex?: number
  className?: string
}

export function VeloriaSectionIndex({ activeIndex = 0, className }: VeloriaSectionIndexProps) {
  return (
    <nav className={['vl-index', className].filter(Boolean).join(' ')} aria-label="Sections">
      {VL_SECTION_INDEX.map((item, i) => (
        <a key={item.href} href={item.href} className={i === activeIndex ? 'vl-on' : undefined}>
          <span className="vl-lbl">{item.label}</span>
          <span>{item.num}</span>
        </a>
      ))}
    </nav>
  )
}
