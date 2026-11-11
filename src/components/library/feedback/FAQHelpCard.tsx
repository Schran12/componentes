'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { MessagesSquare, Plus } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type FAQHelpCardProps = {
  title: string
  items: ReadonlyArray<{ question: string; answer: string }>
  eyebrow?: string
  description?: string
  help?: {
    title: string
    description?: string
    icon?: ReactNode
    action?: { label: string; href: string }
  }
  /** Índice aberto inicialmente; use `null` para começar tudo fechado. */
  defaultOpen?: number | null
  className?: string
}

/** FAQ em duas colunas: título e card de ajuda à esquerda, acordeão com ícones +/× à direita. */
export function FAQHelpCard({
  title,
  items,
  eyebrow,
  description,
  help,
  defaultOpen = 0,
  className,
}: FAQHelpCardProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
          {description ? (
            <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
          ) : null}

          {help ? (
            <div className="mt-8 rounded-2xl border bg-muted/50 p-6">
              <span className="text-primary" aria-hidden="true">
                {help.icon ?? <MessagesSquare className="h-7 w-7" />}
              </span>
              <h3 className="mt-4 text-lg font-bold">{help.title}</h3>
              {help.description ? (
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{help.description}</p>
              ) : null}
              {help.action ? (
                <Link
                  href={help.action.href}
                  className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {help.action.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>

        <AccordionPrimitive.Root
          type="single"
          collapsible
          defaultValue={defaultOpen === null ? undefined : `item-${defaultOpen}`}
          className="grid content-start gap-3"
        >
          {items.map((item, index) => (
            <AccordionPrimitive.Item
              key={item.question}
              value={`item-${index}`}
              className="rounded-2xl border bg-card transition data-[state=open]:shadow-md"
            >
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-5 text-left font-semibold transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:text-primary">
                  {item.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-primary transition group-data-[state=open]:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                    <Plus
                      className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-45"
                      aria-hidden="true"
                    />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <p className="px-5 pb-5 leading-7 text-muted-foreground">{item.answer}</p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  )
}
