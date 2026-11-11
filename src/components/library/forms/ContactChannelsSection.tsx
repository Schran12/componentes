'use client'

import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CheckCircle2, MessageCircle, Send } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AccentButton } from '@/components/library/primitives/AccentButton'
import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

const contactSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  subject: yup.string().required('Assunto é obrigatório'),
  message: yup.string().required('Mensagem é obrigatória'),
})

export type ContactChannelsFormData = yup.InferType<typeof contactSchema>

export type ContactChannel = {
  label: string
  value: string
  icon: ReactNode
  href?: string
  external?: boolean
}

export type ContactChannelsSectionProps = {
  title: string
  onSubmit: (data: ContactChannelsFormData) => Promise<void> | void
  channels?: readonly ContactChannel[]
  eyebrow?: string
  description?: string
  formTitle?: string
  channelsTitle?: string
  channelsDescription?: string
  whatsapp?: { href: string; label?: string }
  successTitle?: string
  successDescription?: string
  layout?: 'cards' | 'joined'
  tone?: AccentTone
  className?: string
}

const fields = [
  { name: 'name', label: 'Nome', placeholder: 'Seu nome completo', type: 'text' },
  { name: 'email', label: 'E-mail', placeholder: 'Seu e-mail', type: 'email' },
  { name: 'phone', label: 'Telefone', placeholder: 'Seu telefone', type: 'tel' },
  { name: 'subject', label: 'Assunto', placeholder: 'Assunto da mensagem', type: 'text' },
] as const

/** Seção de contato com formulário validado (react-hook-form + yup) e lista de canais. */
export function ContactChannelsSection({
  title,
  onSubmit,
  channels = [],
  eyebrow,
  description,
  formTitle,
  channelsTitle = 'Informações de contato',
  channelsDescription,
  whatsapp,
  successTitle = 'Mensagem enviada',
  successDescription = 'Obrigado pelo contato. Nossa equipe retornará em breve.',
  layout = 'cards',
  tone = 'glow',
  className,
}: ContactChannelsSectionProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'
  const joined = layout === 'joined'
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactChannelsFormData>({ resolver: yupResolver(contactSchema) })

  const submit = async (data: ContactChannelsFormData): Promise<void> => {
    setSubmitError(null)
    try {
      await onSubmit(data)
      setIsSubmitted(true)
      reset()
    } catch {
      setSubmitError('Não foi possível enviar sua mensagem. Tente novamente.')
    }
  }

  const label = cn('mb-2 block text-[0.65rem] uppercase tracking-[0.2em]', t.muted)
  const field = cn('h-12', t.input)
  const darkPanel = joined && tone === 'industrial'
  const channelText = darkPanel
    ? {
        label: 'text-slate-400',
        value: 'text-white',
        icon: 'text-amber-500',
        border: 'border-white/10',
      }
    : { label: t.muted, value: t.strong, icon: t.accent, border: t.border }

  return (
    <section className={cn('w-full', t.section, className)}>
      <div className="container py-14 lg:py-16">
        <EyebrowHeading
          tone={tone}
          eyebrow={eyebrow}
          title={title}
          description={description}
          layout="split"
          className="mb-10 lg:mb-12"
        />

        {isSubmitted ? (
          <div
            className={cn(
              'mx-auto max-w-2xl border px-8 py-14 text-center sm:px-12',
              t.panel,
              t.border,
              isGlow && 'rounded-xl',
            )}
            role="status"
          >
            <CheckCircle2 className={cn('mx-auto mb-6 h-10 w-10', t.accent)} aria-hidden />
            <h3 className={cn('text-3xl', t.heading, isGlow && 'mx-auto')}>{successTitle}</h3>
            <p className={cn('mt-4 text-base leading-relaxed', t.body)}>{successDescription}</p>
            <AccentButton
              tone={tone}
              onClick={() => setIsSubmitted(false)}
              icon={<Send className="h-4 w-4" />}
              className="mx-auto mt-8"
            >
              Enviar nova mensagem
            </AccentButton>
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 lg:grid-cols-12',
              joined ? cn('border', t.border) : 'gap-10 lg:gap-12',
            )}
          >
            <div
              className={cn(
                'p-6 sm:p-8 lg:col-span-7 lg:p-10',
                t.panel,
                !joined && cn('border', t.border, isGlow && 'rounded-xl'),
              )}
            >
              {formTitle ? <h3 className={cn('mb-6 text-2xl', t.heading)}>{formTitle}</h3> : null}
              <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  {fields.map((item) => {
                    const error = errors[item.name]?.message
                    const id = `contact-${item.name}`
                    return (
                      <div key={item.name}>
                        <label htmlFor={id} className={label}>
                          {item.label}
                        </label>
                        <Input
                          id={id}
                          type={item.type}
                          placeholder={item.placeholder}
                          aria-invalid={Boolean(error)}
                          aria-describedby={error ? `${id}-error` : undefined}
                          className={field}
                          {...register(item.name)}
                        />
                        {error ? (
                          <p id={`${id}-error`} className={cn('mt-1.5 text-sm', t.error)}>
                            {error}
                          </p>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
                <div>
                  <label htmlFor="contact-message" className={label}>
                    Mensagem
                  </label>
                  <Textarea
                    id="contact-message"
                    rows={6}
                    placeholder="Descreva sua necessidade"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    className={cn(t.input, 'min-h-[160px] resize-y py-3')}
                    {...register('message')}
                  />
                  {errors.message?.message ? (
                    <p id="contact-message-error" className={cn('mt-1.5 text-sm', t.error)}>
                      {errors.message.message}
                    </p>
                  ) : null}
                </div>
                {submitError ? (
                  <p className={cn('text-sm', t.error)} role="alert">
                    {submitError}
                  </p>
                ) : null}
                <div className="flex justify-center pt-1">
                  <AccentButton
                    tone={tone}
                    type="submit"
                    disabled={isSubmitting}
                    icon={<Send className="h-4 w-4" />}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                  </AccentButton>
                </div>
              </form>
            </div>

            <div
              className={cn(
                'lg:col-span-5',
                joined &&
                  cn(
                    'border-t p-7 sm:p-8 lg:border-l lg:border-t-0 lg:p-10',
                    t.border,
                    darkPanel ? 'bg-slate-950 text-white' : t.alt,
                  ),
              )}
            >
              <h3
                className={cn(
                  'text-2xl',
                  darkPanel ? 'font-semibold uppercase tracking-wide text-white' : t.heading,
                )}
              >
                {channelsTitle}
              </h3>
              {channelsDescription ? (
                <p
                  className={cn(
                    'mt-4 text-sm leading-relaxed lg:text-base',
                    darkPanel ? 'text-slate-300' : t.body,
                  )}
                >
                  {channelsDescription}
                </p>
              ) : null}

              {channels.length ? (
                <ul
                  className={cn(
                    'mt-8 divide-y',
                    channelText.border,
                    darkPanel ? 'divide-white/10 border-y' : t.divide,
                    !joined && cn('border', t.panel, isGlow && 'rounded-xl'),
                    joined && !darkPanel && 'border-y',
                  )}
                >
                  {channels.map((channel) => {
                    const content = (
                      <>
                        <span
                          className={cn(
                            'mt-0.5 h-5 w-5 shrink-0 [&>svg]:h-5 [&>svg]:w-5',
                            channelText.icon,
                          )}
                          aria-hidden
                        >
                          {channel.icon}
                        </span>
                        <span>
                          <span
                            className={cn(
                              'block text-[0.65rem] uppercase tracking-[0.18em]',
                              channelText.label,
                            )}
                          >
                            {channel.label}
                          </span>
                          <span
                            className={cn(
                              'mt-1 block text-sm font-medium sm:text-base',
                              channelText.value,
                            )}
                          >
                            {channel.value}
                          </span>
                        </span>
                      </>
                    )
                    return (
                      <li key={channel.label} className={cn(joined ? 'py-5' : 'p-5 sm:p-6')}>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            target={channel.external ? '_blank' : undefined}
                            rel={channel.external ? 'noopener noreferrer' : undefined}
                            className={cn(
                              'flex items-start gap-4 transition-opacity hover:opacity-80',
                              t.focus,
                            )}
                          >
                            {content}
                          </a>
                        ) : (
                          <div className="flex items-start gap-4">{content}</div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : null}

              {whatsapp ? (
                <AccentButton
                  tone={darkPanel ? 'industrial-dark' : tone}
                  href={whatsapp.href}
                  external
                  icon={<MessageCircle className="h-4 w-4" />}
                  className="mt-8"
                >
                  {whatsapp.label ?? 'Conversar no WhatsApp'}
                </AccentButton>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
