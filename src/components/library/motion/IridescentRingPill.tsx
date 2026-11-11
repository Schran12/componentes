'use client'

import { demoUrl } from '@/lib/demoOrigin'
import { cn } from '@/lib/utils'

export type IridescentRingPillProps = {
  /** Texto do botão. */
  label?: string
  href?: string
  /** URL do demo estático. */
  src?: string
  /** Se true, embute o demo HTML; se false, renderiza o botão React inline. */
  embedDemo?: boolean
  height?: number | string
  className?: string
  onClick?: () => void
}

const PL_CSS = `
.irp-stage{display:grid;place-items:center;min-height:100%;width:100%;background:radial-gradient(ellipse 80% 60% at 50% 40%,#1a1524 0%,#0a0a0c 70%);padding:32px 16px;border-radius:inherit}
.irp-pill{display:inline-flex;align-items:center;gap:12px;padding:9px 20px 9px 9px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.92);text-decoration:none;cursor:pointer;font:600 11px/1 "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:.22em;text-transform:uppercase;transition:background .25s ease,border-color .25s ease,transform .25s ease;-webkit-tap-highlight-color:transparent}
.irp-pill:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.28)}
.irp-pill:focus-visible{outline:2px solid #6ef0ff;outline-offset:3px}
.irp-pill:active{transform:scale(.98)}
.irp-disc{position:relative;flex:none;width:34px;height:34px;border-radius:50%;background:#121218;display:grid;place-items:center;isolation:isolate}
.irp-ring{position:absolute;inset:0;border-radius:50%;pointer-events:none;z-index:1;background:conic-gradient(from 0turn,transparent 0 58%,#ff6ea9 68%,#ffd36e 76%,#6ef0ff 84%,transparent 92%);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 calc(100% - 2.5px));mask:radial-gradient(farthest-side,transparent calc(100% - 2.5px),#000 calc(100% - 2.5px));animation:irp-orbit 2.6s linear infinite,irp-hue 7s linear infinite}
.irp-pill:hover .irp-ring{animation-play-state:paused,running}
.irp-disc svg{position:relative;z-index:2;width:14px;height:14px}
@keyframes irp-orbit{to{transform:rotate(1turn)}}
@keyframes irp-hue{to{filter:hue-rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.irp-ring{animation:none;transform:rotate(42deg);filter:none}}
`

/**
 * Pill de nav com anel iridescente no disco do ícone:
 * conic-gradient mascarado; orbit + hue em animações separadas;
 * no hover a órbita pausa e a cor continua.
 */
export function IridescentRingPill({
  label = 'Explore the drop',
  href = '#',
  src,
  embedDemo = false,
  height = 220,
  className,
  onClick,
}: IridescentRingPillProps) {
  const demoSrc = src ?? demoUrl('/iridescent-ring-pill/index.html')
  if (embedDemo) {
    return (
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c]',
          className,
        )}
        style={{ height }}
      >
        <iframe
          title={label}
          src={demoSrc}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      </div>
    )
  }

  const inner = (
    <>
      <style dangerouslySetInnerHTML={{ __html: PL_CSS }} />
      <span className="irp-disc" aria-hidden="true">
        <span className="irp-ring" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
      <span>{label}</span>
    </>
  )

  return (
    <div className={cn('irp-stage', className)}>
      {href ? (
        <a className="irp-pill" href={href} onClick={onClick}>
          {inner}
        </a>
      ) : (
        <button type="button" className="irp-pill" onClick={onClick}>
          {inner}
        </button>
      )}
    </div>
  )
}
