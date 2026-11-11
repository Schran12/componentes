import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type AboutMetricsSectionProps = {
  eyebrow?: string
  title: string
  paragraphs: readonly string[]
  metrics: readonly { value: string; label: string }[]
  image?: { src: string; alt: string }
  action?: { label: string; href: string }
  mediaPosition?: 'left' | 'right'
  className?: string
}

export function AboutMetricsSection({
  eyebrow,
  title,
  paragraphs,
  metrics,
  image,
  action,
  mediaPosition = 'right',
  className,
}: AboutMetricsSectionProps) {
  return (
    <section className={cn('overflow-hidden bg-white py-20 md:py-28', className)}>
      <div className="container grid items-center gap-14 lg:grid-cols-[1.12fr_.88fr] lg:gap-20">
        <div className={cn(mediaPosition === 'left' && 'lg:order-2')}>
          {eyebrow ? (
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#752871]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#10100e] md:text-5xl">
            {title}
          </h2>
          <div className="mt-7 space-y-5">
            {paragraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 24)}-${index}`} className="leading-8 text-[#5a5560]">
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-[#e8e4ea] py-7 sm:grid-cols-3">
            {metrics.slice(0, 3).map((metric) => (
              <div key={`${metric.value}-${metric.label}`}>
                <dd className="text-3xl font-bold text-[#752871] md:text-4xl">{metric.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-[#7a7480]">
                  {metric.label}
                </dt>
              </div>
            ))}
          </dl>

          {action ? (
            <Link
              href={action.href}
              className="mt-8 inline-flex items-center gap-2 font-semibold text-[#752871]"
            >
              {action.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className={cn('relative min-h-[520px]', mediaPosition === 'left' && 'lg:order-1')}>
          <div className="absolute inset-4 rotate-3 rounded-[3rem] bg-[#752871]/15" />
          <figure className="absolute inset-0 overflow-hidden rounded-[3rem] bg-[#3f2644] shadow-xl">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            ) : (
              <div className="relative h-full overflow-hidden">
                <span className="absolute -left-16 top-12 h-72 w-72 rounded-[45%_55%_40%_60%] bg-[#752871]" />
                <span className="absolute -right-12 bottom-10 h-64 w-64 rounded-[60%_40%] bg-[#9b4b96]" />
                <span className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border-[24px] border-white/20" />
              </div>
            )}
          </figure>
        </div>
      </div>
    </section>
  )
}
