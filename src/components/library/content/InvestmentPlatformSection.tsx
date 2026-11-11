import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type InvestmentPlatformSectionProps = {
  eyebrow?: string
  title: string
  description: string
  metrics: readonly { value: string; label: string; note?: string }[]
  action?: { label: string; href: string }
  footnote?: string
  className?: string
}

export function InvestmentPlatformSection({
  eyebrow,
  title,
  description,
  metrics,
  action,
  footnote,
  className,
}: InvestmentPlatformSectionProps) {
  return (
    <section
      id="conteudo"
      className={cn('overflow-hidden bg-[#f0eee8] py-20 text-[#17211b] md:py-28', className)}
    >
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[.92fr_1.08fr] lg:gap-20">
          <div>
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#4d6655]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-5 max-w-2xl font-serif text-4xl leading-tight tracking-[-0.035em] md:text-6xl">
              {title}
            </h2>
          </div>
          <div className="lg:pt-10">
            <p className="max-w-2xl text-lg leading-8 text-[#49564e]">{description}</p>
            {action ? (
              <Link
                href={action.href}
                className="mt-8 inline-flex items-center gap-3 border-b border-[#17211b] pb-2 text-sm font-semibold transition hover:gap-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d6655]"
              >
                {action.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>

        <dl className="mt-16 grid border-y border-[#17211b]/20 sm:grid-cols-3">
          {metrics.slice(0, 3).map((metric, index) => (
            <div
              key={`${metric.value}-${metric.label}`}
              className={cn(
                'py-9 sm:px-8 md:py-12',
                index > 0 && 'border-t border-[#17211b]/20 sm:border-l sm:border-t-0',
                index === 0 && 'sm:pl-0',
              )}
            >
              <dd className="font-serif text-5xl tracking-[-0.045em] md:text-7xl">
                {metric.value}
              </dd>
              <dt className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[#4d6655]">
                {metric.label}
              </dt>
              {metric.note ? (
                <p className="mt-2 text-xs leading-5 text-[#6c776f]">{metric.note}</p>
              ) : null}
            </div>
          ))}
        </dl>

        {footnote ? <p className="mt-5 text-xs text-[#6c776f]">{footnote}</p> : null}
      </div>
    </section>
  )
}
