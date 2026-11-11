import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type FloatingSocialNetwork =
  'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'x'

export type FloatingSocialButtonProps = {
  /** Perfil ou página da rede (URL completa). */
  href: string
  network?: FloatingSocialNetwork
  label?: string
  /** Índice na pilha vertical (0 = canto inferior, sobe a cada nível). */
  stackIndex?: number
  /** Use `static` em previews/catálogo. */
  position?: 'fixed' | 'static'
  className?: string
  icon?: ReactNode
}

const stackBottoms = [
  'bottom-6',
  'bottom-20',
  'bottom-36',
  'bottom-52',
  'bottom-[17.5rem]',
  'bottom-[21rem]',
] as const

const networks: Record<
  FloatingSocialNetwork,
  { label: string; className: string; icon: ReactNode }
> = {
  instagram: {
    label: 'Seguir no Instagram',
    className: 'bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>
    ),
  },
  facebook: {
    label: 'Seguir no Facebook',
    className: 'bg-[#1877F2]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M14 13.5h2.5l.5-3H14v-2c0-.9.3-1.5 1.5-1.5H17V4.1c-.3 0-1.2-.1-2.3-.1C12.1 4 10.5 5.5 10.5 8.3V10.5H8v3h2.5V20h3.5v-6.5z" />
      </svg>
    ),
  },
  linkedin: {
    label: 'Seguir no LinkedIn',
    className: 'bg-[#0A66C2]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM3.5 8.5h3V20h-3V8.5zm5.5 0h2.87v1.57h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6V20h-3v-5.1c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V20h-3V8.5z" />
      </svg>
    ),
  },
  youtube: {
    label: 'Seguir no YouTube',
    className: 'bg-[#FF0000]',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
      </svg>
    ),
  },
  tiktok: {
    label: 'Seguir no TikTok',
    className: 'bg-black',
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M16.6 5.82A4.5 4.5 0 0 1 14.1 4V16a4 4 0 1 1-4-4c.2 0 .4 0 .6.05v2.1A2 2 0 1 0 12.1 16V2h2.1a4.5 4.5 0 0 0 4.4 4.1v2.1a6.5 6.5 0 0 1-2-.38z" />
      </svg>
    ),
  },
  x: {
    label: 'Seguir no X',
    className: 'bg-black',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
}

/** Botão flutuante de rede social, no mesmo padrão do WhatsApp. */
export function FloatingSocialButton({
  href,
  network = 'instagram',
  label,
  stackIndex = 0,
  position = 'fixed',
  className,
  icon,
}: FloatingSocialButtonProps) {
  const preset = networks[network]
  const bottom =
    position === 'fixed'
      ? stackBottoms[Math.min(Math.max(stackIndex, 0), stackBottoms.length - 1)]
      : undefined

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ?? preset.label}
      title={label ?? preset.label}
      className={cn(
        'z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        position === 'fixed' ? cn('fixed right-6', bottom) : 'relative',
        preset.className,
        className,
      )}
    >
      {icon ?? preset.icon}
    </a>
  )
}

type NetworkShortcutProps = Omit<FloatingSocialButtonProps, 'network'>

export function FloatingInstagramButton(props: NetworkShortcutProps) {
  return <FloatingSocialButton network="instagram" {...props} />
}

export function FloatingFacebookButton(props: NetworkShortcutProps) {
  return <FloatingSocialButton network="facebook" {...props} />
}

export function FloatingLinkedInButton(props: NetworkShortcutProps) {
  return <FloatingSocialButton network="linkedin" {...props} />
}

export function FloatingYouTubeButton(props: NetworkShortcutProps) {
  return <FloatingSocialButton network="youtube" {...props} />
}

export function FloatingTikTokButton(props: NetworkShortcutProps) {
  return <FloatingSocialButton network="tiktok" {...props} />
}

export function FloatingXButton(props: NetworkShortcutProps) {
  return <FloatingSocialButton network="x" {...props} />
}

export type FloatingSocialStackItem = {
  network: FloatingSocialNetwork
  href: string
  label?: string
}

export type FloatingSocialStackProps = {
  items: readonly FloatingSocialStackItem[]
  /** Empilha acima do `ScrollToTopButton` (sobe o primeiro botão). */
  aboveScrollTop?: boolean
  position?: 'fixed' | 'static'
  className?: string
}

/** Pilha vertical de botões flutuantes de redes sociais. */
export function FloatingSocialStack({
  items,
  aboveScrollTop = false,
  position = 'fixed',
  className,
}: FloatingSocialStackProps) {
  const offset = aboveScrollTop ? 1 : 0

  if (position === 'static') {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>
        {items.map((item) => (
          <FloatingSocialButton
            key={`${item.network}-${item.href}`}
            network={item.network}
            href={item.href}
            label={item.label}
            position="static"
          />
        ))}
      </div>
    )
  }

  return (
    <>
      {items.map((item, index) => (
        <FloatingSocialButton
          key={`${item.network}-${item.href}`}
          network={item.network}
          href={item.href}
          label={item.label}
          stackIndex={index + offset}
          className={className}
        />
      ))}
    </>
  )
}
