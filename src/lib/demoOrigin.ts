/** Origem dos demos estáticos (HTML/CSS/JS) publicados no catálogo. */
export const DEMO_ORIGIN = 'https://componentes-indol.vercel.app'

/**
 * Resolve URL de demo embutido (iframe / assets).
 * - No catálogo local (localhost), usa caminho relativo para hot-reload dos demos.
 * - Em projetos consumidores (API/mirror), aponta ao CDN do catálogo para
 *   garantir estilização e efeitos mesmo antes de copiar `public/`.
 */
export function demoUrl(path: string) {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host === 'localhost' || host === '127.0.0.1') {
      return clean
    }
  }
  return `${DEMO_ORIGIN}${clean}`
}
