'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'

export type TabsShowcaseProps = {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>
  defaultTab?: string
  className?: string
}

export function TabsShowcase({ tabs, defaultTab, className }: TabsShowcaseProps) {
  const baseId = useId()
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id)
  const active = tabs.find((tab) => tab.id === activeTab)

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
    setActiveTab(tabs[nextIndex]?.id)
    document.getElementById(`${baseId}-tab-${tabs[nextIndex]?.id}`)?.focus()
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        role="tablist"
        aria-label="Conteúdo em abas"
        className="flex gap-1 overflow-x-auto border-b [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'border-b-2 border-transparent px-2 py-3 text-center text-sm font-medium leading-tight text-muted-foreground outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring max-sm:flex-1 sm:whitespace-nowrap sm:px-4',
              activeTab === tab.id && 'border-primary text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {active ? (
        <div
          id={`${baseId}-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.id}`}
          tabIndex={0}
          className="py-6 outline-none"
        >
          {active.content}
        </div>
      ) : null}
    </div>
  )
}
