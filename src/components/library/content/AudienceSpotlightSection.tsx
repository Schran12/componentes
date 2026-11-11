'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Quote } from 'lucide-react'

import { cn } from '@/lib/utils'

export type AudienceSpotlightItem = {
  id: string
  label: string
  eyebrow?: string
  title: string
  description: string
  benefits: readonly { title: string; description: string }[]
  action?: { label: string; href: string }
  quote?: { text: string; author: string; role?: string }
  visual?: ReactNode
}

export type AudienceSpotlightSectionProps = {
  title: string
  description?: string
  items: readonly AudienceSpotlightItem[]
  initialItemId?: string
  className?: string
}

export function AudienceSpotlightSection({
  title,
  description,
  items,
  initialItemId,
  className,
}: AudienceSpotlightSectionProps) {
  const [activeId, setActiveId] = useState(
    initialItemId && items.some((item) => item.id === initialItemId) ? initialItemId : items[0]?.id,
  )
  const activeItem = items.find((item) => item.id === activeId) ?? items[0]

  if (!activeItem) return null

  return (
    <section className={cn('bg-white py-20 text-[#0a2540] md:py-28', className)}>
      <div className="container">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold tracking-[-0.035em] md:text-6xl">{title}</h2>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#425466]">{description}</p>
          ) : null}
        </div>

        <div className="mt-12 flex flex-wrap gap-2" role="tablist" aria-label={title}>
          {items.map((item) => {
            const selected = item.id === activeItem.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  'rounded-full border px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff] focus-visible:ring-offset-2',
                  selected
                    ? 'border-[#0a2540] bg-[#0a2540] text-white'
                    : 'border-[#dfe7ef] bg-white text-[#425466] hover:border-[#aab7c4] hover:text-[#0a2540]',
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <article role="tabpanel" className="mt-8 overflow-hidden rounded-[2rem] bg-[#f6f9fc]">
          <div className="grid lg:grid-cols-[1.02fr_.98fr]">
            <div className="p-7 sm:p-10 lg:p-14">
              {activeItem.eyebrow ? (
                <p className="text-sm font-semibold text-[#635bff]">{activeItem.eyebrow}</p>
              ) : null}
              <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                {activeItem.title}
              </h3>
              <p className="mt-5 max-w-xl leading-7 text-[#425466]">{activeItem.description}</p>

              <div className="mt-9 grid gap-7 sm:grid-cols-2">
                {activeItem.benefits.slice(0, 4).map((benefit, index) => (
                  <div
                    key={`${benefit.title}-${index}`}
                    className="border-l-2 border-[#635bff] pl-4"
                  >
                    <h4 className="font-semibold">{benefit.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#697386]">{benefit.description}</p>
                  </div>
                ))}
              </div>

              {activeItem.action ? (
                <Link
                  href={activeItem.action.href}
                  className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-[#635bff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff]"
                >
                  {activeItem.action.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : null}
            </div>

            <div className="relative min-h-[460px] overflow-hidden bg-gradient-to-br from-[#635bff] via-[#7a73ff] to-[#80e9ff] p-7 text-white sm:p-10 lg:p-14">
              {activeItem.visual ?? (
                <>
                  <span
                    aria-hidden
                    className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[42px] border-white/10"
                  />
                  <span
                    aria-hidden
                    className="absolute -bottom-28 -left-20 h-80 w-80 rotate-12 rounded-[5rem] bg-[#0a2540]/20"
                  />
                  {activeItem.quote ? (
                    <blockquote className="relative flex h-full min-h-[340px] flex-col justify-end">
                      <Quote className="h-10 w-10 text-white/55" aria-hidden />
                      <p className="mt-6 text-2xl font-semibold leading-9">
                        “{activeItem.quote.text}”
                      </p>
                      <footer className="mt-7">
                        <cite className="font-semibold not-italic">{activeItem.quote.author}</cite>
                        {activeItem.quote.role ? (
                          <p className="mt-1 text-sm text-white/70">{activeItem.quote.role}</p>
                        ) : null}
                      </footer>
                    </blockquote>
                  ) : (
                    <div className="relative grid h-full min-h-[340px] grid-cols-2 content-end gap-4">
                      {[
                        ['48%', 'crescimento'],
                        ['12x', 'escala'],
                        ['99,9%', 'disponibilidade'],
                        ['24/7', 'operação'],
                      ].map(([value, label]) => (
                        <div key={value} className="rounded-2xl bg-white/15 p-5 backdrop-blur">
                          <p className="text-3xl font-bold">{value}</p>
                          <p className="mt-1 text-xs text-white/70">{label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
