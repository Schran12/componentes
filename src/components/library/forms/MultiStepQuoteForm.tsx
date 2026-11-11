'use client'

import { useRef, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type QuoteField = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  options?: string[]
  placeholder?: string
  required?: boolean
  fullWidth?: boolean
}

export type QuoteStep = { title: string; fields: QuoteField[] }

export type MultiStepQuoteFormProps = {
  title?: string
  steps: QuoteStep[]
  onSubmit: (data: Record<string, string>) => Promise<void> | void
  previousLabel?: string
  nextLabel?: string
  submitLabel?: string
  successTitle?: string
  successDescription?: string
  errorMessage?: string
  className?: string
}

const fieldClass =
  'w-full rounded-xl border bg-background px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

export function MultiStepQuoteForm({
  title,
  steps,
  onSubmit,
  previousLabel = 'Anterior',
  nextLabel = 'Próximo',
  submitLabel = 'Enviar',
  successTitle = 'Recebemos sua solicitação!',
  successDescription = 'Nossa equipe entrará em contato em breve.',
  errorMessage = 'Não foi possível enviar. Tente novamente.',
  className,
}: MultiStepQuoteFormProps) {
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const reduceMotion = useReducedMotion()
  const isLast = step === steps.length - 1

  function validateStep() {
    const fieldset = formRef.current?.querySelector<HTMLFieldSetElement>(`[data-step="${step}"]`)
    const invalid = fieldset?.querySelector<HTMLInputElement>(':invalid')
    invalid?.reportValidity()
    return !invalid
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validateStep()) return
    if (!isLast) {
      setStep(step + 1)
      return
    }
    setStatus('loading')
    try {
      const data = Object.fromEntries(
        Array.from(new FormData(event.currentTarget), ([key, value]) => [key, String(value)]),
      )
      await onSubmit(data)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className={cn('rounded-3xl border bg-card p-10 text-center shadow-xl', className)}
        role="status"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-2xl font-bold">{successTitle}</h3>
        <p className="mt-2 text-muted-foreground">{successDescription}</p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      className={cn('rounded-3xl border bg-card p-6 shadow-xl md:p-10', className)}
    >
      {title ? <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2> : null}

      <ol className="mt-6 flex items-center gap-2">
        {steps.map((item, index) => (
          <li key={item.title} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition',
                index <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
              aria-current={index === step ? 'step' : undefined}
            >
              {index < step ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            {index < steps.length - 1 ? (
              <span className="h-0.5 flex-1 overflow-hidden rounded bg-muted">
                <motion.span
                  className="block h-full bg-primary"
                  animate={{ width: index < step ? '100%' : '0%' }}
                  transition={{ duration: reduceMotion ? 0 : 0.4 }}
                />
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="relative mt-8">
        {steps.map((item, index) => (
          <fieldset key={item.title} data-step={index} hidden={index !== step}>
            <legend className="text-lg font-semibold">
              {index + 1}. {item.title}
            </legend>
            <motion.div
              initial={false}
              animate={
                index === step ? { opacity: 1, x: 0 } : { opacity: 0, x: reduceMotion ? 0 : 24 }
              }
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className="mt-5 grid gap-4 sm:grid-cols-2"
            >
              {item.fields.map((field) => (
                <label
                  key={field.name}
                  className={cn(
                    'grid gap-2 text-sm font-medium',
                    (field.fullWidth || field.type === 'textarea') && 'sm:col-span-2',
                  )}
                >
                  <span>
                    {field.label}
                    {field.required ? <span className="text-primary"> *</span> : null}
                  </span>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      rows={4}
                      className={fieldClass}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      required={field.required}
                      defaultValue=""
                      className={fieldClass}
                    >
                      <option value="" disabled>
                        {field.placeholder ?? 'Selecione'}
                      </option>
                      {field.options?.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={field.name}
                      type={field.type ?? 'text'}
                      required={field.required}
                      placeholder={field.placeholder}
                      className={fieldClass}
                    />
                  )}
                </label>
              ))}
            </motion.div>
          </fieldset>
        ))}
      </div>

      {status === 'error' ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="rounded-full border px-6 py-3 text-sm font-semibold transition hover:border-primary hover:text-primary disabled:invisible"
        >
          {previousLabel}
        </button>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
        >
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLast ? submitLabel : nextLabel}
        </button>
      </div>
    </form>
  )
}
