'use client'

import { Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComponentPreview } from '../ComponentPreview'
import { PreviewDialog } from '../PreviewDialog'
import type { CatalogComponent } from '../manifest'

export type BuilderOptionCardProps = {
  component: CatalogComponent
  selected: boolean
  onToggle: () => void
}

export function BuilderOptionCard({ component, selected, onToggle }: BuilderOptionCardProps) {
  return (
    <article
      className={cn(
        'flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition',
        selected
          ? 'border-primary ring-2 ring-primary/40'
          : 'hover:border-primary/30 hover:shadow-md',
      )}
    >
      <div
        onClick={onToggle}
        aria-hidden="true"
        className="relative h-44 min-w-0 cursor-pointer overflow-hidden border-b bg-white"
      >
        <div className="preview-light pointer-events-none absolute left-0 top-0 flex h-[528px] w-[300%] origin-top-left scale-[0.333333] flex-col overflow-hidden p-8">
          <div className="my-auto w-full">
            <ComponentPreview id={component.id} />
          </div>
        </div>
        <span
          className={cn(
            'absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm transition',
            selected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'bg-background/90 text-muted-foreground',
          )}
        >
          {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3">
        <h3 className="truncate text-sm font-semibold">{component.name}</h3>
        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{component.id}</p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {component.description}
        </p>
        <div className="mt-auto grid grid-cols-2 gap-1.5 pt-3">
          <PreviewDialog title={`Preview de ${component.name}`} triggerLabel="Ver">
            <div className="p-4 md:p-8">
              <ComponentPreview id={component.id} />
            </div>
          </PreviewDialog>
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={selected}
            aria-label={`${selected ? 'Remover' : 'Adicionar'} ${component.name}`}
            className={cn(
              'inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border bg-background hover:bg-muted',
            )}
          >
            {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {selected ? 'Na página' : 'Adicionar'}
          </button>
        </div>
      </div>
    </article>
  )
}
