import { runApi } from '../../_lib.mjs'

export default async function handler(req, res) {
  const url = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`)
  // Em alguns runtimes o nome vem em req.query.name
  const name =
    req.query?.name || decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '')
  await runApi(req, res, `/api/v1/item/${encodeURIComponent(name)}`)
}

export const config = {
  api: { bodyParser: false },
  includeFiles: ['public/registry/**', 'dist/registry/**'],
}
