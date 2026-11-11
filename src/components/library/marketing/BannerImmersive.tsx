import type { ReactNode } from 'react'
import Image from 'next/image'

import { HoverButton } from '@/components/library/primitives/HoverButton'
import { cn } from '@/lib/utils'

export type BannerImmersiveProps = {
  image: { src: string; alt: string }
  title: string
  eyebrow?: string
  symbol?: ReactNode
  description?: string
  actions?: readonly { label: string; href: string; variant?: 'primary' | 'light' | 'outline' }[]
  align?: 'left' | 'center'
  height?: 'screen' | 'large'
  overlay?: 'light' | 'medium' | 'strong'
  className?: string
}

const overlays = {
  light: 'bg-black/25',
  medium: 'bg-black/45',
  strong: 'bg-black/65',
}

/** Banner fotográfico de tela cheia — sem navbar; combine com um componente de Navbars. */
export function BannerImmersive({
  image,
  title,
  eyebrow,
  symbol,
  description,
  actions = [],
  align = 'center',
  height = 'large',
  overlay = 'medium',
  className,
}: BannerImmersiveProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-slate-950 text-white',
        height === 'screen' ? 'min-h-screen' : 'min-h-[680px]',
        className,
      )}
      aria-labelledby="banner-immersive-title"
    >
      <Image src={image.src} alt={image.alt} fill priority className="object-cover" sizes="100vw" />
      <div className={cn('absolute inset-0', overlays[overlay])} />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />

      <div
        className={cn(
          'container relative z-10 flex items-center py-20',
          height === 'screen' ? 'min-h-screen' : 'min-h-[680px]',
          align === 'center' ? 'justify-center text-center' : 'justify-start text-left',
        )}
      >
        <div className={cn('max-w-4xl', align === 'center' && 'flex flex-col items-center')}>
          {symbol ? <div className="mb-6 text-white">{symbol}</div> : null}
          {eyebrow ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/70">
              {eyebrow}
            </p>
          ) : null}
          <h1
            id="banner-immersive-title"
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl"
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              {description}
            </p>
          ) : null}
          {actions.length ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {actions.map((action) => (
                <HoverButton
                  key={`${action.label}-${action.href}`}
                  href={action.href}
                  effect={action.variant === 'outline' ? 'glow' : 'lift'}
                  variant={action.variant === 'primary' ? 'default' : 'secondary'}
                  size="lg"
                  className={cn(
                    'rounded-full',
                    action.variant === 'outline' &&
                      'border border-white/40 bg-transparent text-white hover:bg-white/10',
                  )}
                >
                  {action.label}
                </HoverButton>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
