'use client'

import { useId } from 'react'
import { HelpCircle } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

export type FAQCenteredProps = {
  eyebrow?: string
  title: string
  description?: string
  items: Array<{
    question: string
    answer: React.ReactNode
  }>
  className?: string
}

export function FAQCentered({
  eyebrow = 'Central de ajuda',
  title,
  description,
  items,
  className,
}: FAQCenteredProps) {
  const titleId = useId()

  return (
    <section className={cn('py-16 md:py-24', className)} aria-labelledby={titleId}>
      <div className="container">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-sm">
            <HelpCircle className="size-3.5 text-primary" aria-hidden="true" />
            {eyebrow}
          </span>
          <h2 id={titleId} className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
              {description}
            </p>
          ) : null}
        </header>

        <Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-3">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-centered-${index}`}
              className="rounded-2xl border bg-card px-5 shadow-sm data-[state=open]:border-primary/30 data-[state=open]:shadow-md"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pr-8 leading-7 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
