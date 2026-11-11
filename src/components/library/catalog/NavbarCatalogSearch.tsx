'use client'

import { Search, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { catalogSearch, useCatalogSearch } from './catalogSearchStore'

const catalogPath = '/componentes'

export function CatalogSearch() {
  const query = useCatalogSearch()
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  function update(next: string) {
    catalogSearch.set(next)
    if (next && pathname !== catalogPath) router.push(catalogPath)
  }

  return (
    <label className="relative block w-full">
      <span className="sr-only">Buscar componentes</span>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => update(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            update('')
            inputRef.current?.blur()
          }
          if (event.key === 'Enter' && pathname !== catalogPath) router.push(catalogPath)
        }}
        placeholder="Buscar componentes…"
        title="Busca por nome, ID, prop, recurso ou dependência; aceita termos sem acento."
        autoComplete="off"
        spellCheck={false}
        className="h-9 w-full rounded-lg border bg-muted/40 pl-9 pr-9 text-sm outline-none transition placeholder:text-muted-foreground focus:bg-background focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            update('')
            inputRef.current?.focus()
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Limpar busca"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border bg-background px-1.5 text-[11px] font-medium text-muted-foreground sm:inline">
          /
        </kbd>
      )}
    </label>
  )
}
