'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

import { AccentButton } from '@/components/library/primitives/AccentButton'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { useReducedMotion } from '@/components/library/motion/useReducedMotion'
import { cn } from '@/lib/utils'

export type FloatingIllustrationHeroProps = {
  title: string
  description?: string
  illustration: { src: string; alt: string; width?: number; height?: number }
  actions?: readonly { label: string; href: string }[]
  tone?: AccentTone
  className?: string
}

/** Hero dividido com título em gradiente animado e ilustração flutuante. */
export function FloatingIllustrationHero({
  title,
  description,
  illustration,
  actions = [],
  tone = 'glow',
  className,
}: FloatingIllustrationHeroProps) {
  const t = getAccentTone(tone)
  const reduced = useReducedMotion()
  const isGlow = tone === 'glow'

  return (
    <section className={cn('overflow-hidden', t.section, className)}>
      <div className="container">
        <div className="flex min-h-[80vh] flex-col items-center justify-between gap-10 py-12 lg:flex-row">
          <motion.div
            initial={reduced ? false : { opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-1 basis-[300px] flex-col items-center justify-center gap-5 text-center lg:items-start lg:text-left"
          >
            <motion.h1
              className={cn(
                'text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.3]',
                isGlow
                  ? 'bg-[linear-gradient(90deg,#c642a5,#ffb0eb,#7c39cf,#ae89ff,#c642a5)] bg-[length:200%] bg-clip-text text-transparent'
                  : cn(t.heading, 'leading-[1.15]'),
              )}
              animate={
                isGlow && !reduced ? { backgroundPosition: ['0% 50%', '400% 50%'] } : undefined
              }
              transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
            >
              {title}
            </motion.h1>
            {description ? (
              <p className={cn('m-0 max-w-xl text-balance text-xl', t.body)}>{description}</p>
            ) : null}
            {actions.length ? (
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                {actions.map((action) => (
                  <AccentButton key={action.href + action.label} href={action.href} tone={tone}>
                    {action.label}
                  </AccentButton>
                ))}
              </div>
            ) : null}
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-1 basis-[300px] items-center justify-center"
          >
            <motion.div
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
              className="w-full max-w-xl"
            >
              <Image
                src={illustration.src}
                alt={illustration.alt}
                width={illustration.width ?? 640}
                height={illustration.height ?? 520}
                priority
                className="h-auto w-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
