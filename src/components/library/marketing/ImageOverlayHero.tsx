import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { AccentButton } from '@/components/library/primitives/AccentButton'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type ImageOverlayHeroProps = {
  title: string
  image: { src: string; alt: string }
  eyebrow?: string
  description?: string
  breadcrumbs?: readonly { label: string; href?: string }[]
  actions?: readonly { label: string; href: string }[]
  align?: 'center' | 'left'
  height?: 'md' | 'lg'
  tone?: AccentTone
  className?: string
}

const heights = {
  md: 'min-h-[52svh] md:min-h-[58svh]',
  lg: 'min-h-[70svh] md:min-h-[78svh]',
}

/** Hero de página interna com imagem de fundo, camadas de gradiente e breadcrumb opcional. */
export function ImageOverlayHero({
  title,
  image,
  eyebrow,
  description,
  breadcrumbs = [],
  actions = [],
  align = 'center',
  height = 'md',
  tone = 'glow',
  className,
}: ImageOverlayHeroProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'
  const centered = align === 'center'
  const line = <span className={cn('h-px w-8', t.line)} aria-hidden />

  return (
    <section
      className={cn(
        'relative flex items-center overflow-hidden',
        heights[height],
        isGlow ? 'bg-[#0e0e0e]' : 'bg-slate-950',
        className,
      )}
    >
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r',
          isGlow
            ? 'from-[#121212]/90 via-[#121212]/65 to-[#121212]/30'
            : 'from-slate-950/90 via-slate-950/60 to-slate-950/30',
        )}
        aria-hidden
      />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t via-transparent',
          isGlow ? 'from-[#121212]/70 to-[#121212]/25' : 'from-slate-950/70 to-slate-950/25',
        )}
        aria-hidden
      />

      <div className="container relative z-10 py-20 md:py-24">
        <div className={cn('max-w-3xl text-white', centered && 'mx-auto text-center')}>
          {breadcrumbs.length ? (
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol
                className={cn(
                  'flex flex-wrap items-center gap-2 text-sm',
                  isGlow ? 'text-[#c1c1c1]' : 'text-slate-300',
                  centered && 'justify-center',
                )}
              >
                {breadcrumbs.map((crumb, index) => (
                  <Fragment key={`${crumb.label}-${index}`}>
                    {index > 0 ? <li aria-hidden>/</li> : null}
                    <li>
                      {crumb.href ? (
                        <Link
                          href={crumb.href}
                          className={cn(
                            'transition-colors',
                            isGlow ? 'hover:text-[#ffb0eb]' : 'hover:text-amber-500',
                          )}
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="text-white" aria-current="page">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  </Fragment>
                ))}
              </ol>
            </nav>
          ) : null}

          {eyebrow ? (
            <div className={cn('mb-5 flex items-center gap-3', centered && 'justify-center')}>
              {line}
              <span
                className={cn(
                  'text-[0.65rem] font-medium uppercase tracking-[0.28em]',
                  isGlow ? 'text-[#ffb0eb]' : 'text-amber-500',
                )}
              >
                {eyebrow}
              </span>
              {centered ? line : null}
            </div>
          ) : null}

          <h1
            className={cn(
              'text-3xl font-semibold leading-[1.12] sm:text-4xl md:text-5xl lg:text-[3.25rem]',
              isGlow ? cn(t.heading, centered && 'mx-auto') : 'uppercase tracking-wide text-white',
            )}
          >
            {title}
          </h1>

          {description ? (
            <p
              className={cn(
                'mt-5 max-w-2xl text-base leading-relaxed md:text-lg',
                isGlow ? 'text-[#c1c1c1]' : 'text-slate-300',
                centered && 'mx-auto',
              )}
            >
              {description}
            </p>
          ) : null}

          {actions.length ? (
            <div className={cn('mt-8 flex flex-wrap gap-3', centered && 'justify-center')}>
              {actions.map((action) => (
                <AccentButton
                  key={action.href + action.label}
                  href={action.href}
                  tone={isGlow ? 'glow' : 'industrial-dark'}
                >
                  {action.label}
                </AccentButton>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
