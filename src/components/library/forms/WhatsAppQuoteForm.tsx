'use client'

import type { FormEvent, ReactNode } from 'react'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WhatsAppQuoteContact = {
  label: string
  href?: string
  icon?: ReactNode
}

export type WhatsAppQuoteFormProps = {
  title: string
  phone: string
  description?: string
  eyebrow?: string
  contacts?: WhatsAppQuoteContact[]
  submitLabel?: string
  disclaimer?: string
  className?: string
}

const fields = [
  { name: 'nome', label: 'Nome', type: 'text' },
  { name: 'assunto', label: 'Assunto', type: 'text' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'telefone', label: 'Telefone', type: 'tel' },
] as const

const fieldClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

export function WhatsAppQuoteForm({
  title,
  phone,
  description,
  eyebrow,
  contacts = [],
  submitLabel = 'Enviar no WhatsApp',
  disclaimer = 'Ao continuar, você será redirecionado ao WhatsApp com a mensagem pronta.',
  className,
}: WhatsAppQuoteFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const lines = [
      ...fields.map((field) => `*${field.label}:* ${data.get(field.name) ?? ''}`),
      `*Mensagem:* ${data.get('mensagem') ?? ''}`,
    ]
    const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className={cn('bg-foreground py-16 text-white md:py-24', className)}>
      <div className="container grid gap-12 lg:grid-cols-2">
        <div>
          {eyebrow ? (
            <p className="font-mono text-sm font-semibold uppercase tracking-widest text-primary">
              {'// '}
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          {description ? (
            <p className="mt-4 text-lg leading-8 text-white/70">{description}</p>
          ) : null}
          {contacts.length ? (
            <ul className="mt-8 grid gap-3">
              {contacts.map((contact) => {
                const content = (
                  <>
                    {contact.icon ? (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary [&_svg]:h-5 [&_svg]:w-5">
                        {contact.icon}
                      </span>
                    ) : null}
                    <span>{contact.label}</span>
                  </>
                )
                return (
                  <li key={contact.label}>
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="flex items-center gap-3 text-white/85 transition hover:translate-x-1 hover:text-white"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="flex items-center gap-3 text-white/85">{content}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:grid-cols-2 md:p-8"
        >
          {fields.map((field) => (
            <label key={field.name} className="grid gap-2 text-sm font-medium">
              {field.label}
              <input name={field.name} type={field.type} required className={fieldClass} />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-medium sm:col-span-2">
            Mensagem
            <textarea name="mensagem" rows={4} required className={fieldClass} />
          </label>
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover sm:col-span-2"
          >
            <MessageCircle className="h-4 w-4 transition group-hover:rotate-12" />
            {submitLabel}
          </button>
          {disclaimer ? (
            <p className="text-center text-xs text-white/50 sm:col-span-2">{disclaimer}</p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
