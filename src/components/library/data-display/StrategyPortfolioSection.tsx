'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type InvestmentStrategy = {
  id: string
  name: string
  region: string
  category?: string
  description: string
  href: string
  mark?: ReactNode
}

export type StrategyPortfolioSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  strategies: readonly InvestmentStrategy[]
  allLabel?: string
  className?: string
}

export function StrategyPortfolioSection({
  eyebrow,
  title,
  description,
  strategies,
  allLabel = 'Todas',
  className,
}: StrategyPortfolioSectionProps) {
  const categories = useMemo(
    () => Array.from(new Set(strategies.map((item) => item.category).filter(Boolean))) as string[],
    [strategies],
  )
  const [filter, setFilter] = useState('all')
  const visible =
    filter === 'all' ? strategies : strategies.filter((strategy) => strategy.category === filter)

  return (
    <section className={cn('bg-[#17211b] py-20 text-white md:py-28', className)}>
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
          <div>
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#a9cbb0]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-5 font-serif text-4xl tracking-[-0.035em] md:text-6xl">{title}</h2>
          </div>
          {description ? (
            <p className="text-white/58 max-w-2xl text-lg leading-8 lg:justify-self-end">
              {description}
            </p>
          ) : null}
        </div>

        {categories.length ? (
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-b border-white/15">
            {['all', ...categories].map((category) => {
              const selected = filter === category
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(category)}
                  className={cn(
                    'relative pb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/50 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9cbb0]',
                    selected && 'text-white',
                  )}
                >
                  {category === 'all' ? allLabel : category}
                  {selected ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#a9cbb0]" />
                  ) : null}
                </button>
              )
            })}
          </div>
        ) : null}

        <div className="mt-8 grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((strategy) => (
            <Link
              key={strategy.id}
              href={strategy.href}
              className="group flex min-h-[330px] flex-col bg-[#17211b] p-7 transition hover:bg-[#233229] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a9cbb0] md:p-9"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="flex h-14 min-w-14 items-center justify-center border border-white/20 px-3 font-serif text-xl text-[#d7e6da]">
                  {strategy.mark ?? strategy.name.slice(0, 2).toUpperCase()}
                </span>
                <ArrowUpRight
                  className="h-5 w-5 text-white/35 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                  aria-hidden
                />
              </div>
              <div className="mt-auto pt-12">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a9cbb0]">
                  {strategy.region}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{strategy.name}</h3>
                <p className="mt-4 text-sm leading-6 text-white/55">{strategy.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
