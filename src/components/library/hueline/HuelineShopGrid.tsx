'use client'

import * as React from 'react'
import { HL_ALL, HL_STYLES, type HlProduct } from './huelineData'
import { HuelineProductCard } from './HuelineProductCard'
import { HuelineRoot } from './HuelineStyles'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'az'

export type HuelineShopGridProps = {
  className?: string
  assetBase?: string
  initialLimit?: number
}

function sortProducts(list: HlProduct[], sort: SortKey): HlProduct[] {
  const copy = [...list]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price)
    case 'az':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return copy
  }
}

export function HuelineShopGrid({ className, assetBase, initialLimit = 12 }: HuelineShopGridProps) {
  const [filter, setFilter] = React.useState<string>('all')
  const [sort, setSort] = React.useState<SortKey>('featured')
  const [showAll, setShowAll] = React.useState(false)

  const filtered = React.useMemo(() => {
    const base = filter === 'all' ? HL_ALL : HL_ALL.filter((p) => p.styleCode === filter)
    return sortProducts(base, sort)
  }, [filter, sort])

  const visible = showAll ? filtered : filtered.slice(0, initialLimit)

  const tabs = [
    { code: 'all', label: 'All' },
    ...HL_STYLES.map((s) => ({ code: s.code, label: s.label })),
  ]

  return (
    <HuelineRoot className={className}>
      <section className="hl-section" id="shop-grid" aria-label="Shop">
        <div className="hl-section-head">
          <h2>
            Shop the <em>drop</em>
          </h2>
        </div>
        <div className="hl-shop-controls">
          <div className="hl-shop-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.code}
                type="button"
                role="tab"
                aria-selected={filter === tab.code}
                className={['hl-shop-tab', filter === tab.code ? 'is-active' : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  setFilter(tab.code)
                  setShowAll(false)
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="hl-shop-meta">
            <label className="t-mono">
              Sort
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price low–high</option>
                <option value="price-desc">Price high–low</option>
                <option value="az">A–Z</option>
              </select>
            </label>
            <span>
              Showing {visible.length} of {filtered.length} pieces
            </span>
            {filtered.length > initialLimit ? (
              <button type="button" className="hl-nav-btn" onClick={() => setShowAll((v) => !v)}>
                {showAll ? 'Show fewer' : `Show all ${filtered.length} pieces`}
              </button>
            ) : null}
          </div>
        </div>
        <div className="hl-shop-grid">
          {visible.map((product) => (
            <HuelineProductCard key={product.code} product={product} assetBase={assetBase} />
          ))}
        </div>
      </section>
    </HuelineRoot>
  )
}
