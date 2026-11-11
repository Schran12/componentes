import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type FeatureImageListItem = {
  icon: ReactNode
  title: string
  description: string
}

export type FeatureImageListProps = {
  title: string
  image: { src: string; alt: string }
  items: readonly FeatureImageListItem[]
  description?: string
  action?: { label: string; href: string }
  className?: string
}

/** Três colunas: título com ação, imagem central e lista de diferenciais com ícones. */
export function FeatureImageList({
  title,
  image,
  items,
  description,
  action,
  className,
}: FeatureImageListProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.15fr] lg:gap-12">
        <div>
          <h2 className="text-3xl font-light uppercase leading-tight tracking-tight md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
          ) : null}
          {action ? (
            <Link
              href={action.href}
              className="mt-8 inline-flex h-12 items-center rounded-md border border-foreground/30 px-8 text-sm font-medium transition hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {action.label}
            </Link>
          ) : null}
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <ul className="grid content-start gap-7 md:col-span-2 md:grid-cols-2 lg:col-span-1 lg:grid-cols-1">
          {items.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:h-6 [&_svg]:w-6"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
