import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type PricingCardsProps = {
  title?: string
  plans: Array<{
    name: string
    price: string
    period?: string
    description?: string
    features: string[]
    action: { label: string; href: string }
    highlighted?: boolean
  }>
  className?: string
}

export function PricingCards({ title, plans, className }: PricingCardsProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'pricing-title' : undefined}
    >
      <div className="container">
        {title ? (
          <h2
            id="pricing-title"
            className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl"
          >
            {title}
          </h2>
        ) : null}
        <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                'flex flex-col rounded-2xl border bg-card p-7 shadow-sm',
                plan.highlighted && 'border-primary ring-2 ring-primary/20',
              )}
            >
              {plan.highlighted ? (
                <span className="mb-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Mais escolhido
                </span>
              ) : null}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              {plan.description ? (
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              ) : null}
              <p className="mt-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period ? <span className="text-muted-foreground">/{plan.period}</span> : null}
              </p>
              <ul className="my-7 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <Check className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild variant={plan.highlighted ? 'default' : 'outline'}>
                <Link href={plan.action.href}>{plan.action.label}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
