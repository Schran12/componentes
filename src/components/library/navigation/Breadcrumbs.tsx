import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: ReactNode
}

export type BreadcrumbSeparator = 'chevron' | 'slash' | 'dot' | 'arrow'

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: readonly BreadcrumbItem[]
  label?: string
  variant?: 'default' | 'contained' | 'pills' | 'steps' | 'underline'
  separator?: BreadcrumbSeparator | ReactNode
  tone?: 'default' | 'inverted'
  size?: 'sm' | 'md'
  mobile?: 'truncate' | 'scroll' | 'back'
  showHomeIcon?: boolean
  collapseAfter?: number
  structuredData?: string
}

const separators: Record<BreadcrumbSeparator, ReactNode> = {
  chevron: <ChevronRight className="h-4 w-4" />,
  slash: <span className="px-0.5">/</span>,
  dot: <span className="block h-1 w-1 rounded-full bg-current" />,
  arrow: <ArrowRight className="h-3.5 w-3.5" />,
}

const stepShape = (first: boolean, last: boolean): CSSProperties => ({
  clipPath: `polygon(0 0, ${last ? '100%' : 'calc(100% - 10px)'} 0, 100% 50%, ${
    last ? '100%' : 'calc(100% - 10px)'
  } 100%, 0 100%, ${first ? '0' : '10px'} 50%)`,
})

function resolveSeparator(separator: BreadcrumbsProps['separator']) {
  if (separator === undefined) return separators.chevron
  if (typeof separator === 'string' && separator in separators) {
    return separators[separator as BreadcrumbSeparator]
  }
  return separator
}

function toAbsolute(siteUrl: string, href: string) {
  if (/^https?:\/\//.test(href)) return href
  return `${siteUrl.replace(/\/$/, '')}/${href.replace(/^\//, '')}`
}

export function Breadcrumbs({
  items,
  label = 'Navegação estrutural',
  variant = 'default',
  separator,
  tone = 'default',
  size = 'sm',
  mobile = 'truncate',
  showHomeIcon = false,
  collapseAfter,
  structuredData,
  className,
  ...props
}: BreadcrumbsProps) {
  const trailingItems = Math.max(1, collapseAfter ?? items.length)
  const shouldCollapse = collapseAfter !== undefined && items.length > trailingItems + 1
  const visibleItems = shouldCollapse
    ? [items[0], { label: '…' } satisfies BreadcrumbItem, ...items.slice(-trailingItems)]
    : items
  const parent = [...items.slice(0, -1)].reverse().find((item) => item.href)
  const inverted = tone === 'inverted'
  const showSeparator = variant !== 'steps'
  const separatorNode = resolveSeparator(separator)

  const jsonLd = structuredData
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          ...(item.href ? { item: toAbsolute(structuredData, item.href) } : {}),
        })),
      }
    : null

  const itemClass = (current: boolean, linked: boolean) => {
    switch (variant) {
      case 'pills':
        return cn(
          'rounded-full px-3 py-1',
          current
            ? 'bg-primary font-medium text-primary-foreground'
            : inverted
              ? 'bg-white/10'
              : 'bg-muted',
          linked && (inverted ? 'hover:bg-white/20' : 'hover:bg-primary/10 hover:text-primary'),
        )
      case 'steps':
        return cn(
          'px-5 py-1.5',
          current
            ? 'bg-primary font-medium text-primary-foreground'
            : inverted
              ? 'bg-white/10'
              : 'bg-muted',
          linked && (inverted ? 'hover:bg-white/20' : 'hover:bg-primary/10 hover:text-primary'),
        )
      case 'underline':
        return cn(
          'border-b-2 py-1',
          current
            ? cn('border-primary font-medium', inverted ? 'text-white' : 'text-foreground')
            : 'border-transparent',
          linked &&
            (inverted ? 'hover:text-white' : 'hover:border-primary/40 hover:text-foreground'),
        )
      default:
        return cn(
          current && cn('font-medium', inverted ? 'text-white' : 'text-foreground'),
          linked && (inverted ? 'hover:text-white' : 'hover:text-primary'),
        )
    }
  }

  return (
    <nav
      aria-label={label}
      className={cn(
        'min-w-0',
        variant === 'contained' &&
          cn(
            'inline-flex max-w-full rounded-full border px-4 py-2 shadow-sm',
            inverted ? 'border-white/20 bg-white/10 backdrop-blur' : 'bg-card',
          ),
        className,
      )}
      {...props}
    >
      {mobile === 'back' && parent ? (
        <a
          href={parent.href}
          className={cn(
            'inline-flex items-center gap-1.5 font-medium transition-colors sm:hidden',
            size === 'md' ? 'text-base' : 'text-sm',
            inverted
              ? 'text-white/80 hover:text-white'
              : 'text-muted-foreground hover:text-primary',
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {parent.label}
        </a>
      ) : null}
      <ol
        className={cn(
          'flex min-w-0 items-center',
          variant === 'steps' ? 'gap-0.5' : 'gap-1.5',
          size === 'md' ? 'text-base' : 'text-sm',
          inverted ? 'text-white/70' : 'text-muted-foreground',
          mobile === 'scroll' &&
            'overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          mobile === 'back' && parent && 'max-sm:hidden',
        )}
      >
        {visibleItems.map((item, index) => {
          const current = index === visibleItems.length - 1
          const linked = Boolean(item.href) && !current
          const icon =
            index === 0 && showHomeIcon ? (
              <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              item.icon
            )
          const content = (
            <>
              {icon}
              <span className={cn(mobile !== 'scroll' && 'truncate')}>{item.label}</span>
            </>
          )
          const segmentClass = cn(
            'flex min-w-0 items-center gap-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            itemClass(current, linked),
          )

          return (
            <li
              key={`${item.label}-${index}`}
              className={cn('flex min-w-0 items-center gap-1.5', mobile === 'scroll' && 'shrink-0')}
            >
              {index > 0 && showSeparator ? (
                <span
                  className={cn(
                    'shrink-0',
                    inverted ? 'text-white/40' : 'text-muted-foreground/60',
                  )}
                  aria-hidden="true"
                >
                  {separatorNode}
                </span>
              ) : null}
              {linked ? (
                <a
                  href={item.href}
                  className={segmentClass}
                  style={variant === 'steps' ? stepShape(index === 0, current) : undefined}
                >
                  {content}
                </a>
              ) : (
                <span
                  className={segmentClass}
                  aria-current={current ? 'page' : undefined}
                  style={variant === 'steps' ? stepShape(index === 0, current) : undefined}
                >
                  {content}
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      ) : null}
    </nav>
  )
}

type BreadcrumbPresetProps = Omit<
  BreadcrumbsProps,
  'variant' | 'separator' | 'tone' | 'size' | 'mobile' | 'showHomeIcon' | 'collapseAfter'
>

/** Default com chevron, ícone de início e colapso. */
export function BreadcrumbsChevron({
  collapseAfter = 2,
  ...props
}: BreadcrumbPresetProps & Pick<BreadcrumbsProps, 'collapseAfter'>) {
  return <Breadcrumbs showHomeIcon collapseAfter={collapseAfter} separator="chevron" {...props} />
}

/** Separador em barra. */
export function BreadcrumbsSlash(props: BreadcrumbPresetProps) {
  return <Breadcrumbs separator="slash" {...props} />
}

/** Contido em cápsula com separador em ponto. */
export function BreadcrumbsContained(props: BreadcrumbPresetProps) {
  return <Breadcrumbs variant="contained" separator="dot" showHomeIcon {...props} />
}

/** Itens em pílulas com seta. */
export function BreadcrumbsPills(props: BreadcrumbPresetProps) {
  return <Breadcrumbs variant="pills" separator="arrow" {...props} />
}

/** Estilo em degraus (wizard). */
export function BreadcrumbsSteps(props: BreadcrumbPresetProps) {
  return <Breadcrumbs variant="steps" showHomeIcon {...props} />
}

/** Item atual com sublinhado. */
export function BreadcrumbsUnderline(props: BreadcrumbPresetProps) {
  return <Breadcrumbs variant="underline" size="md" separator="slash" {...props} />
}

/** No mobile, mostra só “voltar à página anterior”. */
export function BreadcrumbsMobileBack(props: BreadcrumbPresetProps) {
  return <Breadcrumbs mobile="back" {...props} />
}

/** No mobile, rola na horizontal (útil com muitos níveis). */
export function BreadcrumbsMobileScroll(props: BreadcrumbPresetProps) {
  return <Breadcrumbs variant="pills" mobile="scroll" {...props} />
}

/** Para fundos escuros ou na cor da marca. */
export function BreadcrumbsInverted(props: BreadcrumbPresetProps) {
  return <Breadcrumbs tone="inverted" showHomeIcon {...props} />
}
