'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type TextLoopProps = {
  words: string[]
  interval?: number
  prefix?: string
  className?: string
  wordClassName?: string
}

export function TextLoop({
  words,
  interval = 2400,
  prefix,
  className,
  wordClassName,
}: TextLoopProps) {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (words.length < 2 || reduceMotion) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length)
    }, interval)
    return () => window.clearInterval(timer)
  }, [interval, reduceMotion, words.length])

  if (!words.length) return null

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      {prefix ? <span>{prefix}</span> : null}
      <span className="relative inline-grid overflow-hidden">
        <span className="invisible col-start-1 row-start-1" aria-hidden="true">
          {words.reduce(
            (longest, word) => (word.length > longest.length ? word : longest),
            words[0],
          )}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            className={cn('col-start-1 row-start-1 text-primary', wordClassName)}
            key={words[index]}
            initial={reduceMotion ? false : { y: '70%', opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? undefined : { y: '-70%', opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
