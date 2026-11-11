import { cn } from '@/lib/utils'

export type TicketPricingCard = {
  id: string
  title: string
  subtitle?: string
  prices?: Array<{ label: string; value: string }>
  highlight?: string
  description?: string
  note?: string
  actions?: Array<{ label: string; href: string; variant?: 'primary' | 'outline' }>
  featured?: boolean
}

export type TicketPricingCardsProps = {
  title?: string
  description?: string
  cards: TicketPricingCard[]
  className?: string
}

export function TicketPricingCards({
  title,
  description,
  cards,
  className,
}: TicketPricingCardsProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        {title || description ? (
          <div className="mx-auto mb-12 max-w-2xl text-center">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
            ) : null}
          </div>
        ) : null}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li
              key={card.id}
              className={cn(
                'group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-2 hover:shadow-2xl',
                card.featured ? 'border-primary bg-primary text-primary-foreground' : 'bg-card',
              )}
            >
              <span
                className={cn(
                  'absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full',
                  card.featured ? 'bg-background' : 'border bg-background',
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  'absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full',
                  card.featured ? 'bg-background' : 'border bg-background',
                )}
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold uppercase leading-tight tracking-tight">
                {card.title}
              </h3>
              {card.subtitle ? (
                <p
                  className={cn(
                    'mt-2 text-xs font-bold uppercase tracking-widest',
                    card.featured ? 'text-primary-foreground/75' : 'text-primary',
                  )}
                >
                  {card.subtitle}
                </p>
              ) : null}

              <div className="my-6 border-t border-dashed border-current opacity-20" />

              {card.highlight ? (
                <p className="text-6xl font-bold tracking-tight transition group-hover:scale-105">
                  {card.highlight}
                </p>
              ) : null}
              {card.prices?.length ? (
                <dl className="grid gap-4">
                  {card.prices.map((price) => (
                    <div key={price.label}>
                      <dt
                        className={cn(
                          'text-xs font-semibold uppercase tracking-wider',
                          card.featured ? 'text-primary-foreground/75' : 'text-muted-foreground',
                        )}
                      >
                        {price.label}
                      </dt>
                      <dd className="mt-1 text-3xl font-bold">{price.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {card.description ? (
                <p
                  className={cn(
                    'mt-4 text-sm leading-6',
                    card.featured ? 'text-primary-foreground/85' : 'text-muted-foreground',
                  )}
                >
                  {card.description}
                </p>
              ) : null}
              {card.note ? <p className="mt-3 text-xs opacity-70">{card.note}</p> : null}

              {card.actions?.length ? (
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {card.actions.map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      className={cn(
                        'inline-flex flex-1 justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition',
                        action.variant === 'outline'
                          ? 'border border-current hover:opacity-75'
                          : card.featured
                            ? 'bg-background text-foreground hover:bg-background/90'
                            : 'bg-primary text-primary-foreground hover:bg-primary-hover',
                      )}
                    >
                      {action.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
