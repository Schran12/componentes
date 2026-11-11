'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Check } from 'lucide-react'

import { AccentButton } from '@/components/library/primitives/AccentButton'
import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { padIndex, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type ProductSpotlightItem = {
  id: string
  title: string
  category: string
  description: string
  image: { src: string; alt: string }
  features?: readonly string[]
  href: string
}

export type ProductSpotlightPickerProps = {
  title: string
  products: readonly ProductSpotlightItem[]
  eyebrow?: string
  description?: string
  variant?: 'cards' | 'panel'
  actionLabel?: string
  allAction?: { label: string; href: string }
  tone?: AccentTone
  className?: string
}

/** Vitrine com produto em destaque trocado por hover, foco ou clique em uma lista seletora. */
export function ProductSpotlightPicker({
  title,
  products,
  eyebrow,
  description,
  variant = 'cards',
  actionLabel = 'Ver solução',
  allAction,
  tone = 'glow',
  className,
}: ProductSpotlightPickerProps) {
  const [activeId, setActiveId] = useState(products[0]?.id)
  const active = products.find((product) => product.id === activeId) ?? products[0]
  const isGlow = tone === 'glow'
  const headingTone: AccentTone = isGlow ? 'glow' : 'industrial-dark'

  if (!active) return null

  const select = (id: string) => ({
    onMouseEnter: () => setActiveId(id),
    onFocus: () => setActiveId(id),
    onClick: () => setActiveId(id),
  })

  const focusRing = isGlow
    ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c642a5]'
    : 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500'

  return (
    <section
      className={cn(
        'relative overflow-hidden py-14 lg:py-20',
        isGlow ? 'bg-[#121212] text-[#c1c1c1]' : 'bg-slate-950 text-white',
        className,
      )}
    >
      {isGlow ? (
        <>
          <div
            className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#c642a5]/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#7c39cf]/10 blur-3xl"
            aria-hidden
          />
        </>
      ) : null}

      <div className="container relative">
        <EyebrowHeading
          tone={headingTone}
          eyebrow={eyebrow}
          title={title}
          description={description}
          layout="split"
          className="mb-8 lg:mb-12"
        />

        <ul className="grid gap-4 sm:grid-cols-2 md:hidden">
          {products.map((product) => (
            <li key={product.id}>
              <a
                href={product.href}
                className={cn(
                  'group flex h-full flex-col overflow-hidden border',
                  isGlow
                    ? 'rounded-2xl border-[#493849] bg-[#221d2f]'
                    : 'border-white/10 bg-slate-900',
                  focusRing,
                )}
              >
                <span className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-1 flex-col p-5">
                  <span
                    className={cn(
                      'text-xs font-bold uppercase tracking-wider',
                      isGlow ? 'text-[#ffb0eb]' : 'text-amber-500',
                    )}
                  >
                    {product.category}
                  </span>
                  <span className="mt-2 text-lg font-semibold text-white">{product.title}</span>
                  <span className="mt-2 line-clamp-3 text-sm leading-6">{product.description}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    {actionLabel}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        {allAction ? (
          <AccentButton
            href={allAction.href}
            tone={headingTone}
            className="mt-6 w-full justify-center md:hidden"
          >
            {allAction.label}
          </AccentButton>
        ) : null}

        <div className="hidden md:block">
          {variant === 'cards' ? (
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
              <article
                className={cn(
                  'group relative overflow-hidden border lg:col-span-7',
                  isGlow
                    ? 'rounded-2xl border-[#493849] bg-[#221d2f]'
                    : 'border-white/10 bg-slate-900',
                )}
              >
                <div className="relative min-h-[22rem] sm:min-h-[26rem] lg:absolute lg:inset-0 lg:min-h-full">
                  <Image
                    key={active.id}
                    src={active.image.src}
                    alt={active.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-t to-transparent',
                      isGlow
                        ? 'from-[#121212] via-[#121212]/55'
                        : 'from-slate-950 via-slate-950/55',
                    )}
                    aria-hidden
                  />
                </div>
                <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-8 lg:min-h-[32rem] lg:p-10">
                  <span
                    className={cn(
                      'mb-3 inline-flex w-fit border px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] backdrop-blur-sm',
                      isGlow
                        ? 'rounded-full border-[#493849] bg-[#121212]/70 text-[#ffb0eb]'
                        : 'border-white/15 bg-slate-950/60 text-amber-500',
                    )}
                  >
                    {active.category}
                  </span>
                  <h3 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                    {active.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed sm:text-base">
                    {active.description}
                  </p>
                  {active.features?.length ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {active.features.slice(0, 4).map((feature) => (
                        <li
                          key={feature}
                          className={cn(
                            'inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs text-white backdrop-blur-sm',
                            isGlow
                              ? 'rounded-full border-[#493849] bg-[#121212]/55'
                              : 'border-white/15 bg-slate-950/50',
                          )}
                        >
                          <Check
                            className={cn('h-3 w-3', isGlow ? 'text-[#ffb0eb]' : 'text-amber-500')}
                            aria-hidden
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-7">
                    <AccentButton href={active.href} tone={headingTone}>
                      {actionLabel}
                    </AccentButton>
                  </div>
                </div>
              </article>

              <div className="flex flex-col gap-3 lg:col-span-5">
                {products.map((product, index) => {
                  const isActive = product.id === active.id
                  return (
                    <button
                      key={product.id}
                      type="button"
                      {...select(product.id)}
                      aria-pressed={isActive}
                      className={cn(
                        'group relative overflow-hidden border p-4 text-left transition-all duration-300 sm:p-5',
                        isGlow ? 'rounded-xl' : '',
                        isActive
                          ? isGlow
                            ? 'border-transparent bg-gradient-to-r from-[#c642a5]/90 to-[#7c39cf]/90 shadow-[0_0_24px_rgba(198,66,165,0.25)]'
                            : 'border-amber-500 bg-amber-500 text-slate-950'
                          : isGlow
                            ? 'border-[#493849] bg-[#221d2f] hover:border-[#c642a5]/40 hover:bg-[#121212]'
                            : 'border-white/10 bg-slate-900 hover:bg-white/5',
                        focusRing,
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 sm:h-16 sm:w-16">
                          <Image
                            src={product.image.src}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.18em]">
                            <span
                              className={
                                isActive
                                  ? 'opacity-75'
                                  : isGlow
                                    ? 'text-[#ffb0eb]'
                                    : 'text-amber-500'
                              }
                            >
                              {padIndex(index)}
                            </span>
                            <span className="truncate opacity-75">{product.category}</span>
                          </div>
                          <p
                            className={cn(
                              'mt-1 truncate text-base font-semibold sm:text-lg',
                              isActive && !isGlow ? 'text-slate-950' : 'text-white',
                            )}
                          >
                            {product.title}
                          </p>
                        </div>
                        <ArrowUpRight
                          className={cn(
                            'h-4 w-4 shrink-0 transition-transform duration-300',
                            isActive && 'rotate-45',
                          )}
                          aria-hidden
                        />
                      </div>
                    </button>
                  )
                })}

                {allAction ? (
                  <AccentButton
                    href={allAction.href}
                    tone={headingTone}
                    className="mt-2 w-full justify-center sm:w-auto sm:self-start"
                  >
                    {allAction.label}
                  </AccentButton>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="grid gap-0 lg:min-h-[34rem] lg:grid-cols-12">
              <div
                className={cn(
                  'border lg:col-span-5',
                  isGlow ? 'border-[#493849] bg-[#221d2f]' : 'border-white/10 bg-slate-900/40',
                )}
              >
                <div className={cn('divide-y', isGlow ? 'divide-[#493849]' : 'divide-white/10')}>
                  {products.map((product, index) => {
                    const isActive = product.id === active.id
                    return (
                      <button
                        key={product.id}
                        type="button"
                        {...select(product.id)}
                        aria-pressed={isActive}
                        className={cn(
                          'group flex w-full items-center gap-4 px-5 py-5 text-left transition-colors duration-300 sm:px-6 sm:py-6',
                          isActive
                            ? isGlow
                              ? 'bg-gradient-to-r from-[#c642a5] to-[#7c39cf] text-white'
                              : 'bg-amber-500 text-slate-950'
                            : 'text-white hover:bg-white/5',
                          focusRing,
                        )}
                      >
                        <span
                          className={cn(
                            'text-xs tracking-[0.22em]',
                            isActive ? 'opacity-70' : isGlow ? 'text-[#ffb0eb]' : 'text-amber-500',
                          )}
                        >
                          {padIndex(index)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-base font-semibold tracking-wide sm:text-lg">
                            {product.title}
                          </span>
                          <span
                            className={cn(
                              'mt-0.5 block text-xs uppercase tracking-[0.18em]',
                              isActive ? 'opacity-60' : 'text-slate-500',
                            )}
                          >
                            {product.category}
                          </span>
                        </span>
                        <ArrowUpRight
                          className={cn(
                            'h-4 w-4 shrink-0 transition-transform duration-300',
                            isActive ? 'rotate-45' : 'text-slate-500',
                          )}
                          aria-hidden
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div
                className={cn(
                  'relative min-h-[26rem] overflow-hidden border border-t-0 lg:col-span-7 lg:min-h-full lg:border-l-0 lg:border-t',
                  isGlow ? 'border-[#493849]' : 'border-white/10',
                )}
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={cn(
                      'absolute inset-0 transition-opacity duration-500 ease-out',
                      product.id === active.id ? 'opacity-100' : 'pointer-events-none opacity-0',
                    )}
                    aria-hidden={product.id !== active.id}
                  >
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className={cn(
                        'object-cover transition-transform duration-700 ease-out',
                        product.id === active.id ? 'scale-100' : 'scale-110',
                      )}
                    />
                    <div
                      className={cn(
                        'absolute inset-0 bg-gradient-to-t',
                        isGlow
                          ? 'from-[#121212] via-[#121212]/70 to-[#121212]/25'
                          : 'from-slate-950 via-slate-950/70 to-slate-950/25',
                      )}
                    />
                  </div>
                ))}
                <div className="relative z-10 flex h-full min-h-[26rem] flex-col justify-end p-6 sm:p-8 lg:min-h-full lg:p-10">
                  <p
                    className={cn(
                      'mb-3 text-[0.65rem] font-medium uppercase tracking-[0.28em]',
                      isGlow ? 'text-[#ffb0eb]' : 'text-amber-500',
                    )}
                  >
                    {active.category}
                  </p>
                  <h3
                    className={cn(
                      'text-2xl font-semibold text-white sm:text-3xl lg:text-4xl',
                      !isGlow && 'uppercase tracking-wide',
                    )}
                  >
                    {active.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                    {active.description}
                  </p>
                  {active.features?.length ? (
                    <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {active.features.map((feature) => (
                        <li
                          key={feature}
                          className={cn(
                            'flex items-center gap-3 border px-3 py-2.5 text-sm text-slate-200 backdrop-blur-sm',
                            isGlow
                              ? 'rounded-lg border-[#493849] bg-[#121212]/40'
                              : 'border-white/10 bg-slate-950/40',
                          )}
                        >
                          <span
                            className={cn(
                              'h-1.5 w-1.5 shrink-0',
                              isGlow ? 'rounded-full bg-[#c642a5]' : 'bg-amber-500',
                            )}
                            aria-hidden
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-8">
                    <AccentButton href={active.href} tone={headingTone}>
                      {actionLabel}
                    </AccentButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
