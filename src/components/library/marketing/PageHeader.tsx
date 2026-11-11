import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PageHeaderProps = {
  title: string
  description?: string
  eyebrow?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  align?: 'left' | 'center'
  size?: 'default' | 'compact'
  variant?: 'muted' | 'primary'
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  align = 'left',
  size = 'default',
  variant = 'muted',
  className,
}: PageHeaderProps) {
  const compact = size === 'compact'
  const primary = variant === 'primary'

  return (
    <header
      className={cn(
        primary
          ? 'bg-primary bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
          : 'border-b bg-muted/30',
        className,
      )}
    >
      <div
        className={cn(
          'container',
          compact ? 'py-8 md:py-10' : 'py-14 md:py-20',
          align === 'center' && 'text-center',
        )}
      >
        {breadcrumbs?.length ? (
          <nav
            aria-label="Navegação estrutural"
            className={cn(compact ? 'mb-3' : 'mb-6', align === 'center' && 'flex justify-center')}
          >
            <ol
              className={cn(
                'flex flex-wrap items-center gap-1',
                compact ? 'text-xs' : 'text-sm',
                primary ? 'text-primary-foreground/70' : 'text-muted-foreground',
              )}
            >
              {breadcrumbs.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                  {index > 0 ? (
                    <ChevronRight className={compact ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden="true" />
                  ) : null}
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        'hover:underline',
                        primary ? 'hover:text-primary-foreground' : 'hover:text-foreground',
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      aria-current="page"
                      className={cn(primary && 'font-medium text-primary-foreground')}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {eyebrow ? (
          <p
            className={cn(
              'font-semibold uppercase tracking-widest',
              compact ? 'mb-2 text-xs' : 'mb-3 text-sm',
              primary ? 'text-primary-foreground/80' : 'text-primary',
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            'font-bold tracking-tight',
            compact ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-5xl',
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              'max-w-2xl',
              compact ? 'mt-2 text-base' : 'mt-4 text-lg',
              primary ? 'text-primary-foreground/80' : 'text-muted-foreground',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </header>
  )
}
