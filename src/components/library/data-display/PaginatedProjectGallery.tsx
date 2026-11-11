'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type GalleryProject = {
  id: string
  title: string
  category: string
  image: { src: string; alt: string }
  href?: string
}

export type PaginatedProjectGalleryProps = {
  title?: string
  description?: string
  projects: GalleryProject[]
  perPage?: number
  allLabel?: string
  previousLabel?: string
  nextLabel?: string
  className?: string
}

export function PaginatedProjectGallery({
  title,
  description,
  projects,
  perPage = 6,
  allLabel = 'Todos',
  previousLabel = 'Anterior',
  nextLabel = 'Próximo',
  className,
}: PaginatedProjectGalleryProps) {
  const [category, setCategory] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const reduceMotion = useReducedMotion()
  const categories = useMemo(
    () => Array.from(new Set(projects.map((item) => item.category))),
    [projects],
  )
  const filtered = category ? projects.filter((item) => item.category === category) : projects
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * perPage, current * perPage)

  function selectCategory(value: string | null) {
    setCategory(value)
    setPage(1)
  }

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        {title || description ? (
          <div className="mx-auto max-w-2xl text-center">
            {title ? (
              <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
            ) : null}
          </div>
        ) : null}

        <div
          className="mt-10 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filtrar projetos"
        >
          {[null, ...categories].map((item) => (
            <button
              key={item ?? 'all'}
              type="button"
              onClick={() => selectCategory(item)}
              aria-pressed={category === item}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition',
                category === item
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'hover:border-primary/50 hover:text-primary',
              )}
            >
              {item ?? allLabel}
            </button>
          ))}
        </div>

        <motion.ul layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.li
                layout
                key={project.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
              >
                <a
                  href={project.href ?? '#'}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
                >
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/90 via-primary/30 to-transparent p-5 text-primary-foreground opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="translate-y-3 text-xs font-bold uppercase tracking-widest opacity-80 transition duration-300 group-hover:translate-y-0">
                      {project.category}
                    </span>
                    <span className="translate-y-3 text-lg font-semibold transition delay-75 duration-300 group-hover:translate-y-0">
                      {project.title}
                    </span>
                  </span>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {pages > 1 ? (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginação">
            <button
              type="button"
              onClick={() => setPage(current - 1)}
              disabled={current === 1}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition hover:text-primary disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              {previousLabel}
            </button>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => setPage(number)}
                aria-current={number === current ? 'page' : undefined}
                className={cn(
                  'h-10 w-10 rounded-full text-sm font-semibold transition',
                  number === current ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                )}
              >
                {number}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(current + 1)}
              disabled={current === pages}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition hover:text-primary disabled:opacity-40"
            >
              {nextLabel}
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  )
}
