'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useId, useMemo, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'

import { BlogGrid } from '@/components/library/data-display/BlogGrid'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type BlogSidebarPost = {
  slug: string
  title: string
  excerpt: string
  image: { src: string; alt: string }
  date: string
  category?: string
  href: string
}

export type BlogSidebarLabels = {
  searchLabel?: string
  searchPlaceholder?: string
  categoriesTitle?: string
  allLabel?: string
  recentTitle?: string
  emptyMessage?: string
}

export type BlogSidebarLayoutProps = {
  posts: BlogSidebarPost[]
  /** Posts recentes exibidos na barra lateral; padrão: os 3 primeiros. */
  recent?: BlogSidebarPost[]
  labels?: BlogSidebarLabels
  cta?: { title: string; description?: string; action: { label: string; href: string } }
  className?: string
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export function BlogSidebarLayout({
  posts,
  recent = posts.slice(0, 3),
  labels = {},
  cta,
  className,
}: BlogSidebarLayoutProps) {
  const {
    searchLabel = 'Buscar no blog',
    searchPlaceholder = 'Digite um termo',
    categoriesTitle = 'Categorias',
    allLabel = 'Todas',
    recentTitle = 'Posts recentes',
    emptyMessage = 'Nenhum artigo encontrado.',
  } = labels
  const searchId = useId()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    posts.forEach((post) => {
      if (post.category) counts.set(post.category, (counts.get(post.category) ?? 0) + 1)
    })
    return Array.from(counts, ([name, count]) => ({ name, count }))
  }, [posts])

  const term = normalize(query.trim())
  const visible = posts.filter(
    (post) =>
      (!category || post.category === category) &&
      (!term || normalize([post.title, post.excerpt, post.category].join(' ')).includes(term)),
  )

  const filters = [
    { name: null as string | null, label: allLabel, count: posts.length },
    ...categories.map((item) => ({
      name: item.name as string | null,
      label: item.name,
      count: item.count,
    })),
  ]

  return (
    <section className={cn('py-16 md:py-24', className)} aria-label="Artigos do blog">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12 lg:gap-y-6">
        <div className="space-y-6 lg:col-start-2 lg:row-start-1">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <label htmlFor={searchId} className="text-sm font-semibold">
              {searchLabel}
            </label>
            <div className="relative mt-3">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
          </div>

          <nav
            aria-labelledby={`${searchId}-categorias`}
            className="rounded-2xl border bg-card p-6 shadow-sm"
          >
            <h2 id={`${searchId}-categorias`} className="text-sm font-semibold">
              {categoriesTitle}
            </h2>
            <ul className="mt-3 space-y-1">
              {filters.map((filter) => {
                const active = category === filter.name
                return (
                  <li key={filter.label}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(filter.name)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        active
                          ? 'bg-primary font-medium text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {filter.label}
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs',
                          active ? 'bg-primary-foreground/20' : 'bg-muted',
                        )}
                      >
                        {filter.count}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <p className="sr-only" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
          </p>
          {visible.length ? (
            <BlogGrid
              posts={visible}
              className="py-0 md:py-0 [&_.container]:max-w-none [&_.container]:px-0 lg:[&_.grid]:grid-cols-2"
            />
          ) : (
            <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
              {emptyMessage}
            </p>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:col-start-2 lg:row-start-2 lg:self-start">
          {recent.length ? (
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold">{recentTitle}</h2>
              <ul className="mt-4 space-y-4">
                {recent.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={post.href}
                      className="group flex gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={post.image.src}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">
                          {post.title}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {post.date}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {cta ? (
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
              <h2 className="text-lg font-semibold">{cta.title}</h2>
              {cta.description ? (
                <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                  {cta.description}
                </p>
              ) : null}
              <Link
                href={cta.action.href}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary-foreground/90"
              >
                {cta.action.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
