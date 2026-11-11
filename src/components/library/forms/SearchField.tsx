'use client'

import { useId, useState, type FormEvent, type HTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchFieldProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  label?: string
  placeholder?: string
  defaultValue?: string
  value?: string
  size?: 'sm' | 'md' | 'lg'
  showSubmitButton?: boolean
  submitLabel?: string
  loading?: boolean
  onValueChange?: (value: string) => void
  onSubmit: (value: string) => void
  onClear?: () => void
}

export function SearchField({
  label = 'Buscar',
  placeholder = 'Digite para buscar…',
  defaultValue = '',
  value,
  size = 'md',
  showSubmitButton = false,
  submitLabel = 'Buscar',
  loading = false,
  onValueChange,
  onSubmit,
  onClear,
  className,
  ...props
}: SearchFieldProps) {
  const id = useId()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = value ?? internalValue

  function updateValue(nextValue: string) {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(currentValue.trim())
  }

  return (
    <form
      role="search"
      className={cn('flex w-full items-stretch gap-2', className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          value={currentValue}
          placeholder={placeholder}
          disabled={loading}
          onChange={(event) => updateValue(event.target.value)}
          className={cn(
            'flex w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm ring-offset-background transition-shadow placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50',
            size === 'sm' && 'h-9',
            size === 'md' && 'h-10',
            size === 'lg' && 'h-12 text-base',
          )}
        />
        {currentValue ? (
          <button
            type="button"
            aria-label="Limpar busca"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => {
              updateValue('')
              onClear?.()
            }}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {showSubmitButton ? (
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Buscando…' : submitLabel}
        </button>
      ) : null}
    </form>
  )
}
