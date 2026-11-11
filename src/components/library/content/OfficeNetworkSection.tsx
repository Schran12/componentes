import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'

import { cn } from '@/lib/utils'

export type OfficeLocation = {
  city: string
  country?: string
  address: string
  phone?: string
  email?: string
  href?: string
}

export type OfficeNetworkSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  offices: readonly OfficeLocation[]
  className?: string
}

export function OfficeNetworkSection({
  eyebrow,
  title,
  description,
  offices,
  className,
}: OfficeNetworkSectionProps) {
  return (
    <section className={cn('bg-[#f0eee8] py-20 text-[#17211b] md:py-28', className)}>
      <div className="container">
        <div className="grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            {eyebrow ? (
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#4d6655]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-5 font-serif text-4xl tracking-[-0.035em] md:text-6xl">{title}</h2>
          </div>
          {description ? (
            <p className="max-w-2xl text-lg leading-8 text-[#49564e] lg:justify-self-end">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid border-l border-t border-[#17211b]/20 sm:grid-cols-2 lg:grid-cols-3">
          {offices.map((office) => (
            <article
              key={`${office.city}-${office.address}`}
              className="group relative min-h-[310px] border-b border-r border-[#17211b]/20 p-7 transition hover:bg-white/55 md:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <MapPin className="h-5 w-5 text-[#4d6655]" aria-hidden />
                {office.href ? (
                  <Link
                    href={office.href}
                    aria-label={`Ver localização de ${office.city}`}
                    className="rounded-full p-2 text-[#4d6655] transition hover:bg-[#4d6655] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d6655]"
                  >
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                ) : null}
              </div>

              <h3 className="mt-10 font-serif text-3xl">{office.city}</h3>
              {office.country ? (
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[#6c776f]">
                  {office.country}
                </p>
              ) : null}
              <address className="mt-5 whitespace-pre-line text-sm not-italic leading-6 text-[#49564e]">
                {office.address}
              </address>

              <div className="mt-7 space-y-2 text-xs">
                {office.phone ? (
                  <a
                    href={`tel:${office.phone.replace(/[^\d+]/g, '')}`}
                    className="flex items-center gap-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d6655]"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {office.phone}
                  </a>
                ) : null}
                {office.email ? (
                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d6655]"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {office.email}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
