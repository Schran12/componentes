import type { ReactNode } from 'react'
import { Clock3, Mail, MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'

export type ContactInfoBarItem = {
  label: string
  value: ReactNode
  href?: string
  icon?: ReactNode
}

export type ContactInfoBarProps = {
  items: readonly ContactInfoBarItem[]
  variant?: 'primary' | 'dark' | 'light'
  className?: string
}

const defaultIcons = [MapPin, Mail, Clock3]

export function ContactInfoBar({ items, variant = 'primary', className }: ContactInfoBarProps) {
  return (
    <aside
      className={cn(
        'border-b text-xs',
        variant === 'primary' && 'border-primary-foreground/10 bg-primary text-primary-foreground',
        variant === 'dark' && 'border-white/10 bg-[#10100e] text-white',
        variant === 'light' && 'bg-muted/60 text-muted-foreground',
        className,
      )}
      aria-label="Informações de contato"
    >
      <div className="container flex min-h-10 flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2 md:justify-between">
        {items.map((item, index) => {
          const Icon = defaultIcons[index % defaultIcons.length]
          const content = (
            <>
              {item.icon ?? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              <span className="font-medium">{item.label}:</span>
              <span className="opacity-75">{item.value}</span>
            </>
          )

          return item.href ? (
            <a
              key={`${item.label}-${index}`}
              href={item.href}
              className="flex items-center gap-1.5 rounded-sm transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
              {content}
            </a>
          ) : (
            <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {content}
            </span>
          )
        })}
      </div>
    </aside>
  )
}
