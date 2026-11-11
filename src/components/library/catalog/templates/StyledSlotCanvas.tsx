'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ComponentPreview } from '../ComponentPreview'
import {
  buildSectionSkin,
  hasImageCustomizations,
  hasTextCustomizations,
  humanizePropName,
  orderedImageOverrides,
  type TemplateSlot,
} from './sectionCustomization'

const FLOATING_PREVIEW_IDS = new Set([
  'scroll-to-top-button',
  'floating-whatsapp-button',
  'floating-instagram-button',
  'floating-facebook-button',
  'floating-linkedin-button',
  'floating-youtube-button',
  'floating-tiktok-button',
  'floating-x-button',
  'floating-social-stack',
  'cookie-banner',
  'scroll-progress',
])

function SectionCanvasPreview({ id }: { id: string }) {
  if (FLOATING_PREVIEW_IDS.has(id)) {
    return (
      <div className="flex items-center justify-between gap-3 bg-slate-50 px-6 py-5 text-sm">
        <div>
          <p className="font-medium text-slate-800">Elemento flutuante</p>
          <p className="text-xs text-slate-500">
            Aparece fixo na página real (WhatsApp, redes, scroll, cookies).
          </p>
        </div>
        <code className="rounded bg-white px-2 py-1 font-mono text-[11px] text-slate-600">
          {id}
        </code>
      </div>
    )
  }

  return <ComponentPreview id={id} />
}

function applyDomImages(root: HTMLElement, slot: TemplateSlot) {
  const overrides = orderedImageOverrides(slot.images)
  if (!overrides.length) return

  const imgs = Array.from(root.querySelectorAll('img'))
  overrides.forEach((image, index) => {
    const target = imgs[index]
    if (!target) return
    target.src = image.src
    target.srcset = ''
    if (image.alt) target.alt = image.alt
  })

  // fundos CSS inline com url(...)
  let bgIndex = imgs.length
  root.querySelectorAll<HTMLElement>('[style*="background"]').forEach((element) => {
    if (bgIndex >= overrides.length) return
    const current = element.getAttribute('style') || ''
    if (!/url\(/i.test(current)) return
    const image = overrides[bgIndex]
    bgIndex += 1
    element.style.backgroundImage = `url("${image.src}")`
  })
}

function setText(element: Element | null | undefined, value: string | undefined) {
  if (!element || !value?.trim()) return
  element.textContent = value
}

/** Aplica textos comuns na prévia (título, descrição, CTAs). */
function applyDomTexts(root: HTMLElement, texts: Record<string, string>) {
  if (texts.title) setText(root.querySelector('h1, h2'), texts.title)
  if (texts.heading) setText(root.querySelector('h1, h2, h3'), texts.heading)
  if (texts.subtitle) {
    const heading = root.querySelector('h1, h2')
    const next = heading?.parentElement?.querySelector('h2, h3, p')
    setText(next && next !== heading ? next : root.querySelectorAll('h2, h3')[1], texts.subtitle)
  }
  if (texts.eyebrow || texts.message) {
    const value = texts.eyebrow || texts.message
    const candidate =
      root.querySelector('[class*="tracking"]') ||
      root.querySelector('p.text-xs, span.text-xs, p.text-sm') ||
      root.querySelector('p')
    setText(candidate, value)
  }
  if (texts.description) {
    const paragraphs = Array.from(root.querySelectorAll('p')).filter(
      (node) => (node.textContent?.trim().length ?? 0) > 24,
    )
    setText(paragraphs[0] ?? root.querySelector('p'), texts.description)
  }
  if (texts.caption) {
    setText(root.querySelector('figcaption'), texts.caption)
  }

  const actionLabels = [
    texts['primaryAction.label'],
    texts['secondaryAction.label'],
    texts['action.label'],
    texts.ctaLabel,
    texts.actionLabel,
    texts.buttonLabel,
  ].filter((item): item is string => Boolean(item?.trim()))

  if (actionLabels.length) {
    const actions = Array.from(root.querySelectorAll('a, button')).filter(
      (node) => (node.textContent?.trim().length ?? 0) > 0,
    )
    actionLabels.forEach((label, index) => {
      const target = actions[index]
      if (!target) return
      const textNode = Array.from(target.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
      )
      if (textNode) {
        textNode.textContent = label
      } else {
        const span = target.querySelector('span')
        if (span) span.textContent = label
        else target.textContent = label
      }
    })
  }

  if (texts['stat.value'] || texts['badge.value']) {
    const value = texts['stat.value'] || texts['badge.value']
    const strong = root.querySelector(
      '[class*="text-5xl"], [class*="text-6xl"], [class*="text-4xl"]',
    )
    setText(strong, value)
  }
  if (texts['stat.label'] || texts['badge.label']) {
    const label = texts['stat.label'] || texts['badge.label']
    const near =
      root.querySelector(
        '[class*="text-5xl"] + *, [class*="text-6xl"] + *, [class*="text-4xl"] + *',
      ) || root.querySelector('dd + dd, [class*="text-5xl"] ~ *')
    setText(near, label)
  }
}

export function StyledSlotCanvas({ slot, footer }: { slot: TemplateSlot; footer?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const skin = buildSectionSkin(slot.style)

  const imageSignature = JSON.stringify(slot.images)
  const textSignature = JSON.stringify(slot.texts)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const apply = () => {
      applyDomImages(root, slot)
      applyDomTexts(root, slot.texts)
    }
    apply()
    const t1 = window.setTimeout(apply, 80)
    const t2 = window.setTimeout(apply, 320)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [slot.componentId, imageSignature, textSignature, slot])

  const frameStyle = skin.hasBackground
    ? { ...skin.frameStyle, background: skin.background }
    : skin.frameStyle

  return (
    <div
      className={cn(skin.outerClassName, 'pointer-events-none select-none')}
      style={skin.outerStyle}
    >
      <div className={skin.frameClassName} style={frameStyle}>
        <div ref={rootRef} className={skin.contentClassName}>
          <SectionCanvasPreview id={slot.componentId} />
        </div>
        {footer}
      </div>
    </div>
  )
}

export function SlotCustomizationHints({ slot }: { slot: TemplateSlot }) {
  const texts = Object.entries(slot.texts).filter(([, value]) => value.trim())
  const images = hasImageCustomizations(slot.images)
  if (!hasTextCustomizations(slot.texts) && !images) return null

  return (
    <div className="relative z-[2] border-t border-dashed border-violet-300 bg-violet-50 px-4 py-2 text-[11px] text-violet-800">
      {texts.length ? (
        <p>
          Personalizado:{' '}
          {texts
            .slice(0, 4)
            .map(
              ([key, value]) =>
                `${humanizePropName(key.split('.').pop() || key)}: “${value.slice(0, 40)}${value.length > 40 ? '…' : ''}”`,
            )
            .join(' · ')}
          {texts.length > 4 ? ` · +${texts.length - 4}` : ''}
        </p>
      ) : null}
      {images ? (
        <p className={texts.length ? 'mt-1' : undefined}>
          Imagens personalizadas na prévia e na exportação.
        </p>
      ) : null}
    </div>
  )
}
