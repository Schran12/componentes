import { cn } from '@/lib/utils'

export type BadgeSectionHeaderProps = {
  badge: string
  title: string
  subtitle?: string
  tone?: 'light' | 'dark'
  align?: 'center' | 'left'
  titleAs?: 'h1' | 'h2' | 'h3'
  className?: string
}

/** Cabeçalho com selo em pílula, linhas de brilho âmbar e título em gradiente metálico. */
export function BadgeSectionHeader({
  badge,
  title,
  subtitle,
  tone = 'light',
  align = 'center',
  titleAs: Title = 'h2',
  className,
}: BadgeSectionHeaderProps) {
  const dark = tone === 'dark'
  const centered = align === 'center'

  return (
    <div
      className={cn(
        centered ? 'mx-auto max-w-[540px] text-center' : 'max-w-2xl text-left',
        className,
      )}
    >
      <div className={cn('flex', centered && 'justify-center')}>
        <span
          className={cn(
            'group relative rounded-full border px-6 py-1 text-xs backdrop-blur transition-all duration-300 md:text-sm',
            dark
              ? 'border-white/20 bg-white/10 text-slate-200'
              : 'border-slate-300/80 bg-white/70 text-slate-700',
          )}
        >
          <span
            className="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-amber-500 to-transparent transition-all duration-500 group-hover:w-3/4"
            aria-hidden
          />
          <span
            className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            aria-hidden
          />
          <span className="relative font-medium">{badge}</span>
        </span>
      </div>

      <Title
        className={cn(
          'mt-5 bg-clip-text text-3xl font-semibold uppercase tracking-wide text-transparent sm:text-4xl md:text-[2.75rem] md:leading-[1.15]',
          dark
            ? 'bg-gradient-to-r from-slate-400 via-white to-slate-400'
            : 'bg-gradient-to-r from-slate-500 via-slate-900 to-slate-500',
        )}
      >
        {title}
      </Title>

      {subtitle ? (
        <p
          className={cn(
            'mt-4 text-base leading-relaxed md:text-lg',
            dark ? 'text-slate-400' : 'text-slate-500',
            centered && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
