import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BlogGridProps = {
  title?: string
  posts: Array<{
    slug: string
    title: string
    excerpt?: string
    image: { src: string; alt: string }
    date: string
    category?: string
    href?: string
  }>
  className?: string
}

export function BlogGrid({ title, posts, className }: BlogGridProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'blog-title' : undefined}
    >
      <div className="container">
        {title ? (
          <h2 id="blog-title" className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <Link
                href={post.href ?? `/blog/${post.slug}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <Image
                    src={post.image.src}
                    alt={post.image.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex gap-2 text-xs font-medium text-muted-foreground">
                    {post.category ? <span>{post.category}</span> : null}
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Ler artigo <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
