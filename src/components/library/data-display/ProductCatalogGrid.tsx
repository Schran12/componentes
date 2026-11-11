import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import {
  getAccentTone,
  padIndex,
  type AccentTone,
} from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type ProductCatalogItem = {
  id: string
  title: string
  category: string
  description: string
  href: string
  image: { src: string; alt: string }
  features?: readonly string[]
}

export type ProductCatalogGridProps = {
  products: readonly ProductCatalogItem[]
  title?: string
  eyebrow?: string
  description?: string
  actionLabel?: string
  maxFeatures?: number
  tone?: AccentTone
  className?: string
}

const gridLines: Record<AccentTone, string> = {
  glow: 'border-[#493849] bg-[#493849]',
  industrial: 'border-slate-200 bg-slate-200',
  'industrial-dark': 'border-white/10 bg-white/10',
}

/** Catálogo em grade unida por linhas com imagem, recursos e chamada para cada produto. */
export function ProductCatalogGrid({
  products,
  title,
  eyebrow,
  description,
  actionLabel = 'Ver solução',
  maxFeatures = 3,
  tone = 'glow',
  className,
}: ProductCatalogGridProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'

  return (
    <section className={cn(t.section, className)}>
      <div className="container py-14 lg:py-16">
        {title ? (
          <EyebrowHeading
            tone={tone}
            eyebrow={eyebrow}
            title={title}
            description={description}
            layout="split"
            className="mb-10 lg:mb-12"
          />
        ) : null}

        <div
          className={cn(
            'grid grid-cols-1 gap-px border md:grid-cols-2 lg:grid-cols-3',
            gridLines[tone],
          )}
        >
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={product.href}
              className={cn(
                'group flex h-full flex-col transition-colors duration-500',
                t.panel,
                isGlow
                  ? 'hover:bg-[#121212]'
                  : tone === 'industrial'
                    ? 'hover:bg-slate-50'
                    : 'hover:bg-slate-950',
                t.focus,
              )}
            >
              <div className="relative h-52 overflow-hidden sm:h-56">
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-t to-transparent',
                    isGlow
                      ? 'from-[#121212]/70 via-[#121212]/10'
                      : 'from-slate-950/70 via-slate-950/10',
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    'absolute left-5 top-5 text-[0.65rem] tracking-[0.22em]',
                    isGlow ? 'text-[#ffb0eb]' : 'text-amber-400',
                  )}
                >
                  {padIndex(index)} — {product.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3
                  className={cn(
                    'text-xl font-semibold tracking-wide',
                    !isGlow && 'uppercase',
                    t.strong,
                  )}
                >
                  {product.title}
                </h3>
                <p className={cn('mt-3 text-sm leading-relaxed', t.body)}>{product.description}</p>

                {product.features?.length ? (
                  <ul className="mt-5 space-y-2">
                    {product.features.slice(0, maxFeatures).map((feature) => (
                      <li key={feature} className={cn('flex items-center gap-2.5 text-sm', t.body)}>
                        <span className={cn('h-1.5 w-1.5 shrink-0', t.line)} aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-auto flex items-center justify-between pt-6">
                  <span
                    className={cn(
                      'text-sm font-semibold tracking-wide transition-colors duration-500',
                      t.strong,
                      isGlow ? 'group-hover:text-[#ffb0eb]' : 'group-hover:text-amber-600',
                    )}
                  >
                    {actionLabel}
                  </span>
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center border transition-all duration-500',
                      t.border,
                      t.strong,
                      isGlow
                        ? 'group-hover:border-[#c642a5] group-hover:bg-[#c642a5]'
                        : 'group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950',
                    )}
                    aria-hidden
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
