import type { ReactNode } from 'react'
import Image from 'next/image'
import { PlayCircle } from 'lucide-react'

import { HoverButton } from '@/components/library/primitives/HoverButton'
import { cn } from '@/lib/utils'

export type BannerEditorialProps = {
  eyebrow?: string
  title: ReactNode
  description?: string
  images: readonly { src: string; alt: string }[]
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string; icon?: ReactNode }
  mediaVariant?: 'device' | 'stack' | 'poster'
  tone?: 'light' | 'dark' | 'warm'
  className?: string
}

const tones = {
  light: 'bg-white text-slate-950',
  dark: 'bg-black text-white',
  warm: 'bg-[#f2eee7] text-slate-950',
}

export function BannerEditorial({
  eyebrow,
  title,
  description,
  images,
  primaryAction,
  secondaryAction,
  mediaVariant = 'device',
  tone = 'light',
  className,
}: BannerEditorialProps) {
  const firstImage = images[0]
  const secondImage = images[1]

  return (
    <section
      className={cn('relative overflow-hidden', tones[tone], className)}
      aria-labelledby="banner-editorial-title"
    >
      <div className="container grid min-h-[720px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
        <div className="relative z-10 max-w-3xl">
          {eyebrow ? (
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1
            id="banner-editorial-title"
            className="text-5xl font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl"
          >
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                'mt-8 max-w-xl text-base leading-8',
                tone === 'dark' ? 'text-white/65' : 'text-slate-600',
              )}
            >
              {description}
            </p>
          ) : null}

          {primaryAction || secondaryAction ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {primaryAction ? (
                <HoverButton
                  href={primaryAction.href}
                  effect="expand-icon"
                  size="lg"
                  className="rounded-none px-7"
                >
                  {primaryAction.label}
                </HoverButton>
              ) : null}
              {secondaryAction ? (
                <HoverButton
                  href={secondaryAction.href}
                  effect="lift"
                  variant="outline"
                  size="lg"
                  icon={secondaryAction.icon ?? <PlayCircle className="h-4 w-4" aria-hidden />}
                  iconPosition="left"
                  className={cn(
                    'rounded-none px-7',
                    tone === 'dark' &&
                      'border-white/30 bg-transparent text-white hover:bg-white/10',
                  )}
                >
                  {secondaryAction.label}
                </HoverButton>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto h-[560px] w-full max-w-lg">
          {firstImage ? (
            <figure
              className={cn(
                'absolute overflow-hidden bg-muted shadow-2xl',
                mediaVariant === 'device' &&
                  'inset-y-0 right-6 w-[68%] rounded-[3rem] border-[10px] border-slate-900',
                mediaVariant === 'stack' &&
                  'left-0 top-10 h-[78%] w-[72%] rotate-[-5deg] rounded-3xl',
                mediaVariant === 'poster' && 'inset-0 rounded-none',
              )}
            >
              <Image
                src={firstImage.src}
                alt={firstImage.alt}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 85vw"
              />
            </figure>
          ) : null}

          {secondImage ? (
            <figure
              className={cn(
                'absolute overflow-hidden bg-muted shadow-2xl',
                mediaVariant === 'device' &&
                  'bottom-6 right-0 h-[58%] w-[58%] rounded-3xl border-8 border-background',
                mediaVariant === 'stack' &&
                  'bottom-4 right-0 h-[68%] w-[68%] rotate-6 rounded-3xl border-8 border-background',
                mediaVariant === 'poster' &&
                  'bottom-8 right-[-8%] h-[42%] w-[62%] border-8 border-background',
              )}
            >
              <Image
                src={secondImage.src}
                alt={secondImage.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 28vw, 60vw"
              />
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  )
}
