'use client'

import { useSyncExternalStore } from 'react'

let value = ''
const listeners = new Set<() => void>()

export const catalogSearch = {
  get: () => value,
  set(next: string) {
    value = next
    listeners.forEach((listener) => listener())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function useCatalogSearch() {
  return useSyncExternalStore(catalogSearch.subscribe, catalogSearch.get, () => '')
}
