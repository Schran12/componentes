import type { CSSProperties } from 'react'

import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

import { TestimonialAvatar, type AccentTestimonial } from './TestimonialAvatar'

export type TestimonialsColumnsProps = {
  title: string
  testimonials: readonly AccentTestimonial[]
  eyebrow?: string
  description?: string
  columns?: 2 | 3
  duration?: number
  tone?: AccentTone
  className?: string
}

const keyframes =
  '@keyframes accent-testimonials-scroll-y{from{transform:translateY(0)}to{transform:translateY(-50%)}}'

const visibility = ['', 'hidden md:block', 'hidden lg:block']

/** Depoimentos em colunas verticais infinitas com velocidades diferentes e pausa no hover. */
export function TestimonialsColumns({
  title,
  testimonials,
  eyebrow,
  description,
  columns = 3,
  duration = 20,
  tone = 'glow',
  className,
}: TestimonialsColumnsProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'
  const groups = Array.from({ length: columns }, (_, column) =>
    testimonials.filter((_, index) => index % columns === column),
  ).filter((group) => group.length)
  const fade = isGlow
    ? 'from-[#121212]'
    : tone === 'industrial'
      ? 'from-slate-50'
      : 'from-slate-950'

  return (
    <section className={cn('overflow-hidden py-14 lg:py-20', t.section, className)}>
      <style>{keyframes}</style>
      <div className="container">
        <EyebrowHeading
          tone={tone}
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          className="mb-12"
        />

        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
          {testimonials.map((testimonial) => (
            <li key={testimonial.name} className="w-[85%] shrink-0 snap-center">
              <figure
                className={cn(
                  'h-full border p-6 shadow-sm',
                  t.panel,
                  t.border,
                  isGlow ? 'rounded-2xl' : '',
                )}
              >
                <blockquote className={cn('text-sm leading-relaxed', t.body)}>
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <TestimonialAvatar
                    name={testimonial.name}
                    src={testimonial.avatar}
                    className={cn(
                      'h-10 w-10',
                      isGlow
                        ? 'rounded-full bg-[#121212] text-[#ffb0eb]'
                        : 'bg-slate-100 text-amber-600',
                    )}
                  />
                  <span>
                    <span className={cn('block text-sm font-semibold', t.strong)}>
                      {testimonial.name}
                    </span>
                    {testimonial.role ? (
                      <span className={cn('block text-xs', t.muted)}>{testimonial.role}</span>
                    ) : null}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="relative mx-auto hidden max-h-[680px] max-w-6xl gap-6 overflow-hidden md:grid md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, column) => (
            <div key={column} className={cn('group', visibility[column])}>
              <div
                className="flex flex-col gap-6 [animation:accent-testimonials-scroll-y_var(--marquee-duration)_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
                style={{ '--marquee-duration': `${duration + column * 5}s` } as CSSProperties}
              >
                {[...group, ...group].map((testimonial, index) => (
                  <figure
                    key={`${testimonial.name}-${index}`}
                    aria-hidden={index >= group.length}
                    className={cn(
                      'border p-6 shadow-sm',
                      t.panel,
                      t.border,
                      isGlow ? 'rounded-2xl' : '',
                    )}
                  >
                    <blockquote className={cn('text-sm leading-relaxed', t.body)}>
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      <TestimonialAvatar
                        name={testimonial.name}
                        src={testimonial.avatar}
                        className={cn(
                          'h-10 w-10',
                          isGlow
                            ? 'rounded-full bg-[#121212] text-[#ffb0eb]'
                            : 'bg-slate-100 text-amber-600',
                        )}
                      />
                      <span>
                        <span className={cn('block text-sm font-semibold', t.strong)}>
                          {testimonial.name}
                        </span>
                        {testimonial.role ? (
                          <span className={cn('block text-xs', t.muted)}>{testimonial.role}</span>
                        ) : null}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent',
              fade,
            )}
            aria-hidden
          />
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent',
              fade,
            )}
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
