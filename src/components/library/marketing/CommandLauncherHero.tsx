'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Command, Search, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

export type LauncherCommand = {
  id: string
  label: string
  category?: string
  shortcut?: string
  icon?: ReactNode
}

export type CommandLauncherHeroProps = {
  eyebrow?: string
  title: string
  description: string
  commands: readonly LauncherCommand[]
  searchPlaceholder?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  className?: string
}

export function CommandLauncherHero({
  eyebrow,
  title,
  description,
  commands,
  searchPlaceholder = 'Busque comandos, aplicativos e ações...',
  primaryAction,
  secondaryAction,
  className,
}: CommandLauncherHeroProps) {
  const [query, setQuery] = useState('')
  const visibleCommands = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR')
    if (!normalized) return commands.slice(0, 6)
    return commands
      .filter((command) =>
        `${command.label} ${command.category ?? ''}`
          .toLocaleLowerCase('pt-BR')
          .includes(normalized),
      )
      .slice(0, 6)
  }, [commands, query])

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-[#08080a] pb-24 pt-28 text-white md:pb-32 md:pt-36',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-[-35%] -z-10 mx-auto h-[760px] max-w-5xl rounded-full bg-[radial-gradient(circle_at_center,rgba(255,75,75,.5),rgba(117,53,255,.25)_38%,transparent_68%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:42px_42px]"
      />

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {eyebrow ? <p className="text-sm font-semibold text-[#ff6b63]">{eyebrow}</p> : null}
          <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-8xl">
            {title}
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-white/55">{description}</p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {primaryAction ? (
              <Link
                href={primaryAction.href}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b63] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {primaryAction.label}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute -inset-8 -z-10 rounded-full bg-[#ff4f47]/15 blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#151518]/95 shadow-[0_40px_100px_-30px_rgba(0,0,0,.9)] backdrop-blur-xl">
            <label className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-5 w-5 text-white/35" aria-hidden />
              <span className="sr-only">Buscar comandos</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
              />
              <kbd className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] text-white/45">
                esc
              </kbd>
            </label>

            <div className="p-2">
              {visibleCommands.length ? (
                visibleCommands.map((command, index) => (
                  <button
                    key={command.id}
                    type="button"
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b63]',
                      index === 0 ? 'bg-white/10' : 'hover:bg-white/5',
                    )}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff6b63] to-[#7c4dff] text-white">
                      {command.icon ?? <Sparkles className="h-4 w-4" aria-hidden />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{command.label}</span>
                      {command.category ? (
                        <span className="mt-0.5 block text-xs text-white/35">
                          {command.category}
                        </span>
                      ) : null}
                    </span>
                    {command.shortcut ? (
                      <kbd className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/45">
                        {command.shortcut}
                      </kbd>
                    ) : null}
                  </button>
                ))
              ) : (
                <p className="px-4 py-10 text-center text-sm text-white/40">
                  Nenhum comando encontrado.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[10px] text-white/30">
              <span className="flex items-center gap-1.5">
                <Command className="h-3 w-3" aria-hidden />
                Atalho global
              </span>
              <span>↑↓ navegar · ↵ abrir</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
