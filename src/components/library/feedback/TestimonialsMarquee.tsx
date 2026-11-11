import { Marquee } from '@/components/library/motion/Marquee'
import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

import { TestimonialAvatar, type AccentTestimonial } from './TestimonialAvatar'

export type TestimonialsMarqueeProps = {
  title: string
  testimonials: readonly AccentTestimonial[]
  eyebrow?: string
  description?: string
  speed?: number
  tone?: AccentTone
  className?: string
}

/** Depoimentos em faixa horizontal contínua que pausa no hover. */
export function TestimonialsMarquee({
  title,
  testimonials,
  eyebrow,
  description,
  speed = 45,
  tone = 'glow',
  className,
}: TestimonialsMarqueeProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'

  return (
    <section
      className={cn(
        'w-full overflow-hidden py-12 lg:py-16',
        isGlow ? 'bg-[#0e0e0e] text-[#c1c1c1]' : t.section,
        className,
      )}
    >
      <div className="container">
        <EyebrowHeading
          tone={tone}
          eyebrow={eyebrow}
          title={title}
          description={description}
          className="mb-8"
        />
      </div>

      <Marquee speed={speed} gap={32} ariaLabel={title}>
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name + testimonial.content}
            className={cn(
              'flex w-[300px] shrink-0 flex-col justify-between gap-6 p-6',
              t.panel,
              isGlow ? 'rounded-md' : cn('border', t.border),
            )}
          >
            <blockquote className={cn('m-0', t.body)}>
              <p>&ldquo;{testimonial.content}&rdquo;</p>
            </blockquote>
            <figcaption className="flex items-center gap-4">
              <span
                className={cn(
                  'p-2',
                  isGlow
                    ? '-rotate-[25deg] rounded-xl bg-[#121212] text-[#ffb0eb]'
                    : 'bg-slate-100 text-amber-600',
                  tone === 'industrial-dark' && 'bg-slate-950 text-amber-500',
                )}
              >
                <TestimonialAvatar
                  name={testimonial.name}
                  src={testimonial.avatar}
                  className={isGlow ? 'rounded-md' : ''}
                />
              </span>
              <span>
                <span className={cn('block font-semibold', t.strong)}>{testimonial.name}</span>
                {testimonial.role ? (
                  <span className={cn('block text-sm', t.muted)}>{testimonial.role}</span>
                ) : null}
              </span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  )
}
