'use client'

import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CookieConsent = 'accepted' | 'rejected'

export interface CookieBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode
  description: ReactNode
  privacyLink?: { label: string; href: string }
  acceptLabel?: string
  rejectLabel?: string
  customizeAction?: { label: string; onClick: () => void }
  position?: 'bottom' | 'bottom-left' | 'bottom-right'
  defaultVisible?: boolean
  dismissible?: boolean
  onConsent: (consent: CookieConsent) => void
  onDismiss?: () => void
}

export function CookieBanner({
  title = 'Sua privacidade importa',
  description,
  privacyLink,
  acceptLabel = 'Aceitar',
  rejectLabel = 'Recusar',
  customizeAction,
  position = 'bottom',
  defaultVisible = true,
  dismissible = false,
  onConsent,
  onDismiss,
  className,
  ...props
}: CookieBannerProps) {
  const [visible, setVisible] = useState(defaultVisible)

  if (!visible) return null

  function respond(consent: CookieConsent) {
    onConsent(consent)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Preferências de cookies"
      className={cn(
        'fixed z-50 rounded-2xl border bg-background p-5 shadow-2xl',
        position === 'bottom' && 'inset-x-4 bottom-4 md:inset-x-8',
        position === 'bottom-left' && 'bottom-4 left-4 right-4 max-w-lg sm:right-auto',
        position === 'bottom-right' && 'bottom-4 left-4 right-4 max-w-lg sm:left-auto',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          position === 'bottom' && 'mx-auto max-w-7xl md:flex md:items-center md:gap-6',
        )}
      >
        <Cookie className="mb-3 h-6 w-6 shrink-0 text-primary md:mb-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{title}</h2>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
            {privacyLink ? (
              <>
                {' '}
                <a
                  href={privacyLink.href}
                  className="rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {privacyLink.label}
                </a>
              </>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:shrink-0">
          {customizeAction ? (
            <Button type="button" variant="ghost" onClick={customizeAction.onClick}>
              {customizeAction.label}
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={() => respond('rejected')}>
            {rejectLabel}
          </Button>
          <Button type="button" onClick={() => respond('accepted')}>
            {acceptLabel}
          </Button>
        </div>
      </div>
      {dismissible ? (
        <button
          type="button"
          aria-label="Fechar aviso de cookies"
          className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => {
            setVisible(false)
            onDismiss?.()
          }}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
