'use client'

import { useId, useState, type FormEvent, type HTMLAttributes } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface NewsletterFormProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  title?: string
  description?: string
  placeholder?: string
  submitLabel?: string
  successMessage?: string
  errorMessage?: string
  variant?: 'inline' | 'card'
  consentLabel?: string
  onSubmit: (email: string) => Promise<void> | void
}

export function NewsletterForm({
  title = 'Receba nossas novidades',
  description,
  placeholder = 'voce@empresa.com',
  submitLabel = 'Inscrever-se',
  successMessage = 'Inscrição realizada com sucesso.',
  errorMessage = 'Não foi possível concluir a inscrição.',
  variant = 'card',
  consentLabel,
  onSubmit,
  className,
  ...props
}: NewsletterFormProps) {
  const id = useId()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = String(new FormData(form).get('email') ?? '')
    setStatus('loading')
    try {
      await onSubmit(email)
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className={cn(
        variant === 'card' && 'rounded-2xl border bg-card p-6 shadow-sm md:p-8',
        className,
      )}
      {...props}
    >
      {title ? <h2 className="text-2xl font-bold tracking-tight">{title}</h2> : null}
      {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
      <form className="mt-5" onSubmit={handleSubmit}>
        <label htmlFor={id} className="sr-only">
          E-mail
        </label>
        <div
          className={cn('flex gap-2', variant === 'inline' ? 'flex-col sm:flex-row' : 'flex-col')}
        >
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={placeholder}
            aria-describedby={`${id}-status`}
          />
          <Button type="submit" disabled={status === 'loading'} className="shrink-0">
            {status === 'loading' ? 'Enviando…' : submitLabel}
            {status !== 'loading' ? (
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            ) : null}
          </Button>
        </div>
        {consentLabel ? (
          <label className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              required
              className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
            />
            <span>{consentLabel}</span>
          </label>
        ) : null}
        <div id={`${id}-status`} aria-live="polite" className="mt-3 min-h-5 text-sm">
          {status === 'success' ? (
            <p className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              {successMessage}
            </p>
          ) : null}
          {status === 'error' ? <p className="text-destructive">{errorMessage}</p> : null}
        </div>
      </form>
    </div>
  )
}
