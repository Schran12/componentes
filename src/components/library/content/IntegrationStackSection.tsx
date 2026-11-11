import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Braces, CheckCircle2 } from 'lucide-react'

import { cn } from '@/lib/utils'

export type IntegrationOption = {
  title: string
  description: string
  icon?: ReactNode
  href?: string
}

export type IntegrationStackSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  capabilities?: readonly string[]
  metrics?: readonly { value: string; label: string }[]
  options: readonly IntegrationOption[]
  code?: string
  action?: { label: string; href: string }
  className?: string
}

export function IntegrationStackSection({
  eyebrow,
  title,
  description,
  capabilities = [],
  metrics = [],
  options,
  code = `const result = await platform.create({
  amount: 24900,
  currency: 'brl',
  automatic: true,
})`,
  action,
  className,
}: IntegrationStackSectionProps) {
  return (
    <section className={cn('overflow-hidden bg-[#0a2540] py-20 text-white md:py-28', className)}>
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[.88fr_1.12fr] lg:items-center">
          <div>
            {eyebrow ? <p className="text-sm font-semibold text-[#80e9ff]">{eyebrow}</p> : null}
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{title}</h2>
            {description ? (
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">{description}</p>
            ) : null}

            {capabilities.length ? (
              <ul className="mt-8 grid gap-3">
                {capabilities.map((capability) => (
                  <li key={capability} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle2 className="h-4 w-4 text-[#80e9ff]" aria-hidden />
                    {capability}
                  </li>
                ))}
              </ul>
            ) : null}

            {action ? (
              <Link
                href={action.href}
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#80e9ff] px-5 py-3 text-sm font-semibold text-[#0a2540] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a2540]"
              >
                {action.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-20 bg-[radial-gradient(circle_at_center,rgba(99,91,255,.34),transparent_60%)]"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#071f35] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/55">
                  <Braces className="h-4 w-4 text-[#80e9ff]" aria-hidden />
                  integration.ts
                </div>
                <span className="rounded-full bg-[#00d4a8]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#67f0d2]">
                  Online
                </span>
              </div>
              <pre className="overflow-x-auto p-6 text-sm leading-7 text-[#c4f1ff] sm:p-8">
                <code>{code}</code>
              </pre>
              <div className="grid border-t border-white/10 sm:grid-cols-3">
                {metrics.slice(0, 3).map((metric) => (
                  <div
                    key={`${metric.value}-${metric.label}`}
                    className="border-b border-white/10 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                  >
                    <p className="text-xl font-bold">{metric.value}</p>
                    <p className="mt-1 text-xs text-white/45">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] bg-white/10 sm:grid-cols-3">
          {options.slice(0, 3).map((option) => {
            const content = (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#80e9ff]">
                  {option.icon ?? <Braces className="h-5 w-5" aria-hidden />}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{option.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{option.description}</p>
                {option.href ? (
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#80e9ff]">
                    Explorar
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                ) : null}
              </>
            )

            return option.href ? (
              <Link
                key={option.title}
                href={option.href}
                className="group bg-[#0d2d49] p-7 transition hover:bg-[#123957] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#80e9ff]"
              >
                {content}
              </Link>
            ) : (
              <article key={option.title} className="bg-[#0d2d49] p-7">
                {content}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
