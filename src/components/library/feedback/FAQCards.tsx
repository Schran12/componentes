import { HelpCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

export type FAQCardsProps = {
  title?: string
  description?: string
  items: Array<{
    question: string
    answer: React.ReactNode
  }>
  columns?: 2 | 3
  className?: string
}

export function FAQCards({ title, description, items, columns = 3, className }: FAQCardsProps) {
  return (
    <section className={cn('py-16 md:py-24', className)} aria-labelledby="faq-cards-title">
      <div className="container">
        {(title || description) && (
          <header className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
            {title ? (
              <h2 id="faq-cards-title" className="text-3xl font-bold tracking-tight md:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-balance text-muted-foreground">{description}</p>
            ) : null}
          </header>
        )}

        <div className={cn('grid gap-4 md:grid-cols-2', columns === 3 && 'xl:grid-cols-3')}>
          {items.map((item) => (
            <article
              key={item.question}
              className="group rounded-2xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg motion-reduce:transform-none"
            >
              <span className="mb-5 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <HelpCircle className="size-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold leading-snug">{item.question}</h3>
              <div className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
