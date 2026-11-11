import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ContactMethod = {
  label: string
  value: string
  href: string
  icon?: LucideIcon
}

export type ContactSplitSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  methods: ContactMethod[]
  socialLinks?: Array<{ label: string; href: string }>
  form: React.ReactNode
  formTitle?: string
  className?: string
}

export function ContactSplitSection({
  eyebrow = 'Vamos conversar',
  title,
  description,
  methods,
  socialLinks = [],
  form,
  formTitle = 'Conte sobre o seu projeto',
  className,
}: ContactSplitSectionProps) {
  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="overflow-hidden rounded-[2rem] border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="min-w-0 bg-foreground p-7 text-background md:p-10 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-background/70">
                {eyebrow}
              </p>
              <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {title}
              </h2>
              {description ? (
                <p className="mt-5 max-w-md leading-7 text-background/70">{description}</p>
              ) : null}

              <address className="mt-10 space-y-3 not-italic">
                {methods.map((method) => {
                  const Icon = method.icon
                  return (
                    <a
                      key={`${method.label}-${method.value}`}
                      href={method.href}
                      className="group flex items-center gap-4 rounded-2xl border border-background/15 p-4 transition hover:bg-background/10"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/10">
                        {Icon ? (
                          <Icon className="size-5" aria-hidden="true" />
                        ) : (
                          <ArrowUpRight className="size-5" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-wider text-background/55">
                          {method.label}
                        </span>
                        <span className="mt-1 block font-medium [overflow-wrap:anywhere]">
                          {method.value}
                        </span>
                      </span>
                    </a>
                  )
                })}
              </address>

              {socialLinks.length ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="rounded-full border border-background/20 px-3 py-1.5 text-sm transition hover:bg-background hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="min-w-0 p-7 md:p-10 lg:p-12">
              <h3 className="mb-7 text-2xl font-semibold">{formTitle}</h3>
              {form}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
