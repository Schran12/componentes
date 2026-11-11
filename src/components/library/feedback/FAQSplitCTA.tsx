import { ArrowRight } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

export type FAQSplitCTAProps = {
  title: string
  items: Array<{ question: string; answer: string }>
  description?: string
  eyebrow?: string
  action?: { label: string; href: string }
  className?: string
}

export function FAQSplitCTA({
  title,
  items,
  description,
  eyebrow,
  action,
  className,
}: FAQSplitCTAProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          {eyebrow ? (
            <p className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
              {'// '}
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
          {action ? (
            <a
              href={action.href}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              {action.label}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          ) : null}
        </div>

        <Accordion type="single" collapsible className="grid gap-3">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`item-${index}`}
              className="rounded-2xl border bg-card px-5 transition data-[state=open]:border-primary data-[state=open]:shadow-lg"
            >
              <AccordionTrigger className="gap-4 text-left text-base font-semibold hover:no-underline data-[state=open]:text-primary">
                <span className="flex items-center gap-4">
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-9 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
