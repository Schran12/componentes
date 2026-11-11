import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import {
  getAccentTone,
  padIndex,
  type AccentTone,
} from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type HoverRevealServiceItem = {
  title: string
  description: string
  href: string
  image: { src: string; alt: string }
  label?: string
}

export type HoverRevealServicesProps = {
  items: readonly HoverRevealServiceItem[]
  tone?: AccentTone
  className?: string
}

const toneStyles: Record<
  AccentTone,
  { even: string; odd: string; veil: string; fade: string; badge: string; label: string }
> = {
  glow: {
    even: 'bg-[#121212]',
    odd: 'bg-[#221d2f]',
    veil: 'group-hover:bg-[#121212]/60',
    fade: 'from-[#121212] via-[#121212]/40',
    badge: 'rounded-full border-[#493849] group-hover:border-[#c642a5] group-hover:bg-[#c642a5]',
    label: 'text-[#ffb0eb] group-hover:text-[#ae89ff]',
  },
  industrial: {
    even: 'bg-slate-950',
    odd: 'bg-slate-900',
    veil: 'group-hover:bg-slate-950/55',
    fade: 'from-slate-950 via-slate-950/40',
    badge:
      'border-white/25 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950',
    label: 'text-amber-500 group-hover:text-amber-400',
  },
  'industrial-dark': {
    even: 'bg-slate-950',
    odd: 'bg-slate-900',
    veil: 'group-hover:bg-slate-950/55',
    fade: 'from-slate-950 via-slate-950/40',
    badge:
      'border-white/25 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950',
    label: 'text-amber-500 group-hover:text-amber-400',
  },
}

/** Faixa de serviços em colunas que revelam a imagem de fundo no hover ou foco. */
export function HoverRevealServices({ items, tone = 'glow', className }: HoverRevealServicesProps) {
  const t = getAccentTone(tone)
  const s = toneStyles[tone]

  return (
    <section className={cn('w-full', s.even, className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <Link
            key={item.href + item.title}
            href={item.href}
            className={cn(
              'group relative isolate flex min-h-[22rem] flex-col justify-between overflow-hidden p-8 sm:min-h-[26rem] lg:min-h-[28rem] lg:p-10',
              index % 2 === 0 ? s.even : s.odd,
              t.focus,
            )}
          >
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="scale-110 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
            />
            <div
              className={cn('absolute inset-0 transition-colors duration-500', s.veil)}
              aria-hidden
            />
            <div
              className={cn(
                'absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                s.fade,
              )}
              aria-hidden
            />

            <span
              className={cn(
                'relative z-10 text-xs font-medium tracking-[0.28em] transition-colors duration-500',
                s.label,
              )}
            >
              {item.label ?? padIndex(index)}
            </span>

            <div className="relative z-10 mt-auto space-y-4">
              <div className="flex items-end justify-between gap-4">
                <h3 className="max-w-[12ch] text-2xl font-semibold leading-tight tracking-tight text-white lg:text-[1.65rem]">
                  {item.title}
                </h3>
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center border text-white transition-all duration-500',
                    s.badge,
                  )}
                  aria-hidden
                >
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </div>
              <p
                className={cn(
                  'max-w-[28ch] text-sm leading-relaxed transition-colors duration-500',
                  tone === 'glow'
                    ? 'text-[#c1c1c1] group-hover:text-white'
                    : 'text-slate-400 group-hover:text-slate-200',
                )}
              >
                {item.description}
              </p>
            </div>

            {tone === 'glow' ? (
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#86196b] to-[#5327b3] opacity-60"
                aria-hidden
              />
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  )
}
