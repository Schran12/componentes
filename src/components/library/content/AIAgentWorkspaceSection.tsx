import Link from 'next/link'
import { ArrowRight, Bot, CheckCircle2, Sparkles, Wrench } from 'lucide-react'

import { cn } from '@/lib/utils'

export type AgentCapability = {
  title: string
  description: string
}

export type AIAgentWorkspaceSectionProps = {
  eyebrow?: string
  title: string
  description: string
  prompt?: string
  result?: string
  capabilities?: readonly AgentCapability[]
  tools?: readonly string[]
  action?: { label: string; href: string }
  className?: string
}

export function AIAgentWorkspaceSection({
  eyebrow,
  title,
  description,
  prompt = 'Organize minhas tarefas prioritárias e bloqueie tempo no calendário.',
  result = 'Encontrei 5 tarefas prioritárias e preparei blocos de foco para amanhã.',
  capabilities = [],
  tools = [],
  action,
  className,
}: AIAgentWorkspaceSectionProps) {
  return (
    <section
      className={cn(
        'overflow-hidden bg-gradient-to-b from-[#19191d] to-[#08080a] py-20 text-white md:py-28',
        className,
      )}
    >
      <div className="container grid items-center gap-14 lg:grid-cols-[.88fr_1.12fr]">
        <div>
          {eyebrow ? <p className="text-sm font-semibold text-[#ff6b63]">{eyebrow}</p> : null}
          <h2 className="mt-5 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{title}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/55">{description}</p>

          {capabilities.length ? (
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {capabilities.slice(0, 4).map((capability) => (
                <div key={capability.title}>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4 text-[#ff6b63]" aria-hidden />
                    {capability.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{capability.description}</p>
                </div>
              ))}
            </div>
          ) : null}

          {action ? (
            <Link
              href={action.href}
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b63]"
            >
              {action.label}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className="relative">
          <div aria-hidden className="absolute -inset-12 rounded-full bg-[#7c4dff]/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#151518] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff6b63] to-[#7c4dff]">
                  <Bot className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold">Agente de produtividade</p>
                  <p className="text-[10px] text-white/35">Ferramentas conectadas</p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-[#8ee3a8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4dcc72]" />
                Ativo
              </span>
            </div>

            <div className="space-y-5 p-5 sm:p-7">
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-white p-4 text-sm leading-6 text-black">
                {prompt}
              </div>

              <div className="space-y-2">
                {tools.slice(0, 3).map((tool, index) => (
                  <div
                    key={tool}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] p-3 text-xs"
                  >
                    <Wrench className="h-4 w-4 text-[#ff6b63]" aria-hidden />
                    <span className="flex-1 text-white/65">{tool}</span>
                    <CheckCircle2 className="h-4 w-4 text-[#4dcc72]" aria-hidden />
                    <span className="text-white/25">{index + 1}</span>
                  </div>
                ))}
              </div>

              <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-white/10 p-4 text-sm leading-6 text-white/75">
                {result}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
