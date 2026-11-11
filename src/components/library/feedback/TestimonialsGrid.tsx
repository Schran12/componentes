import Image from 'next/image'
import { Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Testimonial = {
  quote: string
  name: string
  role?: string
  company?: string
  avatar?: string
}
export type TestimonialsGridProps = {
  title?: string
  testimonials: Testimonial[]
  className?: string
}

export function TestimonialsGrid({ title, testimonials, className }: TestimonialsGridProps) {
  return (
    <section
      className={cn('bg-muted/30 py-16 md:py-24', className)}
      aria-labelledby={title ? 'testimonials-title' : undefined}
    >
      <div className="container">
        {title ? (
          <h2
            id="testimonials-title"
            className="mb-10 text-3xl font-bold tracking-tight md:text-4xl"
          >
            {title}
          </h2>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure
              key={`${testimonial.name}-${index}`}
              className="flex flex-col rounded-2xl border bg-background p-6 shadow-sm"
            >
              <Quote className="h-7 w-7 text-primary" aria-hidden="true" />
              <blockquote className="mt-5 flex-1 text-lg leading-8">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                {testimonial.avatar ? (
                  <Image
                    src={testimonial.avatar}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : null}
                <span>
                  <span className="block font-semibold">{testimonial.name}</span>
                  <span className="block text-sm text-muted-foreground">
                    {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
