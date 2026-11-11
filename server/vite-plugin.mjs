import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createApiHandler } from './handler.mjs'
import { loadEnv } from './load-env.mjs'

function mountApi(server, registryRoot) {
  const handleApi = createApiHandler({ registryRoot })
  server.middlewares.use(async (req, res, next) => {
    try {
      if (!req.url?.startsWith('/api/v1')) return next()
      const handled = await handleApi(req, res)
      if (!handled) next()
    } catch (error) {
      next(error)
    }
  })
}

/** Plugin Vite que monta a API `/api/v1` no `npm run dev` / preview. */
export function componentesApiPlugin() {
  return {
    name: 'componentes-bloomin-api',
    configureServer(server) {
      loadEnv(server.config.root)
      mountApi(server, resolve(server.config.root, 'public/registry'))
    },
    configurePreviewServer(server) {
      loadEnv(server.config.root)
      const distRegistry = resolve(server.config.root, 'dist/registry')
      const publicRegistry = resolve(server.config.root, 'public/registry')
      mountApi(server, existsSync(distRegistry) ? distRegistry : publicRegistry)
    },
  }
}
