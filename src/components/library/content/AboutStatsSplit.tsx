import Image from 'next/image'

import { Counter } from '@/components/library/motion/Counter'
import { AccentButton } from '@/components/library/primitives/AccentButton'
import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import {
  getAccentTone,
  padIndex,
  type AccentTone,
} from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type AboutStatsSplitStat = {
  value: number | string
  label: string
  prefix?: string
  suffix?: string
}

export type AboutStatsSplitProps = {
  title: string
  image: { src: string; alt: string }
  eyebrow?: string
  description?: string
  paragraphs?: readonly string[]
  stats?: readonly AboutStatsSplitStat[]
  pillars?: readonly { title: string; description: string }[]
  action?: { label: string; href: string }
  reverse?: boolean
  tone?: AccentTone
  className?: string
}

/** Seção institucional dividida: imagem com faixa de métricas e texto com pilares numerados. */
export function AboutStatsSplit({
  title,
  image,
  eyebrow,
  description,
  paragraphs = [],
  stats = [],
  pillars = [],
  action,
  reverse = false,
  tone = 'glow',
  className,
}: AboutStatsSplitProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        isGlow ? 'bg-[#0e0e0e]' : tone === 'industrial' ? 'bg-slate-50' : 'bg-slate-950',
        className,
      )}
    >
      <div className="grid lg:grid-cols-2">
        <div
          className={cn(
            'relative min-h-[18rem] sm:min-h-[22rem] lg:min-h-[32rem]',
            reverse && 'lg:order-2',
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t to-transparent lg:bg-gradient-to-r lg:from-transparent',
              isGlow
                ? 'from-[#121212]/85 via-[#121212]/20 lg:via-[#121212]/10 lg:to-[#121212]/50'
                : 'from-slate-950/80 via-slate-950/20 lg:via-slate-950/10 lg:to-slate-950/40',
            )}
            aria-hidden
          />

          {stats.length ? (
            <dl
              className={cn(
                'absolute inset-x-0 bottom-0 grid border-t backdrop-blur-sm',
                isGlow ? 'border-[#493849] bg-[#121212]/75' : 'border-white/15 bg-slate-950/70',
              )}
              style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    'flex flex-col-reverse px-3 py-4 sm:px-5 sm:py-5',
                    index > 0 && cn('border-l', isGlow ? 'border-[#493849]' : 'border-white/15'),
                  )}
                >
                  <dt
                    className={cn(
                      'mt-1 text-[0.65rem] uppercase tracking-[0.18em] sm:text-[0.7rem]',
                      isGlow ? 'text-[#c1c1c1]' : 'text-slate-300',
                    )}
                  >
                    {stat.label}
                  </dt>
                  <dd className="text-xl font-semibold tracking-wide text-white sm:text-2xl lg:text-3xl">
                    {typeof stat.value === 'number' ? (
                      <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                    ) : (
                      `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div
          className={cn(
            'relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-12 lg:py-16 xl:px-14',
            isGlow ? 'bg-[#121212]' : tone === 'industrial' ? 'bg-slate-50' : 'bg-slate-900',
          )}
        >
          <EyebrowHeading tone={tone} eyebrow={eyebrow} title={title} />
          {description ? (
            <p className={cn('mt-5 max-w-md text-base leading-relaxed', t.body)}>{description}</p>
          ) : null}
          {paragraphs.length ? (
            <div className={cn('mt-6 space-y-4 text-base leading-relaxed', t.body)}>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {pillars.length ? (
            <ul className={cn('mt-8 space-y-4 border-t pt-6', t.border)}>
              {pillars.map((pillar, index) => (
                <li key={pillar.title} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <span
                    className={cn('text-xs tracking-[0.2em]', isGlow ? 'text-[#ae89ff]' : t.accent)}
                  >
                    {padIndex(index)}
                  </span>
                  <div>
                    <p className={cn('text-sm font-semibold tracking-wide', t.strong)}>
                      {pillar.title}
                    </p>
                    <p className={cn('mt-1 text-sm leading-relaxed', t.muted)}>
                      {pillar.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {action ? (
            <div className="mt-8">
              <AccentButton href={action.href} tone={tone}>
                {action.label}
              </AccentButton>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
