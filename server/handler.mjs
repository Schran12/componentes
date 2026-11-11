import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, normalize, resolve, sep } from 'node:path'
import {
  assertAdminSecret,
  extractAdminSecret,
  extractApiKey,
  isApiConfigured,
  issueApiKey,
  verifyApiKey,
} from './keys.mjs'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Api-Key, X-Admin-Secret, If-None-Match, Cache-Control, Pragma',
  'Access-Control-Max-Age': '86400',
  // Deixa apps no navegador lerem ETag e o hash da biblioteca para fazer polling barato.
  'Access-Control-Expose-Headers': 'ETag, X-Key-Name, X-Library-Hash',
}

// Limites do /bundle: a Vercel corta respostas de function acima de ~4,5 MB.
const BUNDLE_MAX_NAMES = 100
const BUNDLE_BYTE_BUDGET = 3_500_000
const ITEM_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i

function sendJson(res, status, payload, extraHeaders = {}) {
  const body = `${JSON.stringify(payload, null, 2)}\n`
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...CORS_HEADERS,
    ...extraHeaders,
  })
  res.end(body)
}

/**
 * Resposta de leitura do registry com ETag: o consumidor manda If-None-Match e recebe 304 (sem corpo)
 * enquanto nada mudou. É isso que torna barato consultar o feed de tempos em tempos.
 * `no-cache` (e não `no-store`) obriga a revalidar sempre, então a lista nunca fica velha.
 */
function sendCached(req, res, payload, extraHeaders = {}) {
  const body = `${JSON.stringify(payload)}\n`
  const etag = `"${createHash('sha256').update(body).digest('hex').slice(0, 32)}"`
  const headers = {
    'Cache-Control': 'private, no-cache',
    ETag: etag,
    ...CORS_HEADERS,
    ...extraHeaders,
  }
  const sent = String(req.headers['if-none-match'] || '')
    .split(',')
    .map((value) => value.trim().replace(/^W\//, ''))
  if (sent.includes(etag)) {
    res.writeHead(304, headers)
    res.end()
    return
  }
  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...headers })
  res.end(body)
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolveBody({})
      try {
        resolveBody(JSON.parse(raw))
      } catch {
        reject(new Error('JSON inválido no body.'))
      }
    })
    req.on('error', reject)
  })
}

function safeRegistryPath(registryRoot, requestPath) {
  const cleaned = normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/, '')
  const absolute = resolve(registryRoot, cleaned)
  const root = registryRoot.endsWith(sep) ? registryRoot : `${registryRoot}${sep}`
  if (absolute !== registryRoot && !absolute.startsWith(root)) return null
  return absolute
}

function rewriteFeedUrls(feed, apiBase) {
  const next = structuredClone(feed)
  next.endpoints = {
    registry: `${apiBase}/registry`,
    theme: `${apiBase}/theme`,
    feed: `${apiBase}/feed`,
    item: `${apiBase}/item/{name}`,
    bundle: `${apiBase}/bundle?names={name1,name2}|stage={stage}`,
    me: `${apiBase}/me`,
    keys: `${apiBase}/keys`,
    health: `${apiBase}/health`,
  }
  next.auth = {
    type: 'apiKey',
    header: 'Authorization: Bearer <API_KEY>',
    alternateHeader: 'X-Api-Key: <API_KEY>',
  }
  if (Array.isArray(next.items)) {
    next.items = next.items.map((item) => ({
      ...item,
      url: `${apiBase}/item/${item.name}`,
    }))
  }
  return next
}

function requireApiKey(req, res) {
  if (!isApiConfigured()) {
    sendJson(res, 503, {
      error: 'API de sync não configurada. Defina API_SIGNING_SECRET no servidor.',
    })
    return null
  }

  const key = extractApiKey(req)
  const verified = verifyApiKey(key)
  if (!verified.ok) {
    sendJson(res, 401, { error: verified.error || 'Não autorizado.' })
    return null
  }
  return verified
}

function publicBase(req) {
  const proto = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:2004'
  return `${proto}://${host}`
}

async function readRegistryJson(registryRoot, filename, req) {
  const filePath = safeRegistryPath(registryRoot, filename)
  if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
    return JSON.parse(readFileSync(filePath, 'utf8'))
  }

  // No Vercel a function muitas vezes não vê public/registry no disco.
  // Fallback: ler o JSON estático já publicado no mesmo host.
  const url = `${publicBase(req)}/registry/${filename}`
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
      cache: 'no-store',
    })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export function createApiHandler({ registryRoot }) {
  const root = resolve(registryRoot)

  return async function handleApi(req, res, urlPath = null) {
    const method = (req.method || 'GET').toUpperCase()
    const url = new URL(req.url || '/', 'http://localhost')
    const path = urlPath ?? url.pathname

    if (method === 'OPTIONS') {
      res.writeHead(204, CORS_HEADERS)
      res.end()
      return true
    }

    if (!path.startsWith('/api/v1')) return false

    const route = path.replace(/^\/api\/v1/, '') || '/'

    if (method === 'GET' && (route === '/health' || route === '/')) {
      const hasLocalFeed = existsSync(join(root, 'feed.json'))
      sendJson(res, 200, {
        ok: true,
        service: 'componentes-bloomin-api',
        version: 1,
        configured: isApiConfigured(),
        registryRoot: root,
        localRegistry: hasLocalFeed,
        endpoints: {
          issueKey: 'POST /api/v1/keys',
          me: 'GET /api/v1/me',
          feed: 'GET /api/v1/feed',
          theme: 'GET /api/v1/theme',
          registry: 'GET /api/v1/registry',
          item: 'GET /api/v1/item/:name',
          bundle: 'GET /api/v1/bundle?names=a,b,c | ?stage=faq',
          recipes: 'GET /api/v1/recipes',
        },
      })
      return true
    }

    if (method === 'POST' && route === '/keys') {
      let body
      try {
        body = await readBody(req)
      } catch (error) {
        sendJson(res, 400, { error: error.message })
        return true
      }

      const adminCheck = assertAdminSecret(extractAdminSecret(req, body))
      if (!adminCheck.ok) {
        sendJson(res, 401, { error: adminCheck.error })
        return true
      }

      const issued = issueApiKey({
        name: body.name || body.project || body.label,
        ttlDays: body.ttlDays ?? body.ttl_days,
      })
      if (!issued.ok) {
        sendJson(res, 503, { error: issued.error })
        return true
      }

      const apiBase = `${publicBase(req)}/api/v1`
      sendJson(res, 201, {
        key: issued.key,
        name: issued.name,
        id: issued.id,
        createdAt: issued.createdAt,
        expiresAt: issued.expiresAt,
        warning: 'Guarde esta key agora. Ela não será exibida de novo.',
        usage: {
          header: `Authorization: Bearer ${issued.key}`,
          env: `COMPONENTES_BLOOMIN_API_KEY=${issued.key}`,
          cli: `npx componentes-bloomin login --api-key ${issued.key}`,
          feed: `${apiBase}/feed`,
          item: `${apiBase}/registry/{name}`,
        },
      })
      return true
    }

    if (method === 'GET' && (route === '/keys/me' || route === '/me')) {
      const auth = requireApiKey(req, res)
      if (!auth) return true
      sendJson(res, 200, {
        ok: true,
        name: auth.name,
        id: auth.id,
        createdAt: auth.createdAt,
        expiresAt: auth.expiresAt,
      })
      return true
    }

    const protectedRoutes = {
      '/feed': 'feed.json',
      '/theme': 'theme.json',
      '/registry': 'registry.json',
      '/recipes': 'recipes.json',
      '/ai-context': 'ai-context.json',
    }

    // Vários itens em uma resposta: /api/v1/bundle?names=a,b,c ou ?stage=faq (todos os componentes da etapa).
    // Passa de BUNDLE_BYTE_BUDGET? O que não coube volta em `remaining`: peça de novo só esses nomes.
    // Para a biblioteca inteira de uma vez, use GET /api/v1/registry/componentes-bloomin (arquivos sem duplicar).
    if (method === 'GET' && route === '/bundle') {
      const auth = requireApiKey(req, res)
      if (!auth) return true

      const feed = await readRegistryJson(root, 'feed.json', req)
      const namesParam = url.searchParams.get('names')
      const stage = url.searchParams.get('stage')
      let names = []
      if (namesParam) {
        names = [
          ...new Set(
            namesParam
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean),
          ),
        ]
      } else if (stage) {
        names = (feed?.items ?? []).filter((item) => item.stage === stage).map((item) => item.name)
      } else {
        sendJson(res, 400, { error: 'Informe ?names=a,b,c ou ?stage=<etapa>.' })
        return true
      }
      if (!names.length) {
        sendJson(res, 404, { error: 'Nenhum item para os filtros informados.' })
        return true
      }
      if (names.length > BUNDLE_MAX_NAMES || names.some((name) => !ITEM_NAME_PATTERN.test(name))) {
        sendJson(res, 400, {
          error: `Use no máximo ${BUNDLE_MAX_NAMES} nomes válidos (letras, números, ponto, hífen).`,
        })
        return true
      }

      const loaded = await Promise.all(
        names.map((name) => readRegistryJson(root, `${name}.json`, req)),
      )
      const items = []
      const missing = []
      const remaining = []
      let used = 0
      names.forEach((name, index) => {
        const item = loaded[index]
        if (!item) return missing.push(name)
        if (used >= BUNDLE_BYTE_BUDGET) return remaining.push(name)
        used += JSON.stringify(item).length
        items.push(item)
      })

      sendCached(
        req,
        res,
        { schemaVersion: 1, libraryHash: feed?.libraryHash ?? null, items, missing, remaining },
        { 'X-Key-Name': auth.name, 'X-Library-Hash': feed?.libraryHash ?? '' },
      )
      return true
    }

    // Atalho flat para item: /api/v1/item/:name ou /api/v1/item?name=
    const flatItemMatch = route.match(/^\/item\/([^/]+)$/)
    const itemQuery = url.searchParams.get('name') || url.searchParams.get('id')
    if (method === 'GET' && (flatItemMatch || (route === '/item' && itemQuery))) {
      const auth = requireApiKey(req, res)
      if (!auth) return true
      const name = decodeURIComponent(flatItemMatch?.[1] || itemQuery).replace(/\.json$/i, '')
      if (name.includes('/') || name.includes('\\') || name.includes('..')) {
        sendJson(res, 400, { error: 'Nome de item inválido.' })
        return true
      }
      const payload = await readRegistryJson(root, `${name}.json`, req)
      if (!payload) {
        sendJson(res, 404, { error: `Item "${name}" não encontrado.` })
        return true
      }
      sendCached(req, res, payload, { 'X-Key-Name': auth.name })
      return true
    }

    if (method === 'GET' && protectedRoutes[route]) {
      const auth = requireApiKey(req, res)
      if (!auth) return true

      const payload = await readRegistryJson(root, protectedRoutes[route], req)
      if (!payload) {
        sendJson(res, 404, {
          error: 'Recurso não encontrado no registry.',
          detail: `Arquivo ${protectedRoutes[route]} ausente em ${root} e no fallback /registry/.`,
        })
        return true
      }

      if (route === '/feed') {
        sendCached(req, res, rewriteFeedUrls(payload, `${publicBase(req)}/api/v1`), {
          'X-Key-Name': auth.name,
          'X-Library-Hash': payload.libraryHash ?? '',
        })
        return true
      }

      sendCached(req, res, payload, { 'X-Key-Name': auth.name })
      return true
    }

    const itemMatch = route.match(/^\/registry\/([^/]+)$/)
    if (method === 'GET' && itemMatch) {
      const auth = requireApiKey(req, res)
      if (!auth) return true

      const name = decodeURIComponent(itemMatch[1]).replace(/\.json$/i, '')
      if (name.includes('/') || name.includes('\\') || name.includes('..')) {
        sendJson(res, 400, { error: 'Nome de item inválido.' })
        return true
      }

      const payload = await readRegistryJson(root, `${name}.json`, req)
      if (!payload) {
        sendJson(res, 404, { error: `Item "${name}" não encontrado.` })
        return true
      }

      sendCached(req, res, payload, { 'X-Key-Name': auth.name })
      return true
    }

    sendJson(res, 404, { error: `Rota não encontrada: ${method} /api/v1${route}` })
    return true
  }
}

export function resolveRegistryRoot(fromDir = process.cwd()) {
  const candidates = [
    join(fromDir, 'dist', 'registry'),
    join(fromDir, 'public', 'registry'),
    join(fromDir, 'registry'),
    // Empacotamento Vercel às vezes preserva caminhos relativos ao arquivo da API.
    join(fromDir, 'api', 'public', 'registry'),
  ]
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[1]
}
