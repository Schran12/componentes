import Image from 'next/image'
import { cn } from '@/lib/utils'

export type ArticleBlock = { heading?: string; paragraphs: string[] }

export type ArticleLayoutProps = {
  body: ArticleBlock[]
  /** Data exibida (já formatada) e valor ISO para o `<time>`. */
  date: { label: string; dateTime: string }
  image?: { src: string; alt: string }
  author?: string
  category?: string
  quote?: string
  /** `cover`: sem imagem no corpo (a capa fica no hero) e metadados centralizados. */
  variant?: 'classic' | 'cover' | 'sidebar' | 'magazine'
  wordsPerMinute?: number
  labels?: {
    authorPrefix?: string
    readingTime?: (minutes: number) => string
    aboutTitle?: string
    publishedLabel?: string
    categoryLabel?: string
    readingLabel?: string
    tocTitle?: string
  }
  aside?: { title: string; description?: string; action: { label: string; href: string } }
  className?: string
}

const sectionId = (index: number) => `secao-${index + 1}`

export function ArticleLayout({
  body,
  date,
  image,
  author,
  category,
  quote,
  variant = 'classic',
  wordsPerMinute = 200,
  labels = {},
  aside,
  className,
}: ArticleLayoutProps) {
  const {
    authorPrefix = 'Por',
    readingTime = (minutes: number) => `${minutes} min de leitura`,
    aboutTitle = 'Sobre o artigo',
    publishedLabel = 'Publicado em',
    categoryLabel = 'Categoria',
    readingLabel = 'Leitura',
    tocTitle = 'Neste artigo',
  } = labels
  const words = body
    .flatMap((block) => block.paragraphs)
    .join(' ')
    .split(/\s+/).length
  const reading = readingTime(Math.max(1, Math.round(words / wordsPerMinute)))

  const meta = (
    <p className="flex flex-wrap gap-x-2 text-sm text-muted-foreground">
      {author ? (
        <span>
          {authorPrefix} {author} ·
        </span>
      ) : null}
      <time dateTime={date.dateTime}>{date.label}</time>
      <span aria-hidden>·</span>
      <span>{reading}</span>
    </p>
  )

  const cover = image ? (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 48rem, 100vw"
        className="object-cover"
      />
    </div>
  ) : null

  const renderBlocks = (from = 0, to = body.length, numbered = false) =>
    body.slice(from, to).map((block, offset) => {
      const index = from + offset
      const number = body.slice(0, index + 1).filter((item) => item.heading).length
      return (
        <section key={block.heading ?? index} id={sectionId(index)} className="mt-10 scroll-mt-28">
          {block.heading ? (
            <h2 className="flex items-baseline gap-3 text-xl font-bold tracking-tight md:text-2xl">
              {numbered ? (
                <span className="font-mono text-base text-primary">
                  {String(number).padStart(2, '0')}
                </span>
              ) : null}
              {block.heading}
            </h2>
          ) : null}
          {block.paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-4 leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>
      )
    })

  if (variant === 'sidebar') {
    const toc = body
      .map((block, index) => ({ heading: block.heading, id: sectionId(index) }))
      .filter((item): item is { heading: string; id: string } => !!item.heading)

    return (
      <div
        className={cn(
          'container grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_18rem]',
          className,
        )}
      >
        <article className="min-w-0">
          {cover}
          {renderBlocks()}
        </article>
        <aside className="space-y-6 self-start lg:sticky lg:top-28">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {aboutTitle}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">{publishedLabel}</dt>
                <dd className="font-medium">
                  <time dateTime={date.dateTime}>{date.label}</time>
                </dd>
              </div>
              {category ? (
                <div>
                  <dt className="text-muted-foreground">{categoryLabel}</dt>
                  <dd className="font-medium">{category}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-muted-foreground">{readingLabel}</dt>
                <dd className="font-medium">{reading}</dd>
              </div>
            </dl>
          </div>
          {toc.length ? (
            <nav aria-label={tocTitle} className="rounded-2xl border bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                {tocTitle}
              </h2>
              <ol className="mt-4 space-y-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          {aside ? (
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
              <h2 className="text-lg font-semibold">{aside.title}</h2>
              {aside.description ? (
                <p className="mt-2 text-sm text-primary-foreground/85">{aside.description}</p>
              ) : null}
              <a
                href={aside.action.href}
                className="mt-4 inline-flex rounded-full bg-primary-foreground px-4 py-2 text-sm font-semibold text-primary transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                {aside.action.label}
              </a>
            </div>
          ) : null}
        </aside>
      </div>
    )
  }

  if (variant === 'magazine') {
    const [lead, ...rest] = body
    const quoteAfter = Math.min(1, rest.length - 1)

    return (
      <article className={cn('container max-w-3xl py-16 md:py-24', className)}>
        <div className="border-b pb-8">{meta}</div>
        {lead?.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={cn(
              'mt-8 text-lg leading-8 text-foreground md:text-xl md:leading-9',
              index === 0 &&
                'first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:font-bold first-letter:leading-none first-letter:text-primary',
            )}
          >
            {paragraph}
          </p>
        ))}
        {rest.map((block, index) => (
          <div key={block.heading ?? index}>
            {renderBlocks(index + 1, index + 2, true)}
            {quote && index === quoteAfter ? (
              <blockquote className="mt-10 border-l-4 border-primary pl-6 text-xl font-medium leading-8 md:text-2xl md:leading-10">
                {quote}
              </blockquote>
            ) : null}
          </div>
        ))}
      </article>
    )
  }

  if (variant === 'cover') {
    return (
      <article className={cn('container max-w-3xl py-16 md:py-24', className)}>
        <div className="flex justify-center border-b pb-8">{meta}</div>
        {renderBlocks()}
      </article>
    )
  }

  return (
    <article className={cn('container max-w-3xl py-16 md:py-24', className)}>
      {meta}
      {cover ? <div className="mt-6">{cover}</div> : null}
      {renderBlocks()}
    </article>
  )
}
