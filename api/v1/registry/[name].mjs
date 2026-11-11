import { runApi } from '../../_lib.mjs'

/** Compat: /api/v1/registry/:name → mesmo handler de /api/v1/item/:name */
export default async function handler(req, res) {
  const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`)
  const name =
    req.query?.name || decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '')
  await runApi(req, res, `/api/v1/item/${encodeURIComponent(name)}`)
}

export const config = {
  api: { bodyParser: false },
  includeFiles: ['public/registry/**', 'dist/registry/**'],
}
