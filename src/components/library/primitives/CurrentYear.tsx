'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * Ano atual lido só no navegador: não chama `new Date()` no prerender,
 * o que o Next 16 com `cacheComponents` rejeita.
 */
export function CurrentYear() {
  return useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  )
}
