import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ProductGridProps = {
  title?: string
  products: Array<{
    id: string
    name: string
    description?: string
    image: { src: string; alt: string }
    href: string
    badge?: string
  }>
  className?: string
}

export function ProductGrid({ title, products, className }: ProductGridProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'products-title' : undefined}
    >
      <div className="container">
        {title ? (
          <h2 id="products-title" className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <Link
                href={product.href}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                  />
                  {product.badge ? (
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold">
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  {product.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  ) : null}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Conhecer <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
