import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type RelatedProductItem = {
  id: string
  title: string
  category: string
  href: string
  image?: { src: string; alt: string }
}

export type RelatedProductsProps = {
  products: readonly RelatedProductItem[]
  title?: string
  eyebrow?: string
  variant?: 'cards' | 'list'
  tone?: AccentTone
  className?: string
}

const gridLines: Record<AccentTone, string> = {
  glow: 'border-[#493849] bg-[#493849]',
  industrial: 'border-slate-200 bg-slate-200',
  'industrial-dark': 'border-white/10 bg-white/10',
}

/** Produtos relacionados em cards com imagem ou em lista editorial com seta. */
export function RelatedProducts({
  products,
  title,
  eyebrow = 'Continue explorando',
  variant = 'cards',
  tone = 'glow',
  className,
}: RelatedProductsProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'

  if (!products.length) return null

  return (
    <section className={cn(t.section, className)}>
      <div className="container py-14 lg:py-16">
        {title ? (
          <EyebrowHeading tone={tone} eyebrow={eyebrow} title={title} className="mb-10 lg:mb-12" />
        ) : (
          <div className="mb-8 flex items-center gap-3">
            <span className={cn('h-px w-8', t.line)} aria-hidden />
            <span className={cn('text-[0.65rem] uppercase tracking-[0.28em]', t.accent)}>
              {eyebrow}
            </span>
          </div>
        )}

        {variant === 'cards' ? (
          <div className={cn('grid grid-cols-1 gap-px border md:grid-cols-3', gridLines[tone])}>
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className={cn('group flex flex-col', t.panel, t.focus)}
              >
                {product.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <p className={cn('text-[0.65rem] uppercase tracking-[0.2em]', t.accent)}>
                    {product.category}
                  </p>
                  <h3
                    className={cn(
                      'mt-2 text-lg font-semibold tracking-wide',
                      !isGlow && 'uppercase',
                      t.strong,
                    )}
                  >
                    {product.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <ul className={cn('divide-y border-y', t.divide, t.border)}>
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={product.href}
                  className={cn(
                    'group flex items-center justify-between gap-6 py-6 transition-colors',
                    t.focus,
                  )}
                >
                  <div>
                    <p className={cn('text-[0.65rem] uppercase tracking-[0.2em]', t.accent)}>
                      {product.category}
                    </p>
                    <h3
                      className={cn(
                        'mt-1 text-xl font-semibold tracking-wide transition-colors',
                        !isGlow && 'uppercase',
                        t.strong,
                        isGlow ? 'group-hover:text-[#ffb0eb]' : 'group-hover:text-amber-600',
                      )}
                    >
                      {product.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    className={cn(
                      'h-5 w-5 shrink-0 transition-transform group-hover:rotate-45',
                      t.muted,
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
