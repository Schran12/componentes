'use client'

import { useId, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type FAQSearchItem = {
  question: string
  answer: React.ReactNode
  searchText?: string
  category?: string
}

export type FAQSearchProps = {
  title: string
  description?: string
  items: FAQSearchItem[]
  placeholder?: string
  emptyMessage?: string
  className?: string
}

export function FAQSearch({
  title,
  description,
  items,
  placeholder = 'Busque por uma dúvida...',
  emptyMessage = 'Nenhuma resposta encontrada. Tente buscar por outros termos.',
  className,
}: FAQSearchProps) {
  const titleId = useId()
  const searchId = useId()
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return items

    return items.filter((item) =>
      [item.question, item.searchText, item.category]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    )
  }, [items, query])

  return (
    <section className={cn('bg-muted/40 py-16 md:py-24', className)} aria-labelledby={titleId}>
      <div className="container max-w-4xl">
        <header className="mb-8">
          <h2 id={titleId} className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
          ) : null}
        </header>

        <div className="relative mb-8">
          <label htmlFor={searchId} className="sr-only">
            Pesquisar nas perguntas frequentes
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="h-14 rounded-2xl bg-background pl-12 pr-12 text-base shadow-sm"
          />
          {query ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
              aria-label="Limpar pesquisa"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        <p className="sr-only" aria-live="polite">
          {filteredItems.length} perguntas encontradas
        </p>

        {filteredItems.length ? (
          <Accordion type="single" collapsible className="rounded-2xl border bg-background px-5">
            {filteredItems.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-search-${index}`}>
                <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                  <span>
                    {item.category ? (
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-primary">
                        {item.category}
                      </span>
                    ) : null}
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="max-w-3xl pb-5 leading-7 text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="rounded-2xl border border-dashed bg-background px-6 py-12 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  )
}
