import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

export type AgencyHeroSectionProps = {
  eyebrow?: string
  title: string
  highlightedText?: string
  description: string
  image?: { src: string; alt: string }
  primaryAction: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  highlights?: readonly string[]
  className?: string
}

export function AgencyHeroSection({
  eyebrow,
  title,
  highlightedText,
  description,
  image,
  primaryAction,
  secondaryAction,
  highlights = [],
  className,
}: AgencyHeroSectionProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-[#faf8fb] py-20 text-[#10100e] md:py-28 lg:py-32',
        className,
      )}
    >
      <div className="absolute -left-32 top-12 -z-10 h-80 w-80 rounded-full bg-[#752871]/15 blur-3xl" />
      <div className="absolute -right-24 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#752871]/20 blur-3xl" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-white to-transparent" />

      <div className="container grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10 max-w-3xl">
          {eyebrow ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#752871]/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#752871] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {eyebrow}
            </div>
          ) : null}
          <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            {title}{' '}
            {highlightedText ? <span className="text-[#752871]">{highlightedText}</span> : null}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5a5560]">{description}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={primaryAction.href}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#752871] px-7 font-semibold text-white shadow-lg shadow-[#752871]/20 transition hover:-translate-y-0.5 hover:bg-[#590b55] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#752871]"
            >
              {primaryAction.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex h-12 items-center rounded-full border border-[#3f2644]/20 bg-white/70 px-7 font-semibold text-[#3f2644] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#752871]/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#752871]"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>

          {highlights.length ? (
            <ul className="mt-10 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[#3f2644]/10 bg-white/60 px-3 py-1.5 text-xs font-medium text-[#5a5560]"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="relative mx-auto min-h-[480px] w-full max-w-xl">
          <div className="absolute inset-8 rotate-6 rounded-[3rem] bg-[#752871]" />
          <div className="absolute inset-0 -rotate-3 rounded-[3rem] border border-[#752871]/20 bg-[#ede8ef]" />
          {image ? (
            <figure className="absolute inset-5 overflow-hidden rounded-[2.5rem] bg-[#3f2644] shadow-2xl">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 42vw, 90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3f2644]/45 to-transparent" />
            </figure>
          ) : (
            <div className="absolute inset-5 flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-[#3f2644]">
              <div className="h-60 w-60 rounded-[45%_55%_52%_48%] bg-[#752871] shadow-[80px_-50px_0_#9b4b96,-70px_60px_0_#5b1d57]" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
