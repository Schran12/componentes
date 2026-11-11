'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import 'lenis/dist/lenis.css'

import { prefersReducedMotion } from './useReducedMotion'

export type SmoothScrollProps = {
  duration?: number
  anchorOffset?: number
  syncScrollTrigger?: boolean
}

/** Rolagem suave global com Lenis, sincronizada com o ticker do GSAP/ScrollTrigger. */
export function SmoothScroll({
  duration = 0.95,
  anchorOffset = -100,
  syncScrollTrigger = true,
}: SmoothScrollProps) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ duration, smoothWheel: true, anchors: { offset: anchorOffset } })
    if (syncScrollTrigger) lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number): void => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [anchorOffset, duration, syncScrollTrigger])

  return null
}
