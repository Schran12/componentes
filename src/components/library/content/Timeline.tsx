import { cn } from '@/lib/utils'

export type TimelineProps = {
  title?: string
  items: Array<{ date: string; title: string; description?: string }>
  className?: string
}

export function Timeline({ title, items, className }: TimelineProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'timeline-title' : undefined}
    >
      <div className="container max-w-4xl">
        {title ? (
          <h2 id="timeline-title" className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}
        <ol className="relative border-l border-border">
          {items.map((item, index) => (
            <li key={`${item.date}-${item.title}`} className="relative ml-7 pb-10 last:pb-0">
              <span
                className="absolute -left-[2.15rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-4 border-background bg-primary"
                aria-hidden="true"
              />
              <time className="text-sm font-semibold text-primary">{item.date}</time>
              <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
              {item.description ? (
                <p className="mt-2 leading-7 text-muted-foreground">{item.description}</p>
              ) : null}
              <span className="sr-only">
                Etapa {index + 1} de {items.length}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
