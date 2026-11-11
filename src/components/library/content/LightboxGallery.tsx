'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'

import { AccentButton } from '@/components/library/primitives/AccentButton'
import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import {
  getAccentTone,
  padIndex,
  type AccentTone,
} from '@/components/library/primitives/accentTones'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type LightboxGalleryItem = {
  id: string
  title: string
  image: { src: string; alt: string }
  category?: string
  size?: 'default' | 'wide' | 'large'
}

export type LightboxGalleryProps = {
  title: string
  items: readonly LightboxGalleryItem[]
  eyebrow?: string
  description?: string
  action?: { label: string; href: string }
  tone?: AccentTone
  className?: string
}

const sizeClasses = {
  default: '',
  wide: 'sm:col-span-2',
  large: 'sm:col-span-2 sm:row-span-2',
}

/** Galeria em mosaico com lightbox em tela cheia, contador e navegação por setas do teclado. */
export function LightboxGallery({
  title,
  items,
  eyebrow,
  description,
  action,
  tone = 'glow',
  className,
}: LightboxGalleryProps) {
  const t = getAccentTone(tone)
  const isGlow = tone === 'glow'
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const active = items[activeIndex]

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length)
  }, [items.length])

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, goPrev, goNext])

  if (!items.length) return null

  return (
    <section
      className={cn(
        'relative overflow-hidden py-14 lg:py-20',
        isGlow ? 'bg-[#0e0e0e] text-[#c1c1c1]' : 'bg-slate-950 text-slate-400',
        className,
      )}
    >
      <div className="container relative">
        <EyebrowHeading
          tone={isGlow ? 'glow' : 'industrial-dark'}
          eyebrow={eyebrow}
          title={title}
          description={description}
          layout="split"
          action={
            action ? (
              <AccentButton href={action.href} tone={isGlow ? 'glow' : 'industrial-dark'}>
                {action.label}
              </AccentButton>
            ) : undefined
          }
          className="mb-8 lg:mb-10"
        />

        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
            isGlow
              ? 'auto-rows-[12rem] gap-4 sm:auto-rows-[14rem] lg:auto-rows-[15rem] lg:gap-5'
              : 'auto-rows-[14rem] gap-0 lg:auto-rows-[16rem]',
          )}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveIndex(index)
                setOpen(true)
              }}
              className={cn(
                'group relative isolate overflow-hidden text-left transition-all duration-500',
                isGlow
                  ? 'rounded-2xl border border-[#493849] bg-[#221d2f] hover:-translate-y-1 hover:border-[#c642a5]/50 hover:shadow-[0_12px_40px_rgba(198,66,165,0.18)]'
                  : 'bg-slate-900',
                sizeClasses[item.size ?? 'default'],
                t.focus,
              )}
              aria-label={`Abrir ${item.title} na galeria`}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={cn(
                  'object-cover transition-transform duration-700 ease-out',
                  isGlow ? 'group-hover:scale-110' : 'group-hover:scale-105',
                )}
              />
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-t transition-opacity duration-500',
                  isGlow
                    ? 'from-[#121212] via-[#121212]/20 to-transparent opacity-90 group-hover:opacity-100'
                    : 'from-slate-950/75 via-slate-950/15 to-transparent group-hover:from-slate-950/85',
                )}
                aria-hidden
              />
              {isGlow ? (
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#c642a5]/35 to-transparent to-55% opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
              ) : null}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <div>
                  <span
                    className={cn(
                      'text-[0.65rem] tracking-[0.22em]',
                      isGlow ? 'text-[#ffb0eb]' : 'text-amber-500',
                    )}
                  >
                    {padIndex(index)}
                    {item.category ? ` — ${item.category}` : null}
                  </span>
                  <h3
                    className={cn(
                      'mt-1.5 text-base font-semibold text-white sm:text-lg',
                      !isGlow && 'uppercase tracking-wide',
                    )}
                  >
                    {item.title}
                  </h3>
                </div>
                {isGlow ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#121212]/50 text-white backdrop-blur-sm transition-all duration-500 group-hover:border-[#c642a5] group-hover:bg-[#c642a5]">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'fixed inset-0 left-0 top-0 z-50 flex h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 shadow-none sm:rounded-none',
            'duration-300 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0',
            '[&>button]:hidden',
            isGlow ? 'bg-[#121212]/95 backdrop-blur-md' : 'bg-slate-950',
          )}
        >
          <DialogTitle className="sr-only">{active.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Visualização ampliada da galeria. Use as setas para navegar.
          </DialogDescription>

          <div
            className={cn(
              'flex items-center justify-between border-b px-4 py-4 sm:px-8',
              isGlow ? 'border-[#493849]' : 'border-white/10',
            )}
          >
            <div>
              <span
                className={cn(
                  'text-[0.65rem] tracking-[0.22em]',
                  isGlow ? 'text-[#ffb0eb]' : 'text-amber-500',
                )}
              >
                {padIndex(activeIndex)}
                {active.category ? ` — ${active.category}` : null}
              </span>
              <p className="mt-1 text-sm font-semibold text-white sm:text-base">{active.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('text-xs tracking-[0.18em]', t.body)}>
                {padIndex(activeIndex)} / {String(items.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center transition-colors',
                  isGlow ? t.iconButton : getAccentTone('industrial-dark').iconButton,
                )}
                aria-label="Fechar galeria"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-6 sm:px-16">
            {[
              {
                label: 'Imagem anterior',
                onClick: goPrev,
                icon: ChevronLeft,
                side: 'left-3 sm:left-6',
              },
              {
                label: 'Próxima imagem',
                onClick: goNext,
                icon: ChevronRight,
                side: 'right-3 sm:right-6',
              },
            ].map(({ label, onClick, icon: Icon, side }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className={cn(
                  'absolute z-10 flex h-11 w-11 items-center justify-center backdrop-blur-sm transition-colors',
                  side,
                  isGlow
                    ? 'rounded-full border border-[#493849] bg-[#221d2f]/80 text-white hover:border-[#c642a5] hover:bg-[#c642a5]'
                    : 'border border-white/20 bg-slate-950/60 text-white hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950',
                )}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}

            <div
              className={cn(
                'relative h-full min-h-[50vh] w-full max-w-5xl overflow-hidden',
                isGlow && 'rounded-2xl border border-[#493849] bg-[#221d2f]',
              )}
            >
              <Image
                key={active.id}
                src={active.image.src}
                alt={active.image.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
