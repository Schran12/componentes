import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react'

import { cn } from '@/lib/utils'

export type FintechHeroSectionProps = {
  eyebrow?: string
  title: string
  highlightedText?: string
  description: string
  primaryAction: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  metrics?: readonly { label: string; value: string }[]
  panelTitle?: string
  panelValue?: string
  panelDetail?: string
  panelContent?: ReactNode
  className?: string
}

export function FintechHeroSection({
  eyebrow,
  title,
  highlightedText,
  description,
  primaryAction,
  secondaryAction,
  metrics = [],
  panelTitle = 'Visão geral',
  panelValue = 'R$ 84.240',
  panelDetail = '+18,4% no período',
  panelContent,
  className,
}: FintechHeroSectionProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-[#f6f9fc] pb-20 pt-24 text-[#0a2540] md:pb-28 md:pt-32',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[72%] origin-top-left skew-y-[-7deg] bg-gradient-to-br from-[#80e9ff] via-[#7a73ff] to-[#ff80b5] opacity-90"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-white/15 backdrop-blur-[1px]" />

      <div className="container grid items-center gap-16 lg:grid-cols-[1.02fr_.98fr]">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="mb-6 inline-flex rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#635bff] shadow-sm">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-[#0a2540] sm:text-6xl lg:text-7xl">
            {title}{' '}
            {highlightedText ? (
              <span className="bg-gradient-to-r from-[#635bff] via-[#7a3ff2] to-[#ff4f9a] bg-clip-text text-transparent">
                {highlightedText}
              </span>
            ) : null}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#425466]">{description}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={primaryAction.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#0a2540] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#1d3b53] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff] focus-visible:ring-offset-2"
            >
              {primaryAction.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[#0a2540] transition hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635bff]"
              >
                {secondaryAction.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>

          {metrics.length ? (
            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-5 border-t border-[#0a2540]/15 pt-7 sm:grid-cols-3">
              {metrics.slice(0, 3).map((metric) => (
                <div key={`${metric.value}-${metric.label}`}>
                  <dd className="text-2xl font-bold tracking-tight">{metric.value}</dd>
                  <dt className="mt-1 text-xs leading-5 text-[#425466]">{metric.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:translate-x-8">
          <div className="absolute -inset-8 -z-10 rounded-full bg-white/30 blur-3xl" />
          <div className="rotate-1 rounded-[2rem] border border-white/80 bg-white/90 p-3 shadow-[0_40px_100px_-30px_rgba(10,37,64,.5)] backdrop-blur-xl">
            <div className="overflow-hidden rounded-[1.4rem] border border-[#e6ebf1] bg-white">
              <div className="flex items-center justify-between border-b border-[#e6ebf1] px-6 py-4">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-xs font-semibold text-[#697386]">{panelTitle}</span>
              </div>
              {panelContent ?? (
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#697386]">
                    Volume processado
                  </p>
                  <p className="mt-2 text-4xl font-bold tracking-tight">{panelValue}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0e9f6e]">
                    <TrendingUp className="h-4 w-4" aria-hidden />
                    {panelDetail}
                  </p>

                  <div className="mt-8 flex h-32 items-end gap-2" aria-hidden>
                    {[38, 54, 42, 70, 62, 86, 76, 98, 82, 110, 96, 124].map((height, index) => (
                      <span
                        key={`${height}-${index}`}
                        className="flex-1 rounded-t bg-gradient-to-t from-[#635bff] to-[#80e9ff]"
                        style={{ height }}
                      />
                    ))}
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {['Operação protegida', 'Dados sincronizados'].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-xl bg-[#f6f9fc] p-3 text-xs font-medium text-[#425466]"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#635bff]" aria-hidden />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
