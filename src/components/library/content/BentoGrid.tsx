import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BentoGridItem = {
  title: string
  description?: string
  icon?: ReactNode
  media?: ReactNode
  action?: { label: string; href: string }
  size?: 'small' | 'wide' | 'tall' | 'large'
}

export interface BentoGridProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  title?: string
  description?: string
  items: readonly BentoGridItem[]
  variant?: 'cards' | 'subtle'
  emptyMessage?: string
}

export function BentoGrid({
  title,
  description,
  items,
  variant = 'cards',
  emptyMessage = 'Nenhum conteúdo disponível.',
  className,
  ...props
}: BentoGridProps) {
  return (
    <section className={cn('py-12 md:py-20', className)} {...props}>
      <div className="container">
        {title ? <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2> : null}
        {description ? <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p> : null}
        {items.length ? (
          <ul className="mt-8 grid auto-rows-[minmax(13rem,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <li
                key={item.title}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg',
                  variant === 'cards' ? 'bg-card' : 'bg-muted/40',
                  item.size === 'wide' && 'md:col-span-2',
                  item.size === 'tall' && 'md:row-span-2',
                  item.size === 'large' && 'md:col-span-2 md:row-span-2',
                )}
              >
                {item.media ? (
                  <div className="mb-6 overflow-hidden rounded-xl">{item.media}</div>
                ) : null}
                {item.icon ? (
                  <div className="mb-5 text-primary transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>
                ) : null}
                <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                ) : null}
                {item.action ? (
                  <a
                    href={item.action.href}
                    className="mt-5 inline-flex rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.action.label}
                    <span aria-hidden="true">&nbsp;→</span>
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </div>
    </section>
  )
}
