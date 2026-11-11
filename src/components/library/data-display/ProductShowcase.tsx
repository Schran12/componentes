import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ProductShowcaseProps = {
  name: string
  description: string
  image: { src: string; alt: string }
  features?: string[]
  action?: { label: string; href: string }
  eyebrow?: string
  className?: string
}

export function ProductShowcase({
  name,
  description,
  image,
  features,
  action,
  eyebrow,
  className,
}: ProductShowcaseProps) {
  return (
    <section className={cn('py-16 md:py-24', className)} aria-labelledby="showcase-title">
      <div className="container grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </div>
        <div>
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 id="showcase-title" className="text-3xl font-bold tracking-tight md:text-5xl">
            {name}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{description}</p>
          {features?.length ? (
            <ul className="mt-7 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {action ? (
            <Button asChild size="lg" className="mt-8">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
