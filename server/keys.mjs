import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

const KEY_PREFIX = 'cb_live_'

function getSigningSecret() {
  return process.env.API_SIGNING_SECRET || process.env.COMPONENTES_API_SECRET || ''
}

function getAdminSecret() {
  return process.env.API_ADMIN_SECRET || process.env.COMPONENTES_ADMIN_SECRET || ''
}

function getRevokedIds() {
  const raw = process.env.API_REVOKED_KEYS || ''
  return new Set(
    raw
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  )
}

function toBase64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return Buffer.from(`${padded}${pad}`, 'base64').toString('utf8')
}

function sign(payloadB64, secret) {
  return toBase64Url(createHmac('sha256', secret).update(payloadB64).digest())
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function isApiConfigured() {
  return Boolean(getSigningSecret())
}

export function assertAdminSecret(provided) {
  const expected = getAdminSecret()
  if (!expected) {
    return { ok: false, error: 'API_ADMIN_SECRET não configurado no servidor.' }
  }
  if (!provided || !safeEqual(provided, expected)) {
    return { ok: false, error: 'Admin secret inválido.' }
  }
  return { ok: true }
}

export function issueApiKey({ name, ttlDays } = {}) {
  const secret = getSigningSecret()
  if (!secret) {
    return { ok: false, error: 'API_SIGNING_SECRET não configurado no servidor.' }
  }

  const label =
    String(name || 'unnamed')
      .trim()
      .slice(0, 80) || 'unnamed'
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    name: label,
    iat: now,
    jti: randomUUID().replace(/-/g, ''),
  }

  if (ttlDays && Number(ttlDays) > 0) {
    payload.exp = now + Math.floor(Number(ttlDays) * 24 * 60 * 60)
  }

  const payloadB64 = toBase64Url(JSON.stringify(payload))
  const signature = sign(payloadB64, secret)
  const key = `${KEY_PREFIX}${payloadB64}.${signature}`

  return {
    ok: true,
    key,
    name: payload.name,
    id: payload.jti,
    createdAt: new Date(payload.iat * 1000).toISOString(),
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
  }
}

export function verifyApiKey(key) {
  const secret = getSigningSecret()
  if (!secret) {
    return { ok: false, error: 'API não configurada (API_SIGNING_SECRET ausente).' }
  }
  if (!key || typeof key !== 'string' || !key.startsWith(KEY_PREFIX)) {
    return { ok: false, error: 'API key inválida.' }
  }

  const token = key.slice(KEY_PREFIX.length)
  const [payloadB64, signature] = token.split('.')
  if (!payloadB64 || !signature) {
    return { ok: false, error: 'API key malformada.' }
  }

  const expected = sign(payloadB64, secret)
  if (!safeEqual(signature, expected)) {
    return { ok: false, error: 'Assinatura da API key inválida.' }
  }

  let payload
  try {
    payload = JSON.parse(fromBase64Url(payloadB64))
  } catch {
    return { ok: false, error: 'Payload da API key inválido.' }
  }

  if (!payload?.jti || !payload?.iat) {
    return { ok: false, error: 'API key incompleta.' }
  }

  if (getRevokedIds().has(payload.jti) || getRevokedIds().has(key)) {
    return { ok: false, error: 'API key revogada.' }
  }

  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    return { ok: false, error: 'API key expirada.' }
  }

  return {
    ok: true,
    name: payload.name,
    id: payload.jti,
    createdAt: new Date(payload.iat * 1000).toISOString(),
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
  }
}

export function extractApiKey(req) {
  const auth = req.headers.authorization || req.headers.Authorization
  if (typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim()
  }

  const headerKey = req.headers['x-api-key'] || req.headers['X-Api-Key']
  if (typeof headerKey === 'string' && headerKey.trim()) {
    return headerKey.trim()
  }

  try {
    const url = new URL(req.url || '/', 'http://localhost')
    const queryKey = url.searchParams.get('api_key') || url.searchParams.get('key')
    if (queryKey) return queryKey.trim()
  } catch {
    // ignore
  }

  return null
}

export function extractAdminSecret(req, body = {}) {
  const header =
    req.headers['x-admin-secret'] ||
    req.headers['X-Admin-Secret'] ||
    (typeof req.headers.authorization === 'string' &&
    req.headers.authorization.toLowerCase().startsWith('bearer ')
      ? req.headers.authorization.slice(7).trim()
      : null)

  return body.adminSecret || body.admin_secret || header || null
}
