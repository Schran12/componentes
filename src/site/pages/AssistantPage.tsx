'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Bot,
  ExternalLink,
  LayoutTemplate,
  Loader2,
  MessageSquare,
  RefreshCcw,
  Send,
  Sparkles,
  User,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { streamLocalAnswer, type GeneratedLayout } from '../chat/localAssistant'
import { usePageTitle } from '../usePageTitle'

type ChatRole = 'user' | 'assistant'
type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  layout?: GeneratedLayout
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function linkifyLine(line: string) {
  const parts: Array<string | { href: string; label: string }> = []
  const pattern = /(\/(?:montar-pagina|templates|componentes)[^\s]*)/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(line))) {
    if (match.index > last) parts.push(line.slice(last, match.index))
    const href = match[1]
    parts.push({
      href,
      label: href.startsWith('/montar-pagina')
        ? 'Abrir no montador'
        : href.startsWith('/templates/')
          ? 'Usar template'
          : href,
    })
    last = match.index + match[0].length
  }
  if (last < line.length) parts.push(line.slice(last))
  return parts.length ? parts : [line]
}

function renderInline(text: string) {
  const nodes: ReactNode[] = []
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|_[^_]+_)/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const token = match[0]
    if (token.startsWith('`')) {
      nodes.push(
        <code key={key++} className="rounded bg-black/10 px-1 py-0.5 text-[12px]">
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>)
    } else {
      nodes.push(
        <em key={key++} className="text-muted-foreground">
          {token.slice(1, -1)}
        </em>,
      )
    }
    last = match.index + token.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function MessageBody({ content, layout }: { content: string; layout?: GeneratedLayout }) {
  const navigate = useNavigate()
  const lines = content.split('\n')

  return (
    <div className="space-y-1.5">
      {lines.map((line, index) => {
        if (!line.trim()) return <div key={index} className="h-1.5" />
        if (line.startsWith('### ')) {
          return (
            <p key={index} className="pt-1 text-sm font-bold">
              {line.slice(4)}
            </p>
          )
        }
        const chunks = linkifyLine(line)
        return (
          <p key={index} className="text-sm leading-6">
            {chunks.map((chunk, chunkIndex) => {
              if (typeof chunk === 'string')
                return <span key={chunkIndex}>{renderInline(chunk)}</span>
              return (
                <Link
                  key={chunkIndex}
                  to={chunk.href}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  {chunk.label}
                </Link>
              )
            })}
          </p>
        )
      })}
      {layout?.components.length ? (
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="button"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() =>
              navigate('/montar-pagina', {
                state: {
                  components: layout.components,
                  recipeId: layout.baseRecipeId ?? undefined,
                  palette: layout.palette,
                  styles: layout.styles,
                },
              })
            }
          >
            <LayoutTemplate className="mr-1.5 h-3.5 w-3.5" />
            Abrir no montador (com estilo)
            <ExternalLink className="ml-1.5 h-3.5 w-3.5 opacity-70" />
          </Button>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span
              className="inline-flex h-3.5 w-3.5 rounded-full border"
              style={{ background: layout.palette.primary }}
            />
            <span
              className="inline-flex h-3.5 w-3.5 rounded-full border"
              style={{ background: layout.palette.surface }}
            />
            <span>{layout.palette.label}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function AssistantPage() {
  usePageTitle('Assistente')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy])

  async function send(content: string) {
    const text = content.trim()
    if (!text || busy) return

    setInput('')
    const userMessage: ChatMessage = { id: newId(), role: 'user', content: text }
    const assistantId = newId()
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: 'assistant', content: '' },
    ])
    setBusy(true)

    try {
      const result = await streamLocalAnswer(text, (delta) => {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, content: message.content + delta } : message,
          ),
        )
      })
      if (result.layout) {
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, layout: result.layout } : message,
          ),
        )
      }
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: 'Não consegui responder. Tente de novo.' }
            : message,
        ),
      )
    } finally {
      setBusy(false)
      textareaRef.current?.focus()
    }
  }

  function reset() {
    setMessages([])
    setInput('')
  }

  return (
    <main id="conteudo" className="flex min-h-[calc(100vh-8rem)] flex-col">
      <section className="border-b bg-slate-950 text-white">
        <div className="container py-10 md:py-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
            <Sparkles className="h-3.5 w-3.5" />
            Assistente do catálogo
          </span>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Descreva — eu monto e estilizo.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
            Nicho, seções e visual (cores, escuro, arredondado…). O layout já sai com a estilização
            nos componentes.
          </p>
        </div>
      </section>

      <section className="container flex min-h-0 flex-1 flex-col gap-4 py-6 md:py-8">
        <div className="flex min-h-[28rem] flex-1 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-primary" />
              Conversa
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                Local
              </span>
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={reset} disabled={busy}>
              <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
              Nova conversa
            </Button>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {!messages.length ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-2 py-10 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bot className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-semibold">Descreva o site</p>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Nicho, seções e estilo (cores, escuro, moderno…). Eu monto o layout e aplico a
                    estilização nos componentes.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <article
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start',
                  )}
                >
                  {message.role === 'assistant' ? (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-4 w-4" />
                    </span>
                  ) : null}
                  <div
                    className={cn(
                      'max-w-[min(100%,42rem)] rounded-2xl px-3.5 py-2.5',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'border bg-muted/40',
                    )}
                  >
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {message.content}
                      </p>
                    ) : message.content ? (
                      <MessageBody content={message.content} layout={message.layout} />
                    ) : (
                      <p className="text-sm text-muted-foreground">…</p>
                    )}
                  </div>
                  {message.role === 'user' ? (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                      <User className="h-4 w-4" />
                    </span>
                  ) : null}
                </article>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-3">
            <form
              className="flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                void send(input)
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                rows={2}
                disabled={busy}
                placeholder="Ex.: preciso de um site pra minha funilaria com zap e fotos dos serviços…"
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void send(input)
                  }
                }}
                className="min-h-[2.75rem] flex-1 resize-none rounded-xl border bg-background px-3 py-2.5 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              />
              <Button type="submit" disabled={busy || !input.trim()} className="shrink-0">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Enviar</span>
              </Button>
            </form>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Enter envia · Shift+Enter nova linha ·{' '}
              <Link to="/montar-pagina" className="text-primary underline-offset-2 hover:underline">
                Montar página
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
