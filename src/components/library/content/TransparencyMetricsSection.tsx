import Link from 'next/link'
import { ArrowUpRight, Eye } from 'lucide-react'

import { cn } from '@/lib/utils'

export type TransparencyMetric = {
  value: string
  label: string
  detail?: string
  trend?: string
}

export type TransparencyMetricsSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  metrics: readonly TransparencyMetric[]
  action?: { label: string; href: string }
  className?: string
}

export function TransparencyMetricsSection({
  eyebrow,
  title,
  description,
  metrics,
  action,
  className,
}: TransparencyMetricsSectionProps) {
  return (
    <section className={cn('bg-[#fffdf8] py-20 text-[#1b1b1b] md:py-28', className)}>
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#1b1b1b] bg-[#f4c95d] shadow-[3px_3px_0_#1b1b1b]">
              <Eye className="h-5 w-5" aria-hidden />
            </span>
            {eyebrow ? <p className="mt-7 text-sm font-bold text-[#2f6fed]">{eyebrow}</p> : null}
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{title}</h2>
          </div>
          <div>
            {description ? (
              <p className="max-w-2xl text-lg leading-8 text-[#555]">{description}</p>
            ) : null}
            {action ? (
              <Link
                href={action.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#2f6fed] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6fed]"
              >
                {action.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>

        <dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.slice(0, 4).map((metric, index) => (
            <div
              key={`${metric.value}-${metric.label}`}
              className={cn(
                'rounded-2xl border-2 border-[#1b1b1b] p-6 shadow-[4px_4px_0_#1b1b1b]',
                index % 4 === 0 && 'bg-[#dce7ff]',
                index % 4 === 1 && 'bg-[#d9f2e2]',
                index % 4 === 2 && 'bg-[#fff1b8]',
                index % 4 === 3 && 'bg-[#ffddec]',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <dd className="text-4xl font-bold tracking-[-0.04em]">{metric.value}</dd>
                {metric.trend ? (
                  <span className="rounded-full bg-white/70 px-2 py-1 text-[10px] font-bold">
                    {metric.trend}
                  </span>
                ) : null}
              </div>
              <dt className="mt-5 text-xs font-bold uppercase tracking-[0.14em]">{metric.label}</dt>
              {metric.detail ? (
                <p className="mt-2 text-xs leading-5 text-[#555]">{metric.detail}</p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
