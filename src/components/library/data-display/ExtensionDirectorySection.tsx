'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Boxes, Search } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ExtensionDirectoryItem = {
  id: string
  name: string
  description: string
  category: string
  href: string
  icon?: ReactNode
  color?: string
}

export type ExtensionDirectorySectionProps = {
  eyebrow?: string
  title: string
  description?: string
  items: readonly ExtensionDirectoryItem[]
  action?: { label: string; href: string }
  className?: string
}

export function ExtensionDirectorySection({
  eyebrow,
  title,
  description,
  items,
  action,
  className,
}: ExtensionDirectorySectionProps) {
  const categories = useMemo(() => Array.from(new Set(items.map((item) => item.category))), [items])
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    return items.filter(
      (item) =>
        (category === 'all' || item.category === category) &&
        (!normalized ||
          `${item.name} ${item.description}`.toLocaleLowerCase('pt-BR').includes(normalized)),
    )
  }, [category, items, query])

  return (
    <section className={cn('bg-[#0d0d0f] py-20 text-white md:py-28', className)}>
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            {eyebrow ? <p className="text-sm font-semibold text-[#ff6b63]">{eyebrow}</p> : null}
            <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{title}</h2>
          </div>
          {description ? (
            <p className="max-w-2xl text-lg leading-8 text-white/50 lg:justify-self-end">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-12 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', ...categories].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={cn(
                  'min-w-fit rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b63]',
                  category === item
                    ? 'border-white bg-white text-black'
                    : 'border-white/15 bg-white/5 text-white/55 hover:text-white',
                )}
              >
                {item === 'all' ? 'Todas' : item}
              </button>
            ))}
          </div>
          <label className="flex min-w-[260px] items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
            <Search className="h-4 w-4 text-white/35" aria-hidden />
            <span className="sr-only">Buscar extensões</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar extensões..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </label>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group flex min-h-[190px] flex-col rounded-2xl border border-white/10 bg-[#17171a] p-5 transition hover:-translate-y-1 hover:border-white/25 hover:bg-[#1d1d21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b63]"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: item.color ?? '#e5484d' }}
                >
                  {item.icon ?? <Boxes className="h-5 w-5" aria-hidden />}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  {item.category}
                </span>
              </div>
              <h3 className="mt-6 font-semibold">{item.name}</h3>
              <p className="mt-2 text-sm leading-6 text-white/45">{item.description}</p>
            </Link>
          ))}
        </div>

        {!visible.length ? (
          <p className="mt-8 rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/40">
            Nenhuma extensão encontrada.
          </p>
        ) : null}

        {action ? (
          <div className="mt-10 text-center">
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b63]"
            >
              {action.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
