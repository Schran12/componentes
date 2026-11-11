'use client'

import type { ReactNode } from 'react'

import { Marquee } from './Marquee'
import { cn } from '@/lib/utils'

export type SocialChannelItem = {
  name: string
  icon?: ReactNode
  color?: string
}

export type SocialChannelMarqueeProps = {
  eyebrow?: string
  title: string
  channels: readonly SocialChannelItem[]
  speed?: number
  className?: string
}

export function SocialChannelMarquee({
  eyebrow,
  title,
  channels,
  speed = 55,
  className,
}: SocialChannelMarqueeProps) {
  return (
    <section className={cn('overflow-hidden bg-[#1b1b1b] py-16 text-white md:py-20', className)}>
      <div className="container text-center">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4c95d]">{eyebrow}</p>
        ) : null}
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
          {title}
        </h2>
      </div>

      <Marquee
        speed={speed}
        gap={16}
        ariaLabel="Canais e integrações compatíveis"
        className="mt-12"
        itemClassName="items-center"
      >
        {channels.map((channel) => (
          <div
            key={channel.name}
            className="flex min-w-[180px] items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 transition hover:border-white/35 hover:bg-white/10"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black text-white"
              style={{ backgroundColor: channel.color ?? '#2f6fed' }}
              aria-hidden
            >
              {channel.icon ?? channel.name.slice(0, 1)}
            </span>
            <span className="font-semibold">{channel.name}</span>
          </div>
        ))}
      </Marquee>
    </section>
  )
}
