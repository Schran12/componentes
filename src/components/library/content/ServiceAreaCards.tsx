'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ServiceArea = {
  id: string
  name: string
  region?: string
  description?: string
  image: { src: string; alt: string }
  href?: string
  actionLabel?: string
}

export type ServiceAreaCardsProps = {
  title: string
  description?: string
  areas: ServiceArea[]
  className?: string
}

export function ServiceAreaCards({ title, description, areas, className }: ServiceAreaCardsProps) {
  const reduceMotion = useReducedMotion()

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, index) => (
            <motion.li
              key={area.id}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <a
                href={area.href ?? '#'}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-muted p-6 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <Image
                  src={area.image.src}
                  alt={area.image.alt}
                  fill
                  className="-z-0 object-cover transition duration-700 group-hover:scale-110"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition group-hover:from-primary/90" />
                <span className="relative">
                  {area.region ? (
                    <span className="text-xs font-bold uppercase tracking-widest text-white/75">
                      {area.region}
                    </span>
                  ) : null}
                  <span className="mt-1 block text-2xl font-bold">{area.name}</span>
                  {area.description ? (
                    <span className="mt-2 block max-h-0 overflow-hidden text-sm leading-6 text-white/85 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100">
                      {area.description}
                    </span>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                    {area.actionLabel ?? 'Explorar'}
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
