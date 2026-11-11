import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Command, Copy, Link2, Zap } from 'lucide-react'

import { cn } from '@/lib/utils'

export type AutomationTool = {
  title: string
  description: string
  shortcut?: string
  href?: string
  icon?: ReactNode
  accent?: 'red' | 'purple' | 'blue' | 'green'
}

export type AutomationToolkitSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  tools: readonly AutomationTool[]
  className?: string
}

const accents = {
  red: 'from-[#ff6b63]/30 to-[#e5484d]/5 text-[#ff817a]',
  purple: 'from-[#7c4dff]/30 to-[#7c4dff]/5 text-[#a78bfa]',
  blue: 'from-[#3b82f6]/30 to-[#3b82f6]/5 text-[#7db1ff]',
  green: 'from-[#22c55e]/30 to-[#22c55e]/5 text-[#6ee7a0]',
}

export function AutomationToolkitSection({
  eyebrow,
  title,
  description,
  tools,
  className,
}: AutomationToolkitSectionProps) {
  return (
    <section className={cn('bg-[#0d0d0f] py-20 text-white md:py-28', className)}>
      <div className="container">
        <div className="max-w-3xl">
          {eyebrow ? <p className="text-sm font-semibold text-[#ff6b63]">{eyebrow}</p> : null}
          <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{title}</h2>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/50">{description}</p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {tools.slice(0, 4).map((tool, index) => {
            const accent =
              tool.accent ?? (['red', 'purple', 'blue', 'green'][index] as keyof typeof accents)
            const content = (
              <>
                <div
                  className={cn(
                    'relative flex min-h-[210px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br',
                    accents[accent],
                  )}
                >
                  <span
                    aria-hidden
                    className="absolute h-36 w-36 rounded-full border-[24px] border-current opacity-10"
                  />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-black/35 shadow-xl backdrop-blur">
                    {tool.icon ??
                      (index === 0 ? (
                        <Copy className="h-7 w-7" aria-hidden />
                      ) : index === 1 ? (
                        <Link2 className="h-7 w-7" aria-hidden />
                      ) : index === 2 ? (
                        <Command className="h-7 w-7" aria-hidden />
                      ) : (
                        <Zap className="h-7 w-7" aria-hidden />
                      ))}
                  </span>
                  {tool.shortcut ? (
                    <kbd className="absolute bottom-4 right-4 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs text-white/60 backdrop-blur">
                      {tool.shortcut}
                    </kbd>
                  ) : null}
                </div>
                <div className="p-2 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">{tool.title}</h3>
                    {tool.href ? (
                      <ArrowUpRight
                        className="h-5 w-5 text-white/25 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                        aria-hidden
                      />
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/45">{tool.description}</p>
                </div>
              </>
            )

            return tool.href ? (
              <Link
                key={tool.title}
                href={tool.href}
                className="group rounded-2xl border border-white/10 bg-[#151518] p-3 transition hover:-translate-y-1 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b63]"
              >
                {content}
              </Link>
            ) : (
              <article
                key={tool.title}
                className="group rounded-2xl border border-white/10 bg-[#151518] p-3"
              >
                {content}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
