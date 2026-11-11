import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApiHandler, resolveRegistryRoot } from './handler.mjs'
import { loadEnv } from './load-env.mjs'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
loadEnv(root)
const distRoot = resolve(root, 'dist')
const port = Number(process.env.PORT || 3000)
const registryRoot = resolveRegistryRoot(root)
const handleApi = createApiHandler({ registryRoot })

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function safeStaticPath(pathname) {
  const cleaned = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|\\|$))+/, '')
  const absolute = resolve(distRoot, `.${cleaned === '/' ? '/index.html' : cleaned}`)
  const rootPrefix = distRoot.endsWith(sep) ? distRoot : `${distRoot}${sep}`
  if (absolute !== distRoot && !absolute.startsWith(rootPrefix)) return null
  return absolute
}

function sendFile(res, filePath) {
  const type = mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
  const isRegistry = filePath.replaceAll('\\', '/').includes('/registry/')
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': isRegistry ? 'no-cache, must-revalidate' : 'public, max-age=300',
    ...(isRegistry
      ? {
          'Access-Control-Allow-Origin': '*',
        }
      : {}),
  })
  res.end(readFileSync(filePath))
}

const server = createServer(async (req, res) => {
  try {
    const handled = await handleApi(req, res)
    if (handled) return

    if (!existsSync(distRoot)) {
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Build ausente. Rode npm run build antes de npm start.')
      return
    }

    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
    let filePath = safeStaticPath(url.pathname)

    if (filePath && existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html')
    }

    if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
      sendFile(res, filePath)
      return
    }

    const fallback = join(distRoot, 'index.html')
    if (existsSync(fallback)) {
      sendFile(res, fallback)
      return
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found')
  } catch (error) {
    console.error(error)
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(`${JSON.stringify({ error: 'Erro interno da API.' })}\n`)
  }
})

server.listen(port, () => {
  console.log(`Componentes Bloomin ouvindo em http://localhost:${port}`)
  console.log(`API: http://localhost:${port}/api/v1/health`)
  console.log(`Registry root: ${registryRoot}`)
  if (!process.env.API_SIGNING_SECRET && !process.env.COMPONENTES_API_SECRET) {
    console.warn('Aviso: defina API_SIGNING_SECRET e API_ADMIN_SECRET para emitir keys.')
  }
})
