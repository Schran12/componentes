'use client'

import type { FormEvent } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Check, ImageIcon, Send, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

export type SocialWorkspaceHeroProps = {
  eyebrow?: string
  title: string
  description: string
  emailPlaceholder?: string
  submitLabel?: string
  privacyText?: string
  secondaryAction?: { label: string; href: string }
  channels?: readonly string[]
  onSubmit?: (email: string) => void
  className?: string
}

export function SocialWorkspaceHero({
  eyebrow,
  title,
  description,
  emailPlaceholder = 'Digite seu e-mail',
  submitLabel = 'Começar gratuitamente',
  privacyText,
  secondaryAction,
  channels = [],
  onSubmit,
  className,
}: SocialWorkspaceHeroProps) {
  const [email, setEmail] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.(email)
  }

  return (
    <section
      className={cn(
        'overflow-hidden bg-[#fffdf8] pb-20 pt-24 text-[#1b1b1b] md:pb-28 md:pt-32',
        className,
      )}
    >
      <div className="container grid items-center gap-16 lg:grid-cols-[.9fr_1.1fr]">
        <div className="max-w-2xl">
          {eyebrow ? <p className="text-sm font-bold text-[#2f6fed]">{eyebrow}</p> : null}
          <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-[#4b4b4b]">{description}</p>

          <form onSubmit={handleSubmit} className="mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="social-workspace-email">
              E-mail
            </label>
            <input
              id="social-workspace-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={emailPlaceholder}
              className="min-h-12 flex-1 rounded-xl border-2 border-[#1b1b1b] bg-white px-4 text-sm outline-none transition placeholder:text-[#777] focus:border-[#2f6fed] focus:ring-4 focus:ring-[#2f6fed]/15"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2f6fed] px-6 text-sm font-bold text-white shadow-[4px_4px_0_#1b1b1b] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b1b] focus-visible:ring-offset-2"
            >
              {submitLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            {privacyText ? <p className="text-xs text-[#6b6b6b]">{privacyText}</p> : null}
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="text-xs font-bold text-[#2f6fed] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6fed]"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>

          {channels.length ? (
            <div className="mt-10 flex flex-wrap gap-2" aria-label="Canais compatíveis">
              {channels.map((channel) => (
                <span
                  key={channel}
                  className="rounded-full border border-[#dedbd2] bg-white px-3 py-1.5 text-xs font-semibold"
                >
                  {channel}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <div
            aria-hidden
            className="absolute -inset-10 -z-10 rotate-3 rounded-[4rem] bg-[#f4c95d]"
          />
          <div className="rounded-[2rem] border-2 border-[#1b1b1b] bg-white p-4 shadow-[10px_10px_0_#1b1b1b] sm:p-6">
            <div className="flex items-center justify-between border-b border-[#e5e2db] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f6fed] text-white">
                  <CalendarDays className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold">Calendário editorial</p>
                  <p className="text-xs text-[#777]">Visão semanal</p>
                </div>
              </div>
              <span className="rounded-full bg-[#e7f7ed] px-3 py-1 text-xs font-bold text-[#247a46]">
                8 agendados
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day, index) => (
                <div key={day} className="min-h-40 rounded-xl bg-[#f5f3ee] p-2">
                  <p className="text-center text-[10px] font-bold uppercase text-[#777]">{day}</p>
                  {index !== 1 ? (
                    <div
                      className={cn(
                        'mt-3 rounded-lg border border-[#1b1b1b]/10 p-2',
                        index % 2 ? 'bg-[#d9f2e2]' : 'bg-white',
                      )}
                    >
                      <div className="flex h-16 items-center justify-center rounded-md bg-[#dce7ff]">
                        {index === 2 ? (
                          <Sparkles className="h-5 w-5 text-[#2f6fed]" aria-hidden />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-[#2f6fed]" aria-hidden />
                        )}
                      </div>
                      <span className="mt-2 block h-1.5 w-full rounded bg-[#1b1b1b]/20" />
                      <span className="mt-1 block h-1.5 w-2/3 rounded bg-[#1b1b1b]/10" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="mt-3 flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-[#2f6fed] text-[#2f6fed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6fed]"
                      aria-label={`Adicionar publicação em ${day}`}
                    >
                      <Send className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#f5f3ee] p-3 text-xs font-semibold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2f6fed] text-white">
                <Check className="h-3.5 w-3.5" aria-hidden />
              </span>
              Seu conteúdo está organizado e pronto para publicar.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
