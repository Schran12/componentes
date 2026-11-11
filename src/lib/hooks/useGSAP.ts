'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, type DependencyList, type RefObject } from 'react'

let registered = false

function ensureGsapPlugins(): void {
  if (typeof window === 'undefined' || registered) return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

export type GSAPTools = {
  gsap: typeof gsap
  ScrollTrigger: typeof ScrollTrigger
}

export type GSAPCallback = (tools: GSAPTools) => void | (() => void)

export function useGSAP(
  callback: GSAPCallback,
  deps: DependencyList = [],
  scope?: RefObject<Element | null>,
): void {
  useEffect(() => {
    if (typeof window === 'undefined') return

    ensureGsapPlugins()

    let dispose: void | (() => void)
    const context = gsap.context(() => {
      dispose = callback({ gsap, ScrollTrigger })
    }, scope?.current ?? undefined)

    return () => {
      dispose?.()
      context.revert()
    }

    // Dependencies are deliberately controlled by each animation consumer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
