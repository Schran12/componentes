import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { createApiHandler, resolveRegistryRoot } from '../server/handler.mjs'
import { loadEnv } from '../server/load-env.mjs'

const apiDir = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(apiDir, '..')
loadEnv(projectRoot)

export const handleApi = createApiHandler({
  registryRoot: resolveRegistryRoot(projectRoot),
})

export function runApi(req, res, path) {
  const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`)
  req.url = `${path}${url.search}`
  return handleApi(req, res, path)
}
