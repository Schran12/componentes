const DEFAULT_CATALOG_URL = 'https://componentes-indol.vercel.app'

/** Key oficial para consumo via API (sem login — só colar no JSON do projeto). */
export const OFFICIAL_API_KEY =
  'cb_live_eyJuYW1lIjoiY29tcG9uZW50ZXMtYmxvb21pbiIsImlhdCI6MTc5MzcxOTAwOSwianRpIjoiMjFiY2ZiMmQwZjNkNGVlMmI2YjA5NmMzMzQyYjk5YWMifQ.N2JBB_hQt7d2rgNa3_IKtBZhZx0YB9_tR0C3hls9LI8'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

/**
 * URL do catálogo (links da documentação / IA / API).
 */
export function getRegistryUrl() {
  const fromEnv = import.meta.env.VITE_REGISTRY_URL || import.meta.env.VITE_SITE_URL
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return trimTrailingSlash(fromEnv.trim())
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlash(window.location.origin)
  }
  return DEFAULT_CATALOG_URL
}

export function getApiConfigJson() {
  return `{
  "registry": "${getRegistryUrl()}",
  "apiKey": "${OFFICIAL_API_KEY}",
  "syncMode": "mirror"
}`
}

export function getMirrorCommand() {
  return 'npx componentes-bloomin@latest mirror'
}

export function getWatchCommand() {
  return 'npx componentes-bloomin@latest watch'
}

export function getSyncCommand() {
  return 'npx componentes-bloomin@latest sync'
}

export function getInstallCommand(componentId: string) {
  return `npx componentes-bloomin@latest add ${componentId}`
}

export function getRecipeInstallCommand(recipeId: string) {
  return `npx componentes-bloomin@latest add recipe:${recipeId}`
}

export function getInitCommand() {
  return 'npx componentes-bloomin@latest init'
}

export function getAddAllCommand() {
  return 'npx componentes-bloomin@latest add all'
}
