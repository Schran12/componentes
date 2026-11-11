'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type NavbarSplitLogoItem = {
  label: string
  href: string
  children?: readonly { label: string; href: string }[]
}

export type NavbarSplitLogoProps = {
  logo: ReactNode
  items: readonly NavbarSplitLogoItem[]
  logoHref?: string
  socialLinks?: readonly { label: string; href: string; icon: ReactNode }[]
  cta?: { label: string; href: string }
  position?: 'static' | 'sticky'
  className?: string
}

/** Navbar com menu à esquerda, logo centralizado e redes sociais + CTA à direita. */
export function NavbarSplitLogo({
  logo,
  items,
  logoHref = '/',
  socialLinks = [],
  cta,
  position = 'sticky',
  className,
}: NavbarSplitLogoProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
  const linkClass = (href: string) =>
    cn(
      'inline-flex items-center gap-1 py-2 text-[13px] font-medium uppercase tracking-wide transition-colors',
      isActive(href) ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
      focus,
    )

  return (
    <>
      <header
        className={cn(
          'z-50 w-full border-b bg-background/95 backdrop-blur',
          position === 'sticky' && 'sticky top-0',
          className,
        )}
      >
        <div className="container grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition hover:bg-muted',
                focus,
              )}
              aria-expanded={open}
              aria-controls="navbar-split-logo-drawer"
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-5 xl:flex" aria-label="Principal">
              {items.map((item) =>
                item.children?.length ? (
                  <div key={item.label} className="group relative">
                    <Link href={item.href} className={linkClass(item.href)}>
                      {item.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                    </Link>
                    <div className="invisible absolute left-0 top-full z-50 min-w-[200px] translate-y-1 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="overflow-hidden rounded-lg border bg-popover py-1 shadow-lg">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className={cn(
                                'block px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                                focus,
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
                    className={linkClass(item.href)}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <Link
            href={logoHref}
            className={cn('flex items-center justify-center rounded-sm', focus)}
          >
            {logo}
          </Link>

          <div className="flex items-center justify-end gap-4">
            {socialLinks.length ? (
              <ul className="hidden items-center divide-x sm:flex">
                {socialLinks.map((social) => (
                  <li key={social.label} className="px-2.5">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={cn(
                        'flex text-muted-foreground transition-colors hover:text-primary [&_svg]:h-4 [&_svg]:w-4',
                        focus,
                      )}
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {cta ? (
              <Link
                href={cta.href}
                className={cn(
                  'hidden h-10 items-center rounded-md bg-primary px-5 text-[13px] font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary-hover sm:inline-flex',
                  focus,
                )}
              >
                {cta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <div
        className={cn(
          'fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="navbar-split-logo-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          'fixed inset-y-0 left-0 z-[60] flex w-[min(100%,22rem)] flex-col bg-background shadow-2xl transition-[transform,visibility] duration-300 ease-out',
          open ? 'visible translate-x-0' : 'invisible -translate-x-full',
        )}
      >
        <div className="flex h-20 items-center justify-between border-b px-5">
          <Link href={logoHref} onClick={() => setOpen(false)} className={focus}>
            {logo}
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted',
              focus,
            )}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Menu principal">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block rounded-md px-3 py-2.5 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-muted',
                    isActive(item.href) ? 'text-primary' : 'text-foreground',
                    focus,
                  )}
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <ul className="mb-2 ml-3 border-l pl-3">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            'block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                            focus,
                          )}
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
        {socialLinks.length || cta ? (
          <div className="space-y-4 border-t px-5 py-5">
            {socialLinks.length ? (
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border text-muted-foreground transition hover:border-primary hover:text-primary [&_svg]:h-4 [&_svg]:w-4',
                      focus,
                    )}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            ) : null}
            {cta ? (
              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary-hover',
                  focus,
                )}
              >
                {cta.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </aside>
    </>
  )
}
