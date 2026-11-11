'use client'

import { useId, useState } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ProductFeatureTab = {
  id: string
  label: string
  title: string
  description: string
  features?: string[]
  image: { src: string; alt: string }
  action?: { label: string; href: string }
}

export type ProductFeatureTabsProps = {
  eyebrow?: string
  title: string
  items: ProductFeatureTab[]
  initialId?: string
  className?: string
}

export function ProductFeatureTabs({
  eyebrow = 'Soluções',
  title,
  items,
  initialId,
  className,
}: ProductFeatureTabsProps) {
  const instanceId = useId()
  const [activeId, setActiveId] = useState(initialId ?? items[0]?.id)
  const activeItem = items.find((item) => item.id === activeId) ?? items[0]

  if (!activeItem) return null

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <header className="mb-9 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
        </header>

        <div
          className="mb-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] max-sm:flex-wrap [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label={title}
        >
          {items.map((item) => {
            const selected = item.id === activeItem.id
            return (
              <button
                key={item.id}
                id={`${instanceId}-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${instanceId}-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div
          id={`${instanceId}-panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`${instanceId}-tab-${activeItem.id}`}
          className="grid overflow-hidden rounded-[2rem] border bg-card shadow-sm lg:grid-cols-2"
        >
          <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
            <h3 className="text-2xl font-semibold md:text-3xl">{activeItem.title}</h3>
            <p className="mt-4 leading-7 text-muted-foreground">{activeItem.description}</p>
            {activeItem.features?.length ? (
              <ul className="mt-7 grid gap-3">
                {activeItem.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
            {activeItem.action ? (
              <a
                href={activeItem.action.href}
                className="mt-8 inline-flex w-fit items-center gap-2 font-semibold text-primary hover:underline"
              >
                {activeItem.action.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <div className="relative min-h-72 overflow-hidden bg-muted lg:min-h-[480px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeItem.id}
              src={activeItem.image.src}
              alt={activeItem.image.alt}
              className="size-full object-cover motion-safe:duration-500 motion-safe:animate-in motion-safe:fade-in"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
