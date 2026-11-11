'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

export type FAQAccordionProps = {
  title?: string
  description?: string
  items: Array<{ question: string; answer: React.ReactNode }>
  allowMultiple?: boolean
  className?: string
}

export function FAQAccordion({
  title,
  description,
  items,
  allowMultiple = false,
  className,
}: FAQAccordionProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'faq-title' : undefined}
    >
      <div className="container grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          {title ? (
            <h2 id="faq-title" className="text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
          ) : null}
          {description ? <p className="mt-4 text-muted-foreground">{description}</p> : null}
        </div>
        {allowMultiple ? (
          <Accordion type="multiple" className="w-full">
            {items.map((item, index) => (
              <AccordionItem value={`faq-${index}`} key={item.question}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="leading-6">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem value={`faq-${index}`} key={item.question}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="leading-6">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  )
}
