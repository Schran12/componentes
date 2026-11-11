import * as React from 'react'

const svgProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
}

export function IconSummarise() {
  return (
    <svg {...svgProps}>
      <path d="M4 6h16M4 12h10M4 18h14" />
    </svg>
  )
}

export function IconExtract() {
  return (
    <svg {...svgProps}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 12h5M8 15h6" />
    </svg>
  )
}

export function IconClassify() {
  return (
    <svg {...svgProps}>
      <path d="M4 7h6v6H4zM14 7h6v4h-6zM14 14h6v3h-6zM4 16h6v4H4z" />
    </svg>
  )
}

export function IconTranslate() {
  return (
    <svg {...svgProps}>
      <path d="M5 5h6M8 5c0 6-3 10-6 12M11 5c-.5 3-2 6-5 8" />
      <path d="M13 19l3-8 3 8M14.2 16h3.6" />
    </svg>
  )
}

export function IconSearch() {
  return (
    <svg {...svgProps}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

export function IconCite() {
  return (
    <svg {...svgProps}>
      <path d="M8 7H5v5h3a2.5 2.5 0 0 0 0-5zM19 7h-3v5h3a2.5 2.5 0 0 0 0-5z" />
      <path d="M8 12v2a4 4 0 0 1-4 4M19 12v2a4 4 0 0 1-4 4" />
    </svg>
  )
}

export const NM_ICON_MAP = {
  summarise: IconSummarise,
  extract: IconExtract,
  classify: IconClassify,
  translate: IconTranslate,
  search: IconSearch,
  cite: IconCite,
} as const
