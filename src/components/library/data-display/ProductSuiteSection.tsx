'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import { useId, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Layers3 } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ProductSuiteItem = {
  id: string
  label: string
  title: string
  description: string
  features?: readonly string[]
  action?: { label: string; href: string }
  icon?: ReactNode
  visual?: ReactNode
}

export type ProductSuiteSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  items: readonly ProductSuiteItem[]
  initialItemId?: string
  className?: string
}

export function ProductSuiteSection({
  eyebrow,
  title,
  description,
  items,
  initialItemId,
  className,
}: ProductSuiteSectionProps) {
  const baseId = useId()
  const [activeId, setActiveId] = useState(
    initialItemId && items.some((item) => item.id === initialItemId) ? initialItemId : items[0]?.id,
  )
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  )
  const activeItem = items[activeIndex]

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()

    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : event.key === 'ArrowRight'
            ? (index + 1) % items.length
            : (index - 1 + items.length) % items.length

    setActiveId(items[nextIndex]?.id)
    document.getElementById(`${baseId}-tab-${items[nextIndex]?.id}`)?.focus()
  }

  if (!activeItem) return null

  return (
    <section className={cn('overflow-hidden bg-white py-20 text-[#0a2540] md:py-28', className)}>
      <div className="container">
        <div className="max-w-3xl">
          {eyebrow ? <p className="text-sm font-semibold text-[#635bff]">{eyebrow}</p> : null}
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] md:text-6xl">{title}</h2>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#425466]">{description}</p>
          ) : null}
        </div>

        <div
          role="tablist"
          aria-label={title}
          className="mt-12 flex gap-2 overflow-x-auto border-b border-[#dfe7ef] pb-px"
        >
          {items.map((item, index) => {
            const selected = item.id === activeItem.id
            return (
              <button
                key={item.id}
                id={`${baseId}-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(item.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  'relative flex min-w-fit items-center gap-2 px-4 py-4 text-sm font-semibold text-[#697386] transition hover:text-[#0a2540] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#635bff]',
                  selected && 'text-[#635bff]',
                )}
              >
                {item.icon ? <span aria-hidden>{item.icon}</span> : null}
                {item.label}
                {selected ? (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#635bff]" />
                ) : null}
              </button>
            )
          })}
        </div>

        <article
          id={`${baseId}-panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeItem.id}`}
          className="grid min-h-[480px] gap-12 rounded-b-[2rem] bg-[#f6f9fc] p-7 sm:p-10 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:p-14"
        >
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#635bff] text-white shadow-lg shadow-[#635bff]/25">
              {activeItem.icon ?? <Layers3 className="h-5 w-5" aria-hidden />}
            </span>
            <h3 className="mt-7 text-3xl font-bold tracking-tight md:text-4xl">
              {activeItem.title}
            </h3>
            <p className="mt-5 leading-7 text-[#425466]">{activeItem.description}</p>

            {activeItem.features?.length ? (
              <ul className="mt-7 grid gap-3">
                {activeItem.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-[#425466]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#635bff]/10 text-[#635bff]">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}

            {activeItem.action ? (
              <Link
                href={activeItem.action.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0a2540] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d3b53] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff] focus-visible:ring-offset-2"
              >
                {activeItem.action.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[1.75rem] border border-white bg-white p-5 shadow-[0_30px_80px_-35px_rgba(10,37,64,.45)] sm:p-8">
            {activeItem.visual ?? (
              <div className="flex h-full min-h-[300px] flex-col">
                <div className="flex items-center justify-between">
                  <span className="h-3 w-28 rounded-full bg-[#dfe7ef]" />
                  <span className="h-9 w-24 rounded-full bg-[#635bff]/10" />
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[72, 88, 64].map((value) => (
                    <div key={value} className="rounded-2xl border border-[#e6ebf1] p-4">
                      <span className="block h-2 w-12 rounded bg-[#aab7c4]" />
                      <span
                        className="mt-4 block h-6 rounded bg-[#0a2540]"
                        style={{ width: value }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-1 items-end gap-3 rounded-2xl bg-[#f6f9fc] p-5">
                  {[36, 58, 48, 82, 66, 92, 74, 110].map((height, index) => (
                    <span
                      key={`${height}-${index}`}
                      className="flex-1 rounded-t bg-gradient-to-t from-[#635bff] to-[#80e9ff]"
                      style={{ height }}
                    />
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
