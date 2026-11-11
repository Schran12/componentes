import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ResponsibilityFeatureSectionProps = {
  eyebrow?: string
  title: string
  description: string
  image: { src: string; alt: string }
  pillars?: readonly string[]
  action?: { label: string; href: string }
  mediaPosition?: 'left' | 'right'
  tone?: 'forest' | 'sand'
  className?: string
}

export function ResponsibilityFeatureSection({
  eyebrow,
  title,
  description,
  image,
  pillars = [],
  action,
  mediaPosition = 'left',
  tone = 'forest',
  className,
}: ResponsibilityFeatureSectionProps) {
  const dark = tone === 'forest'

  return (
    <section
      className={cn(
        'overflow-hidden',
        dark ? 'bg-[#263b2d] text-white' : 'bg-[#e8e1d4] text-[#17211b]',
        className,
      )}
    >
      <div className="grid min-h-[680px] lg:grid-cols-2">
        <figure
          className={cn(
            'relative min-h-[440px] overflow-hidden lg:min-h-full',
            mediaPosition === 'right' && 'lg:order-2',
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07120c]/30 to-transparent" />
        </figure>

        <div
          className={cn(
            'flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24',
            mediaPosition === 'right' && 'lg:order-1',
          )}
        >
          <div className="max-w-2xl">
            {eyebrow ? (
              <p
                className={cn(
                  'text-xs font-bold uppercase tracking-[0.24em]',
                  dark ? 'text-[#c9e4ce]' : 'text-[#4d6655]',
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.035em] md:text-6xl">
              {title}
            </h2>
            <p className={cn('mt-7 text-lg leading-8', dark ? 'text-white/65' : 'text-[#49564e]')}>
              {description}
            </p>

            {pillars.length ? (
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {pillars.map((pillar) => (
                  <li key={pillar} className="flex items-center gap-3 text-sm font-semibold">
                    <span
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full',
                        dark ? 'bg-white/10 text-[#c9e4ce]' : 'bg-[#4d6655]/10 text-[#4d6655]',
                      )}
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    {pillar}
                  </li>
                ))}
              </ul>
            ) : null}

            {action ? (
              <Link
                href={action.href}
                className={cn(
                  'mt-9 inline-flex items-center gap-3 border-b pb-2 text-sm font-semibold transition hover:gap-5 focus-visible:outline-none focus-visible:ring-2',
                  dark
                    ? 'border-white focus-visible:ring-white'
                    : 'border-[#17211b] focus-visible:ring-[#4d6655]',
                )}
              >
                {action.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
