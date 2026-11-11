'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ScrollToTopButtonProps = {
  /** Distância rolada (px) a partir da qual o botão aparece. */
  threshold?: number
  label?: string
  /** Use `static` em previews/catálogo para não flutuar sobre a página. */
  position?: 'fixed' | 'static'
  /**
   * Elemento que rola (ex.: preview do montador).
   * Quando definido, o anel acompanha esse container em vez da janela.
   */
  scrollContainer?: HTMLElement | null
  className?: string
}

const radius = 20
const circumference = 2 * Math.PI * radius

function readScrollProgress(container?: HTMLElement | null) {
  if (container) {
    const height = container.scrollHeight - container.clientHeight
    const scrollTop = container.scrollTop
    return {
      scrollTop,
      progress: height > 0 ? Math.min((scrollTop / height) * 100, 100) : 0,
    }
  }
  const height = document.documentElement.scrollHeight - window.innerHeight
  const scrollTop = window.scrollY
  return {
    scrollTop,
    progress: height > 0 ? Math.min((scrollTop / height) * 100, 100) : 0,
  }
}

/** Botão flutuante de voltar ao topo com anel de progresso da rolagem. */
export function ScrollToTopButton({
  threshold = 300,
  label = 'Voltar ao topo',
  position = 'fixed',
  scrollContainer = null,
  className,
}: ScrollToTopButtonProps) {
  const tracksLiveScroll = Boolean(scrollContainer) || position === 'fixed'
  const [visible, setVisible] = useState(!tracksLiveScroll)
  const [progress, setProgress] = useState(tracksLiveScroll ? 0 : 35)

  useEffect(() => {
    if (!tracksLiveScroll) {
      setVisible(true)
      setProgress(35)
      return
    }

    function update() {
      const { scrollTop, progress: next } = readScrollProgress(scrollContainer)
      setProgress(next)
      setVisible(scrollTop > threshold)
    }

    update()

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', update, { passive: true })
      const resizeObserver = new ResizeObserver(update)
      resizeObserver.observe(scrollContainer)
      return () => {
        scrollContainer.removeEventListener('scroll', update)
        resizeObserver.disconnect()
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [threshold, scrollContainer, tracksLiveScroll])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => {
        if (scrollContainer) {
          scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      aria-label={label}
      className={cn(
        'relative z-40 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-lg transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        position === 'fixed' &&
          !scrollContainer &&
          'fixed bottom-6 right-6 animate-in fade-in-0 zoom-in-90',
        className,
      )}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-12 w-12 -rotate-90"
        viewBox="0 0 48 48"
        aria-hidden
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (progress / 100) * circumference}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      <ChevronUp className="relative h-5 w-5" aria-hidden />
    </button>
  )
}
