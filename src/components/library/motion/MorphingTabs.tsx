'use client'

import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type MorphingTab = {
  id: string
  label: string
  content: ReactNode
}

export type MorphingTabsProps = {
  items: MorphingTab[]
  defaultValue?: string
  className?: string
}

export function MorphingTabs({ items, defaultValue, className }: MorphingTabsProps) {
  const generatedId = useId()
  const reduceMotion = useReducedMotion()
  const [activeId, setActiveId] = useState(defaultValue ?? items[0]?.id)
  const activeItem = items.find((item) => item.id === activeId) ?? items[0]

  if (!activeItem) return null

  return (
    <div className={cn('w-full', className)}>
      <div
        role="tablist"
        aria-label="Conteúdo em abas"
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border bg-muted/50 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const selected = item.id === activeItem.id
          return (
            <button
              type="button"
              role="tab"
              id={`${generatedId}-tab-${item.id}`}
              aria-controls={`${generatedId}-panel-${item.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              className="relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              key={item.id}
            >
              {selected ? (
                <motion.span
                  layoutId={`${generatedId}-active-tab`}
                  className="absolute inset-0 rounded-lg bg-background shadow-sm"
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                />
              ) : null}
              <span className="relative">{item.label}</span>
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        id={`${generatedId}-panel-${activeItem.id}`}
        aria-labelledby={`${generatedId}-tab-${activeItem.id}`}
        className="mt-4 overflow-hidden rounded-2xl border bg-card p-6 md:p-10"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            {activeItem.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
