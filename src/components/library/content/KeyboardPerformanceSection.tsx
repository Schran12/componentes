import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type KeyboardPrinciple = {
  title: string
  description: string
  key?: string
  icon?: ReactNode
}

export type KeyboardPerformanceSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  principles: readonly KeyboardPrinciple[]
  keys?: readonly string[]
  className?: string
}

export function KeyboardPerformanceSection({
  eyebrow,
  title,
  description,
  principles,
  keys = ['esc', '⌘', 'K', '↵', '⌥', '⇧', 'A', 'I', '⌫', '→', '↓', '⌃'],
  className,
}: KeyboardPerformanceSectionProps) {
  return (
    <section
      className={cn('overflow-hidden bg-[#efeff2] py-20 text-[#141416] md:py-28', className)}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? <p className="text-sm font-semibold text-[#e5484d]">{eyebrow}</p> : null}
          <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{title}</h2>
          {description ? (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#65656b]">{description}</p>
          ) : null}
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl">
          <div className="grid grid-cols-4 gap-2 rounded-[2rem] border border-black/10 bg-[#d8d8dc] p-3 shadow-[0_30px_80px_-35px_rgba(0,0,0,.45)] sm:grid-cols-6 lg:grid-cols-12">
            {keys.slice(0, 12).map((key, index) => (
              <div
                key={`${key}-${index}`}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-xl border border-black/10 bg-gradient-to-b from-white to-[#ededf0] text-sm font-semibold shadow-[0_3px_0_#b8b8bd]',
                  index === 1 && 'bg-gradient-to-b from-[#ff6b63] to-[#e5484d] text-white',
                )}
              >
                {key}
              </div>
            ))}
          </div>

          <div className="relative z-10 mx-auto -mt-2 grid max-w-5xl gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
            {principles.slice(0, 4).map((principle) => (
              <article key={principle.title} className="bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f1f3] text-[#e5484d]">
                    {principle.icon ?? principle.key ?? '⌘'}
                  </span>
                  {principle.key ? (
                    <kbd className="rounded-md border bg-[#f7f7f8] px-2 py-1 text-[10px] text-[#777]">
                      {principle.key}
                    </kbd>
                  ) : null}
                </div>
                <h3 className="mt-5 font-semibold">{principle.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#65656b]">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
