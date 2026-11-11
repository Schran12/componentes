'use client'

import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { GripVertical, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type AnimatedListItem = {
  id: string
  title: string
  description?: string
}

export type AnimatedListProps = {
  initialItems: AnimatedListItem[]
  allowAdd?: boolean
  allowRemove?: boolean
  addLabel?: string
  className?: string
  onChange?: (items: AnimatedListItem[]) => void
}

export function AnimatedList({
  initialItems,
  allowAdd = true,
  allowRemove = true,
  addLabel = 'Adicionar item',
  className,
  onChange,
}: AnimatedListProps) {
  const [items, setItems] = useState(initialItems)
  const [listRef] = useAutoAnimate<HTMLUListElement>()

  function updateItems(nextItems: AnimatedListItem[]) {
    setItems(nextItems)
    onChange?.(nextItems)
  }

  function addItem() {
    const index = items.length + 1
    updateItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        title: `Novo item ${index}`,
        description: 'Conteúdo adicionado com transição automática.',
      },
    ])
  }

  return (
    <div className={cn('space-y-3', className)}>
      <ul ref={listRef} className="space-y-2" aria-live="polite">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm"
          >
            <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.title}</p>
              {item.description ? (
                <p className="truncate text-sm text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
            {allowRemove ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => updateItems(items.filter((current) => current.id !== item.id))}
                aria-label={`Remover ${item.title}`}
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
      {allowAdd ? (
        <Button type="button" size="sm" variant="outline" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      ) : null}
    </div>
  )
}
