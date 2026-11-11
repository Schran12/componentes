import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createApiHandler, resolveRegistryRoot } from '../../server/handler.mjs'
import { loadEnv } from '../../server/load-env.mjs'

// No Vercel o cwd da function nem sempre inclui public/; resolvemos a partir deste arquivo.
const apiDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(apiDir, '../..')
loadEnv(projectRoot)

const handleApi = createApiHandler({
  registryRoot: resolveRegistryRoot(projectRoot),
})

export default async function handler(req, res) {
  const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`)
  // No Vercel o catch-all chega como /api/v1/...
  const path = url.pathname.startsWith('/api/v1') ? url.pathname : `/api/v1${url.pathname}`
  req.url = `${path}${url.search}`
  const handled = await handleApi(req, res, path)
  if (!handled) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(`${JSON.stringify({ error: 'Não encontrado.' })}\n`)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
