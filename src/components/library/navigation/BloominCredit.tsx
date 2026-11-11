import { cn } from '@/lib/utils'

/** Logo oficial Bloomin (PNG embutido para funcionar no catálogo e nos projetos instalados). */
const BLOOMIN_LOGO_SRC =
  'data:image/png;base64,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'

export const BLOOMIN_URL = 'https://bloomin.com.br'

export type BloominLogoProps = {
  className?: string
  /** Altura visual do logo (largura acompanha a proporção). */
  height?: number
}

export function BloominLogo({ className, height = 18 }: BloominLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- data URI portátil no registry
    <img
      src={BLOOMIN_LOGO_SRC}
      alt="Bloomin"
      width={Math.round(height * (421 / 108))}
      height={height}
      className={cn('h-[1.125rem] w-auto', className)}
      style={{ height, width: 'auto' }}
    />
  )
}

export type BloominCreditProps = {
  label?: string
  href?: string
  className?: string
  /** Fundo escuro atrás do logo (o PNG oficial tem fundo preto). */
  logoClassName?: string
}

/** Crédito padrão “Desenvolvido por” com o logo da Bloomin. */
export function BloominCredit({
  label = 'Desenvolvido por',
  href = BLOOMIN_URL,
  className,
  logoClassName,
}: BloominCreditProps) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm', className)}>
      <span className="opacity-80">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bloomin — agência de marketing digital"
        className={cn(
          'inline-flex items-center rounded-md bg-neutral-950 px-2 py-1 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          logoClassName,
        )}
      >
        <BloominLogo height={16} />
      </a>
    </span>
  )
}
