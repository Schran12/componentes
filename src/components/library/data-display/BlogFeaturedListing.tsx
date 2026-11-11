'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { Breadcrumbs, type BreadcrumbItem } from '@/components/library/navigation/Breadcrumbs'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type BlogListingPost = {
  slug: string
  title: string
  excerpt: string
  image: { src: string; alt: string }
  date: string
  dateTime?: string
  category?: string
  href: string
}

export type BlogListingLabels = {
  searchTitle?: string
  searchPlaceholder?: string
  searchButton?: string
  recentTitle?: string
  categoriesTitle?: string
  allLabel?: string
  readMore?: string
  previous?: string
  next?: string
  emptyMessage?: string
}

export type BlogFeaturedListingProps = {
  posts: BlogListingPost[]
  hero?: {
    title: string
    description?: string
    image: { src: string; alt: string }
    icon?: ReactNode
    breadcrumbs?: readonly BreadcrumbItem[]
  }
  perPage?: number
  featured?: boolean
  recent?: BlogListingPost[]
  categories?: Array<{ label: string; href: string }>
  labels?: BlogListingLabels
  className?: string
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

function PostDate({ post, className }: { post: BlogListingPost; className?: string }) {
  return (
    <time
      dateTime={post.dateTime}
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}
    >
      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
      {post.date}
    </time>
  )
}

function ReadMore({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
      {label}
      <ChevronRight
        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </span>
  )
}

function FeaturedPost({ post }: { post: BlogListingPost }) {
  return (
    <Link
      href={post.href}
      className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl bg-muted shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:aspect-[16/9]"
    >
      <Image
        src={post.image.src}
        alt={post.image.alt}
        fill
        priority
        className="object-cover transition duration-700 group-hover:scale-105"
        sizes="(min-width: 1024px) 66vw, 100vw"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <span className="relative p-6 text-white md:p-8">
        {post.category ? (
          <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {post.category}
          </span>
        ) : null}
        <PostDate post={post} className="flex text-white/80" />
        <span className="mt-2 block text-2xl font-bold leading-tight md:text-3xl">
          {post.title}
        </span>
      </span>
    </Link>
  )
}

function PostCard({ post, readMore }: { post: BlogListingPost; readMore: string }) {
  return (
    <Link
      href={post.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
        />
      </span>
      <span className="flex flex-1 flex-col p-5">
        <PostDate post={post} className="text-muted-foreground" />
        <span className="mt-3 block text-lg font-bold leading-snug group-hover:text-primary">
          {post.title}
        </span>
        <span className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {post.excerpt}
        </span>
        <span className="mt-auto pt-5">
          <ReadMore label={readMore} />
        </span>
      </span>
    </Link>
  )
}

export function BlogFeaturedListing({
  posts,
  hero,
  perPage = 6,
  featured = true,
  recent = posts.slice(0, 4),
  categories,
  labels = {},
  className,
}: BlogFeaturedListingProps) {
  const {
    searchTitle = 'Pesquisar',
    searchPlaceholder = 'Pesquisar...',
    searchButton = 'Buscar',
    recentTitle = 'Posts recentes',
    categoriesTitle = 'Categorias',
    allLabel = 'Todas',
    readMore = 'Ler mais',
    previous = 'Anterior',
    next = 'Próxima',
    emptyMessage = 'Nenhum artigo encontrado.',
  } = labels
  const id = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const derivedCategories = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => (post.category ? [post.category] : [])))),
    [posts],
  )

  const term = normalize(query.trim())
  const filtered = posts.filter(
    (post) =>
      (!category || post.category === category) &&
      (!term || normalize([post.title, post.excerpt, post.category].join(' ')).includes(term)),
  )
  const filtering = Boolean(term || category)
  const highlight = featured && !filtering ? filtered[0] : undefined
  const rest = highlight ? filtered.slice(1) : filtered
  const pageCount = Math.max(1, Math.ceil(rest.length / perPage))
  const currentPage = Math.min(page, pageCount)
  const visible = rest.slice((currentPage - 1) * perPage, currentPage * perPage)

  const goTo = (target: number) => {
    setPage(target)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setQuery(draft)
    setPage(1)
  }

  const selectCategory = (value: string | null) => {
    setCategory(value)
    setPage(1)
  }

  return (
    <>
      {hero ? (
        <header className="relative isolate overflow-hidden bg-foreground text-white">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            className="-z-20 object-cover"
            sizes="100vw"
          />
          <span className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/70 to-primary/60" />
          <div className="container flex min-h-64 flex-col pb-6 pt-14 md:min-h-80 md:pt-20">
            <div className="mx-auto max-w-2xl flex-1 text-center">
              {hero.icon ? (
                <span className="mb-3 inline-flex text-primary-foreground/90 [&_svg]:h-7 [&_svg]:w-7">
                  {hero.icon}
                </span>
              ) : null}
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{hero.title}</h1>
              {hero.description ? (
                <p className="mt-4 text-base leading-7 text-white/80 md:text-lg">
                  {hero.description}
                </p>
              ) : null}
            </div>
            {hero.breadcrumbs?.length ? (
              <Breadcrumbs tone="inverted" items={hero.breadcrumbs} className="mt-10" />
            ) : null}
          </div>
        </header>
      ) : null}
      <section className={cn('py-16 md:py-20', className)} aria-label="Artigos do blog">
        <div className="container grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-0">
          <div ref={listRef} className="min-w-0 scroll-mt-28 lg:pr-10">
            <p className="sr-only" aria-live="polite">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
            </p>

            {highlight && currentPage === 1 ? (
              <div className="mb-8">
                <FeaturedPost post={highlight} />
              </div>
            ) : null}

            {visible.length ? (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} readMore={readMore} />
                  </li>
                ))}
              </ul>
            ) : !highlight ? (
              <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                {emptyMessage}
              </p>
            ) : null}

            {pageCount > 1 ? (
              <nav
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                aria-label="Paginação do blog"
              >
                <button
                  type="button"
                  onClick={() => goTo(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  {previous}
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => goTo(number)}
                    aria-current={number === currentPage ? 'page' : undefined}
                    className={cn(
                      'h-9 min-w-9 rounded-lg border px-3 text-sm font-medium transition',
                      number === currentPage
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'bg-card hover:border-primary/40 hover:text-primary',
                    )}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goTo(currentPage + 1)}
                  disabled={currentPage === pageCount}
                  className="inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                  {next}
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </nav>
            ) : null}
          </div>

          <aside className="space-y-10 lg:border-l lg:pl-10">
            <form role="search" onSubmit={submitSearch}>
              <label htmlFor={`${id}-busca`} className="text-lg font-bold">
                {searchTitle}
              </label>
              <div className="mt-3 flex gap-2">
                <Input
                  id={`${id}-busca`}
                  type="search"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value)
                    if (!event.target.value) setQuery('')
                  }}
                  placeholder={searchPlaceholder}
                />
                <button
                  type="submit"
                  aria-label={searchButton}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>

            {recent.length ? (
              <div>
                <h2 className="text-lg font-bold">{recentTitle}</h2>
                <ul className="mt-4 space-y-5">
                  {recent.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={post.href}
                        className="group flex gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={post.image.src}
                            alt=""
                            fill
                            className="object-cover transition duration-500 group-hover:scale-110"
                            sizes="80px"
                          />
                        </span>
                        <span className="min-w-0">
                          <PostDate post={post} className="text-muted-foreground" />
                          <span className="mt-1 line-clamp-3 text-sm font-semibold leading-snug group-hover:text-primary">
                            {post.title}
                          </span>
                          <span className="mt-2 block">
                            <ReadMore label={readMore} />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {categories?.length || derivedCategories.length ? (
              <nav aria-labelledby={`${id}-categorias`}>
                <h2 id={`${id}-categorias`} className="text-lg font-bold">
                  {categoriesTitle}
                </h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {categories?.length ? (
                    categories.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <>
                      {[null, ...derivedCategories].map((item) => (
                        <li key={item ?? 'all'}>
                          <button
                            type="button"
                            aria-pressed={category === item}
                            onClick={() => selectCategory(item)}
                            className={cn(
                              'text-left underline-offset-4 transition hover:text-primary hover:underline',
                              category === item
                                ? 'font-semibold text-primary underline'
                                : 'text-muted-foreground',
                            )}
                          >
                            {item ?? allLabel}
                          </button>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </nav>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  )
}
