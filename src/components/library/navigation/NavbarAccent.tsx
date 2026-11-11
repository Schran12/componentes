'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Clock, Mail, Menu, Phone, X } from 'lucide-react'

import { AccentButton } from '@/components/library/primitives/AccentButton'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type NavbarAccentItem = {
  label: string
  href: string
  children?: readonly { label: string; href: string }[]
}

export type NavbarAccentProps = {
  logo: ReactNode
  items: readonly NavbarAccentItem[]
  logoHref?: string
  cta?: { label: string; href: string; icon?: ReactNode }
  topbar?: { phone?: string; phoneHref?: string; email?: string; hours?: string }
  socialLinks?: readonly { label: string; href: string; icon: ReactNode }[]
  position?: 'static' | 'sticky'
  tone?: AccentTone
  className?: string
}

const skins: Record<
  AccentTone,
  { bar: string; link: string; active: string; dropdown: string; drawer: string; burger: string }
> = {
  glow: {
    bar: 'bg-[#121212]/90 backdrop-blur',
    link: 'text-[#c1c1c1] hover:text-white',
    active: 'text-white',
    dropdown: 'rounded-b-md bg-[#221d2f]',
    drawer: 'bg-[#221d2f] text-white',
    burger: 'rounded-full border border-[#493849] text-white',
  },
  industrial: {
    bar: 'border-b border-slate-200 bg-white',
    link: 'text-slate-600 hover:text-slate-900',
    active: 'text-slate-900',
    dropdown: 'border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)]',
    drawer: 'bg-white text-slate-900',
    burger: 'border border-slate-200 text-slate-800',
  },
  'industrial-dark': {
    bar: 'border-b border-white/10 bg-slate-950',
    link: 'text-slate-400 hover:text-white',
    active: 'text-white',
    dropdown: 'border border-white/10 bg-slate-900',
    drawer: 'bg-slate-950 text-white',
    burger: 'border border-white/20 text-white',
  },
}

/** Cabeçalho com dropdowns, CTA, topbar opcional de contatos e drawer mobile. */
export function NavbarAccent({
  logo,
  items,
  logoHref = '/',
  cta,
  topbar,
  socialLinks = [],
  position = 'sticky',
  tone = 'industrial',
  className,
}: NavbarAccentProps) {
  const t = getAccentTone(tone)
  const skin = skins[tone]
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const close = (): void => {
    setOpen(false)
    setExpanded(null)
  }

  useEffect(() => {
    close()
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  const underline = (active: boolean): string =>
    cn(
      'absolute -bottom-1 left-0 h-0.5 transition-all duration-300',
      t.line,
      active ? 'w-full' : 'w-0 group-hover:w-full',
    )

  const contacts = topbar
    ? ([
        topbar.phone && {
          icon: <Phone className="h-3.5 w-3.5" />,
          label: topbar.phone,
          href: `tel:${topbar.phoneHref ?? topbar.phone}`,
        },
        topbar.email && {
          icon: <Mail className="h-3.5 w-3.5" />,
          label: topbar.email,
          href: `mailto:${topbar.email}`,
        },
        topbar.hours && { icon: <Clock className="h-3.5 w-3.5" />, label: topbar.hours },
      ].filter(Boolean) as { icon: ReactNode; label: string; href?: string }[])
    : []

  return (
    <>
      {contacts.length ? (
        <div
          className={cn(
            'hidden text-sm lg:block',
            tone === 'glow'
              ? 'border-b border-[#493849] bg-[#0e0e0e] text-[#c1c1c1]'
              : 'border-b border-slate-800 bg-slate-900 text-slate-300',
          )}
        >
          <div className="container flex h-10 items-center gap-6">
            {contacts.map((contact) => {
              const body = (
                <>
                  <span
                    className={tone === 'glow' ? 'text-[#ffb0eb]' : 'text-amber-500'}
                    aria-hidden
                  >
                    {contact.icon}
                  </span>
                  {contact.label}
                </>
              )
              return contact.href ? (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  {body}
                </a>
              ) : (
                <span key={contact.label} className="ml-auto inline-flex items-center gap-2">
                  {body}
                </span>
              )
            })}
          </div>
        </div>
      ) : null}

      <header
        className={cn('z-50 w-full', position === 'sticky' && 'sticky top-0', skin.bar, className)}
      >
        <div className="container grid min-h-[4.5rem] grid-cols-[1fr_auto] items-center gap-4 py-3 lg:min-h-20 lg:grid-cols-[1fr_auto_1fr] lg:py-0">
          <Link href={logoHref} className={cn('flex items-center justify-self-start', t.focus)}>
            {logo}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            {items.map((item) =>
              item.children?.length ? (
                <div key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3.5 py-2 text-[0.9375rem] font-medium tracking-wide transition-colors',
                      isActive(item.href) ? skin.active : skin.link,
                      t.focus,
                    )}
                  >
                    <span className="relative">
                      {item.label}
                      <span className={underline(isActive(item.href))} />
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-0 top-full z-50 min-w-[220px] translate-y-1 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className={cn('overflow-hidden', skin.dropdown)}>
                      <li className={cn('h-0.5 w-full', t.line)} aria-hidden />
                      {item.children.map((child) => (
                        <li key={child.label} className={cn('border-b last:border-b-0', t.border)}>
                          <Link
                            href={child.href}
                            className={cn(
                              'block whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
                              skin.link,
                              t.panelHover,
                              t.focus,
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'group relative px-3.5 py-2 text-[0.9375rem] font-medium tracking-wide transition-colors',
                    isActive(item.href) ? skin.active : skin.link,
                    t.focus,
                  )}
                >
                  <span className="relative">
                    {item.label}
                    <span className={underline(isActive(item.href))} />
                  </span>
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center justify-end gap-3">
            {cta ? (
              <div className="hidden lg:block">
                <AccentButton tone={tone} href={cta.href} icon={cta.icon}>
                  {cta.label}
                </AccentButton>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center lg:hidden',
                skin.burger,
                t.focus,
              )}
              aria-expanded={open}
              aria-controls="navbar-accent-drawer"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-[55] bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={close}
        aria-hidden
      />

      <aside
        id="navbar-accent-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          'fixed inset-y-0 right-0 z-[60] flex w-[min(100%,22rem)] flex-col shadow-2xl transition-[transform,visibility] duration-300 ease-out lg:hidden',
          skin.drawer,
          open ? 'visible translate-x-0' : 'invisible translate-x-full',
        )}
      >
        <div className={cn('flex h-[4.5rem] items-center justify-between border-b px-5', t.border)}>
          <Link href={logoHref} onClick={close} className={t.focus}>
            {logo}
          </Link>
          <button
            type="button"
            onClick={close}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center',
              skin.burger,
              t.focus,
            )}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
          <ul>
            {items.map((item) => (
              <li key={item.label} className={cn('border-b', t.border)}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={close}
                    className={cn(
                      'flex-1 py-3.5 font-medium tracking-wide',
                      isActive(item.href) ? skin.active : skin.link,
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center',
                        t.accent,
                        t.focus,
                      )}
                      aria-expanded={expanded === item.label}
                      aria-label={`Expandir ${item.label}`}
                    >
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          expanded === item.label && 'rotate-180',
                        )}
                      />
                    </button>
                  ) : null}
                </div>
                {item.children?.length && expanded === item.label ? (
                  <ul
                    className={cn(
                      'mb-3 space-y-1 border-l-2 pl-4',
                      tone === 'glow' ? 'border-[#c642a5]' : 'border-amber-500',
                    )}
                  >
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={close}
                          className={cn('block py-2 text-sm', skin.link)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        {socialLinks.length || contacts.length || cta ? (
          <div className={cn('space-y-4 border-t p-5', t.border, t.alt)}>
            {socialLinks.length ? (
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      'inline-flex h-10 w-10 items-center justify-center',
                      t.iconButton,
                      t.focus,
                    )}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            ) : null}
            {contacts.length ? (
              <div className={cn('space-y-2.5 text-sm', t.body)}>
                {contacts.map((contact) => (
                  <p key={contact.label} className="flex items-center gap-2.5">
                    <span className={t.accent} aria-hidden>
                      {contact.icon}
                    </span>
                    {contact.href ? <a href={contact.href}>{contact.label}</a> : contact.label}
                  </p>
                ))}
              </div>
            ) : null}
            {cta ? (
              <AccentButton tone={tone} href={cta.href} icon={cta.icon} onClick={close}>
                {cta.label}
              </AccentButton>
            ) : null}
          </div>
        ) : null}
      </aside>
    </>
  )
}
