import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ContactCardProps = {
  title: string
  value: string
  href?: string
  description?: string
  icon?: LucideIcon
  className?: string
}

export function ContactCard({
  title,
  value,
  href,
  description,
  icon: Icon,
  className,
}: ContactCardProps) {
  const content = (
    <>
      {Icon ? (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block text-sm font-medium text-muted-foreground">{title}</span>
        <span className="mt-1 block font-semibold [overflow-wrap:anywhere]">{value}</span>
        {description ? (
          <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </>
  )

  return href ? (
    <a
      href={href}
      className={cn(
        'flex min-w-0 gap-4 rounded-2xl border bg-card p-5 transition hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      {content}
    </a>
  ) : (
    <div className={cn('flex min-w-0 gap-4 rounded-2xl border bg-card p-5', className)}>
      {content}
    </div>
  )
}
