import type { ReactNode } from 'react'
import { Clock, Mail, Phone } from 'lucide-react'

import { cn } from '@/lib/utils'

export type TopBarItem = {
  label: string
  href?: string
  icon?: ReactNode
  /** Empurra o item para a direita (útil para horário). */
  align?: 'start' | 'end'
}

export type TopBarProps = {
  items: readonly TopBarItem[]
  /** Aparência da faixa. */
  variant?: 'dark' | 'slate' | 'primary'
  className?: string
}

const variants = {
  dark: {
    bar: 'border-b border-white/10 bg-[#0f172a] text-white',
    icon: 'text-amber-500',
    link: 'hover:text-amber-100',
  },
  slate: {
    bar: 'border-b border-slate-800 bg-slate-900 text-slate-300',
    icon: 'text-amber-500',
    link: 'hover:text-white',
  },
  primary: {
    bar: 'border-b border-primary-foreground/10 bg-primary text-primary-foreground',
    icon: 'text-primary-foreground/90',
    link: 'hover:opacity-90',
  },
} as const

/** Faixa superior compacta para telefone, e-mail, horário e outros atalhos. */
export function TopBar({ items, variant = 'dark', className }: TopBarProps) {
  const skin = variants[variant]
  const start = items.filter((item) => item.align !== 'end')
  const end = items.filter((item) => item.align === 'end')

  return (
    <aside className={cn('text-sm', skin.bar, className)} aria-label="Barra superior">
      <div className="container flex min-h-10 flex-wrap items-center gap-x-6 gap-y-2 py-2">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {start.map((item) => (
            <TopBarLink key={item.label} item={item} skin={skin} />
          ))}
        </div>
        {end.length ? (
          <div className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-2">
            {end.map((item) => (
              <TopBarLink key={item.label} item={item} skin={skin} />
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  )
}

function TopBarLink({
  item,
  skin,
}: {
  item: TopBarItem
  skin: (typeof variants)[keyof typeof variants]
}) {
  const body = (
    <>
      <span className={cn('shrink-0', skin.icon)} aria-hidden>
        {item.icon}
      </span>
      {item.label}
    </>
  )

  if (item.href) {
    return (
      <a
        href={item.href}
        className={cn(
          'inline-flex items-center gap-2 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          skin.link,
        )}
      >
        {body}
      </a>
    )
  }

  return <span className="inline-flex items-center gap-2">{body}</span>
}

/** Atalho com telefone, e-mail e horário no layout clássico. */
export function TopBarContacts({
  phone,
  phoneHref,
  email,
  hours,
  variant = 'dark',
  className,
}: {
  phone?: string
  phoneHref?: string
  email?: string
  hours?: string
  variant?: TopBarProps['variant']
  className?: string
}) {
  const items: TopBarItem[] = [
    phone
      ? {
          label: phone,
          href: `tel:${phoneHref ?? phone.replace(/\D/g, '')}`,
          icon: <Phone className="h-3.5 w-3.5" />,
        }
      : null,
    email
      ? {
          label: email,
          href: `mailto:${email}`,
          icon: <Mail className="h-3.5 w-3.5" />,
        }
      : null,
    hours
      ? {
          label: hours,
          icon: <Clock className="h-3.5 w-3.5" />,
          align: 'end' as const,
        }
      : null,
  ].filter(Boolean) as TopBarItem[]

  return <TopBar items={items} variant={variant} className={className} />
}
