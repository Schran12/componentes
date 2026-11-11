import { Quote, Star } from 'lucide-react'

import { cn } from '@/lib/utils'

export type SpotlightTestimonial = {
  quote: string
  name: string
  role?: string
  company?: string
  avatar?: { src: string; alt: string }
  rating?: number
}

export type TestimonialsSpotlightProps = {
  eyebrow?: string
  title?: string
  featured: SpotlightTestimonial
  items?: SpotlightTestimonial[]
  className?: string
}

function Author({ item }: { item: SpotlightTestimonial }) {
  return (
    <div className="flex items-center gap-3">
      {item.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.avatar.src}
          alt={item.avatar.alt}
          className="size-11 rounded-full object-cover"
        />
      ) : (
        <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
          {item.name.charAt(0)}
        </span>
      )}
      <div>
        <p className="font-semibold">{item.name}</p>
        {(item.role || item.company) && (
          <p className="text-sm text-muted-foreground">
            {[item.role, item.company].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  )
}

export function TestimonialsSpotlight({
  eyebrow = 'Histórias de clientes',
  title = 'Confiança construída em cada entrega.',
  featured,
  items = [],
  className,
}: TestimonialsSpotlightProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <header className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h2>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <article className="relative overflow-hidden rounded-3xl bg-foreground p-7 text-background md:p-10">
            <Quote className="absolute right-6 top-6 size-20 opacity-10" aria-hidden="true" />
            <div className="mb-8 flex gap-1" aria-label={`${featured.rating ?? 5} de 5 estrelas`}>
              {Array.from({ length: featured.rating ?? 5 }, (_, index) => (
                <Star key={index} className="size-4 fill-current text-amber-400" />
              ))}
            </div>
            <blockquote className="max-w-3xl text-balance text-2xl font-medium leading-relaxed md:text-3xl">
              “{featured.quote}”
            </blockquote>
            <div className="mt-10 [&_*]:text-inherit">
              <Author item={featured} />
            </div>
          </article>

          <div className="grid gap-5">
            {items.slice(0, 2).map((item) => (
              <article
                key={`${item.name}-${item.quote}`}
                className="rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none"
              >
                <blockquote className="mb-6 leading-7 text-muted-foreground">
                  “{item.quote}”
                </blockquote>
                <Author item={item} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
