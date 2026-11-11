'use client'

import Image from 'next/image'
import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export type BeforeAfterSliderProps = {
  before: { src: string; alt: string; label?: string }
  after: { src: string; alt: string; label?: string }
  initialPosition?: number
  className?: string
  aspect?: 'video' | 'square' | 'wide'
}

export function BeforeAfterSlider({
  before,
  after,
  initialPosition = 50,
  className,
  aspect = 'video',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(Math.min(100, Math.max(0, initialPosition)))
  const aspectClass = { video: 'aspect-video', square: 'aspect-square', wide: 'aspect-[21/9]' }[
    aspect
  ]

  return (
    <figure
      className={cn(
        'group relative isolate overflow-hidden rounded-3xl bg-muted shadow-xl',
        aspectClass,
        className,
      )}
    >
      <Image
        src={after.src}
        alt={after.alt}
        fill
        className="object-cover"
        sizes="(min-width: 1280px) 1200px, 100vw"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before.src}
          alt={before.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 1200px, 100vw"
        />
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        {before.label ?? 'Antes'}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        {after.label ?? 'Depois'}
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.15)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/50 text-white shadow-xl backdrop-blur">
          <GripVertical className="h-5 w-5" />
        </span>
      </div>

      <label className="absolute inset-x-5 bottom-4">
        <span className="sr-only">Posição da comparação entre antes e depois</span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="h-8 w-full cursor-ew-resize opacity-0"
          aria-valuetext={`${position}% da imagem anterior visível`}
        />
      </label>
    </figure>
  )
}
