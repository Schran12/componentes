import Link from 'next/link'
import { ArrowRight, Bot, CheckCircle2, Send, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

export type WorkflowStep = {
  label: string
  description: string
}

export type ConversationalWorkflowSectionProps = {
  eyebrow?: string
  title: string
  description: string
  prompt?: string
  response?: string
  steps?: readonly WorkflowStep[]
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  className?: string
}

export function ConversationalWorkflowSection({
  eyebrow,
  title,
  description,
  prompt = 'Analise meu conteúdo recente e sugira o próximo plano editorial.',
  response = 'Encontrei os formatos com melhor desempenho e preparei novas ideias para sua fila.',
  steps = [],
  primaryAction,
  secondaryAction,
  className,
}: ConversationalWorkflowSectionProps) {
  return (
    <section className={cn('overflow-hidden bg-[#1b1b1b] py-20 text-white md:py-28', className)}>
      <div className="container grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr]">
        <div>
          {eyebrow ? <p className="text-sm font-bold text-[#f4c95d]">{eyebrow}</p> : null}
          <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">{description}</p>

          {steps.length ? (
            <ol className="mt-9 grid gap-4">
              {steps.slice(0, 3).map((step, index) => (
                <li key={`${step.label}-${index}`} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f4c95d] text-xs font-black text-[#1b1b1b]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.label}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/50">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-4">
            {primaryAction ? (
              <Link
                href={primaryAction.href}
                className="inline-flex items-center gap-2 rounded-xl bg-[#f4c95d] px-5 py-3 text-sm font-bold text-[#1b1b1b] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {primaryAction.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center gap-2 px-3 py-3 text-sm font-bold text-white transition hover:text-[#f4c95d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative">
          <div aria-hidden className="absolute -inset-10 rounded-full bg-[#2f6fed]/30 blur-3xl" />
          <div className="relative rounded-[2rem] border-2 border-white/20 bg-[#262626] p-4 shadow-2xl sm:p-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f6fed]">
                <Bot className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold">Assistente de conteúdo</p>
                <p className="text-xs text-white/45">Dados e publicação conectados</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-[#2f6fed] p-4 text-sm leading-6">
                {prompt}
              </div>
              <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-white p-5 text-[#1b1b1b]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2f6fed]">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  Resposta baseada nos seus dados
                </div>
                <p className="mt-3 text-sm leading-6 text-[#555]">{response}</p>
                <div className="mt-5 grid gap-2">
                  {['Carrossel educativo', 'Vídeo curto', 'Bastidores da equipe'].map((idea) => (
                    <div
                      key={idea}
                      className="flex items-center justify-between rounded-xl bg-[#f5f3ee] p-3 text-xs font-semibold"
                    >
                      {idea}
                      <CheckCircle2 className="h-4 w-4 text-[#247a46]" aria-hidden />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/15 bg-[#1b1b1b] p-3">
              <span className="flex-1 text-xs text-white/35">Envie uma nova mensagem...</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4c95d] text-[#1b1b1b]">
                <Send className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
