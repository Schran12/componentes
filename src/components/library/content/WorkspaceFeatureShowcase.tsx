'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BarChart3, CalendarDays, MessageCircle, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

export type WorkspaceFeature = {
  id: string
  label: string
  title: string
  description: string
  action?: { label: string; href: string }
  accent?: 'blue' | 'yellow' | 'green' | 'pink'
  visual?: ReactNode
}

export type WorkspaceFeatureShowcaseProps = {
  eyebrow?: string
  title: string
  description?: string
  features: readonly WorkspaceFeature[]
  initialFeatureId?: string
  className?: string
}

const accents = {
  blue: 'bg-[#dce7ff] text-[#2f6fed]',
  yellow: 'bg-[#fff1b8] text-[#8a6500]',
  green: 'bg-[#d9f2e2] text-[#247a46]',
  pink: 'bg-[#ffddec] text-[#a83369]',
}

export function WorkspaceFeatureShowcase({
  eyebrow,
  title,
  description,
  features,
  initialFeatureId,
  className,
}: WorkspaceFeatureShowcaseProps) {
  const [activeId, setActiveId] = useState(
    initialFeatureId && features.some((feature) => feature.id === initialFeatureId)
      ? initialFeatureId
      : features[0]?.id,
  )
  const active = features.find((feature) => feature.id === activeId) ?? features[0]

  if (!active) return null
  const accent = active.accent ?? 'blue'

  return (
    <section className={cn('bg-[#fffdf8] py-20 text-[#1b1b1b] md:py-28', className)}>
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? <p className="text-sm font-bold text-[#2f6fed]">{eyebrow}</p> : null}
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{title}</h2>
          {description ? (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#555]">{description}</p>
          ) : null}
        </div>

        <div
          className="mt-12 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label={title}
        >
          {features.map((feature) => {
            const selected = feature.id === active.id
            return (
              <button
                key={feature.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(feature.id)}
                className={cn(
                  'rounded-full border-2 px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6fed] focus-visible:ring-offset-2',
                  selected
                    ? 'border-[#1b1b1b] bg-[#1b1b1b] text-white'
                    : 'border-[#dedbd2] bg-white hover:border-[#1b1b1b]',
                )}
              >
                {feature.label}
              </button>
            )
          })}
        </div>

        <article
          role="tabpanel"
          className="mt-8 grid overflow-hidden rounded-[2rem] border-2 border-[#1b1b1b] bg-white shadow-[8px_8px_0_#1b1b1b] lg:grid-cols-[.82fr_1.18fr]"
        >
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <span
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl',
                accents[accent],
              )}
            >
              {accent === 'green' ? (
                <MessageCircle className="h-5 w-5" aria-hidden />
              ) : accent === 'pink' ? (
                <Sparkles className="h-5 w-5" aria-hidden />
              ) : accent === 'yellow' ? (
                <BarChart3 className="h-5 w-5" aria-hidden />
              ) : (
                <CalendarDays className="h-5 w-5" aria-hidden />
              )}
            </span>
            <h3 className="mt-7 text-3xl font-bold tracking-tight md:text-4xl">{active.title}</h3>
            <p className="mt-5 leading-7 text-[#555]">{active.description}</p>
            {active.action ? (
              <Link
                href={active.action.href}
                className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-bold text-[#2f6fed] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6fed]"
              >
                {active.action.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>

          <div className={cn('min-h-[480px] p-6 sm:p-10', accents[accent])}>
            {active.visual ?? (
              <div className="h-full rounded-[1.5rem] border-2 border-[#1b1b1b] bg-white p-5 text-[#1b1b1b] shadow-[6px_6px_0_rgba(27,27,27,.18)]">
                <div className="flex items-center justify-between border-b border-[#dedbd2] pb-4">
                  <div>
                    <p className="text-sm font-bold">{active.label}</p>
                    <p className="mt-1 text-xs text-[#777]">Espaço de trabalho</p>
                  </div>
                  <span className="rounded-lg bg-[#1b1b1b] px-3 py-2 text-xs font-bold text-white">
                    Novo
                  </span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="rounded-xl border border-[#dedbd2] p-4">
                      <div className={cn('h-24 rounded-lg', accents[accent])} />
                      <span className="mt-4 block h-2 w-4/5 rounded bg-[#1b1b1b]/20" />
                      <span className="mt-2 block h-2 w-1/2 rounded bg-[#1b1b1b]/10" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
