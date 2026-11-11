'use client'

import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export type ContactFormData = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}
export type ContactFormProps = {
  title?: string
  description?: string
  endpoint?: string
  submitLabel?: string
  onSubmit?: (data: ContactFormData) => Promise<void> | void
  onSuccess?: (data: ContactFormData) => void
  className?: string
}

export function ContactForm({
  title = 'Fale conosco',
  description,
  endpoint = '/api/contato',
  submitLabel = 'Enviar mensagem',
  onSubmit,
  onSuccess,
  className,
}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data: ContactFormData = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? ''),
    }
    setStatus('submitting')
    try {
      if (onSubmit) await onSubmit(data)
      else {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) throw new Error('Não foi possível enviar a mensagem.')
      }
      setStatus('success')
      form.reset()
      onSuccess?.(data)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      className={cn('rounded-2xl border bg-card p-6 shadow-sm md:p-8', className)}
      aria-labelledby="contact-form-title"
    >
      <h2 id="contact-form-title" className="text-2xl font-bold">
        {title}
      </h2>
      {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
      <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Nome
            <Input name="name" autoComplete="name" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            E-mail
            <Input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Telefone
            <Input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Assunto
            <Input name="subject" required />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Mensagem
          <Textarea name="message" rows={5} required />
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Enviando…' : submitLabel}
          </Button>
          <div aria-live="polite" className="text-sm">
            {status === 'success' ? (
              <p className="text-emerald-600">Mensagem enviada com sucesso.</p>
            ) : null}
            {status === 'error' ? (
              <p className="text-destructive">Não foi possível enviar. Tente novamente.</p>
            ) : null}
          </div>
        </div>
      </form>
    </section>
  )
}
