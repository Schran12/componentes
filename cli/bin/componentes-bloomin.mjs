#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const cwd = process.cwd()
const bundledRegistry = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public')
const configPath = resolve(cwd, 'componentes-bloomin.json')
const argv = process.argv.slice(2)
const command = argv[0] ?? 'help'
const DEFAULT_REGISTRY = 'https://componentes-indol.vercel.app'
/** Key oficial da biblioteca — o projeto só precisa ter ela no JSON. */
const DEFAULT_API_KEY =
  'cb_live_eyJuYW1lIjoiY29tcG9uZW50ZXMtYmxvb21pbiIsImlhdCI6MTc5MzcxOTAwOSwianRpIjoiMjFiY2ZiMmQwZjNkNGVlMmI2YjA5NmMzMzQyYjk5YWMifQ.N2JBB_hQt7d2rgNa3_IKtBZhZx0YB9_tR0C3hls9LI8'
const DEFAULT_WATCH_INTERVAL = 5

function parseArguments(values) {
  const options = {
    registry: undefined,
    apiKey: undefined,
    adminSecret: undefined,
    name: undefined,
    ttlDays: undefined,
    overwrite: false,
    skipInstall: false,
    skipTheme: false,
    packageManager: undefined,
    interval: DEFAULT_WATCH_INTERVAL,
    all: false,
    mirror: false,
    items: [],
  }

  for (let index = 1; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--registry') {
      options.registry = values[index + 1]
      index += 1
    } else if (value === '--api-key') {
      options.apiKey = values[index + 1]
      index += 1
    } else if (value === '--admin-secret') {
      options.adminSecret = values[index + 1]
      index += 1
    } else if (value === '--name') {
      options.name = values[index + 1]
      index += 1
    } else if (value === '--ttl-days') {
      options.ttlDays = Number(values[index + 1])
      index += 1
    } else if (value === '--package-manager') {
      options.packageManager = values[index + 1]
      index += 1
    } else if (value === '--interval') {
      const parsed = Number(values[index + 1])
      if (!Number.isFinite(parsed) || parsed < 1) {
        fail('Use --interval com um número de segundos >= 1.')
      }
      options.interval = parsed
      index += 1
    } else if (value === '--overwrite') {
      options.overwrite = true
    } else if (value === '--skip-install') {
      options.skipInstall = true
    } else if (value === '--skip-theme') {
      options.skipTheme = true
    } else if (value === '--all') {
      options.all = true
    } else if (value === '--mirror') {
      options.mirror = true
    } else if (!value.startsWith('-')) {
      options.items.push(value)
    }
  }

  return options
}

function readConfig() {
  if (!existsSync(configPath)) return {}
  try {
    return JSON.parse(readFileSync(configPath, 'utf8'))
  } catch {
    fail('O arquivo componentes-bloomin.json contém JSON inválido.')
  }
}

function writeConfig(config) {
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)
}

function registryUrl(options, config) {
  return (
    options.registry ??
    process.env.COMPONENTES_BLOOMIN_REGISTRY ??
    config.registry ??
    (existsSync(resolve(bundledRegistry, 'registry', 'registry.json'))
      ? bundledRegistry
      : DEFAULT_REGISTRY)
  ).replace(/[\\/]+$/, '')
}

function resolveApiKey(options, config = {}) {
  return (
    options.apiKey ?? process.env.COMPONENTES_BLOOMIN_API_KEY ?? config.apiKey ?? DEFAULT_API_KEY
  )
}

function isRemote(location) {
  return /^https?:\/\//i.test(location)
}

function fail(message) {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

function hashFiles(files) {
  const hash = createHash('sha256')
  const sorted = [...files].sort((a, b) =>
    String(a.target ?? a.path).localeCompare(String(b.target ?? b.path)),
  )
  for (const file of sorted) {
    hash.update(String(file.target ?? file.path ?? ''))
    hash.update('\0')
    hash.update(String(file.content ?? ''))
    hash.update('\0')
  }
  return hash.digest('hex')
}

/** Monta URLs do registry público ou da API autenticada. */
function registryPaths(baseUrl, apiKey) {
  const remote = isRemote(baseUrl)
  const useApi = remote && Boolean(apiKey)
  if (useApi) {
    // Auth pela API; conteúdo pelo registry estático (sempre disponível no Vercel CDN).
    // Isso evita falhas de catch-all multi-segmento nas serverless functions.
    return {
      mode: 'api',
      feed: `${baseUrl}/api/v1/feed`,
      theme: `${baseUrl}/api/v1/theme`,
      registry: `${baseUrl}/api/v1/registry`,
      recipes: `${baseUrl}/registry/recipes.json`,
      item: (id) => `${baseUrl}/api/v1/item/${id}`,
      itemPublic: (id) => `${baseUrl}/registry/${id}.json`,
      keys: `${baseUrl}/api/v1/keys`,
      me: `${baseUrl}/api/v1/me`,
    }
  }
  return {
    mode: 'public',
    feed: `${baseUrl}/registry/feed.json`,
    theme: `${baseUrl}/registry/theme.json`,
    registry: `${baseUrl}/registry/registry.json`,
    recipes: `${baseUrl}/registry/recipes.json`,
    item: (id) => `${baseUrl}/registry/${id}.json`,
    keys: `${baseUrl}/api/v1/keys`,
    me: `${baseUrl}/api/v1/keys/me`,
  }
}

function printHelp() {
  console.log(`
Componentes Bloomin

1) Crie o arquivo componentes-bloomin.json na raiz do projeto (cole a key)
2) Rode:

  npx componentes-bloomin mirror

Consome a API ${DEFAULT_REGISTRY}/api/v1/* com a key do JSON.
Sem comando de login.

Outros:
  npx componentes-bloomin sync
  npx componentes-bloomin watch
  npx componentes-bloomin list
  npx componentes-bloomin recipes
  npx componentes-bloomin add <id>

Opções:
  --api-key KEY            Sobrescreve a key do JSON
  --registry URL|PASTA     Outra URL (padrão: catálogo Bloomin)
  --interval <segundos>    Intervalo do watch (padrão: 5)
  --skip-theme             No mirror/init, não copia o tema
  --skip-install           Não instala dependências npm
  --package-manager <nome> npm, pnpm, yarn ou bun
`)
}

function ensureMirrorConfig(options) {
  const previous = readConfig()
  const baseUrl = registryUrl(options, previous)
  const apiKey = resolveApiKey(options, previous)
  const created = !existsSync(configPath)
  const next = {
    ...previous,
    registry: baseUrl,
    apiKey,
    syncMode: 'mirror',
    installed: previous.installed ?? {},
  }
  writeConfig(next)
  if (created) {
    console.log('✓ componentes-bloomin.json criado com a API key')
    console.log(`  Registry: ${baseUrl}`)
    console.log(`  API: ${baseUrl}/api/v1/feed`)
  }
  return next
}

async function fetchJson(url, { apiKey } = {}) {
  if (!isRemote(url)) {
    if (!existsSync(url)) {
      fail(`Item não encontrado em ${url}. Use "componentes-bloomin list" para consultar os IDs.`)
    }
    try {
      return JSON.parse(readFileSync(url, 'utf8'))
    } catch {
      fail(`JSON inválido em ${url}.`)
    }
  }

  const headers = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Accept: 'application/json',
  }
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
    headers['X-Api-Key'] = apiKey
  }

  let response
  try {
    response = await fetch(url, { headers, cache: 'no-store' })
  } catch {
    fail(`Não foi possível acessar ${url}. Confira a URL do registry.`)
  }

  if (!response.ok) {
    let detail = ''
    try {
      const payload = await response.json()
      if (payload?.error) detail = ` — ${payload.error}`
    } catch {
      // ignore
    }
    if (response.status === 401) {
      fail(`Não autorizado em ${url}${detail}.`)
    }
    if (response.status === 404) {
      fail(`Item não encontrado em ${url}. Use "componentes-bloomin list" para consultar os IDs.`)
    }
    fail(`O registry respondeu com status ${response.status} em ${url}${detail}.`)
  }

  try {
    return await response.json()
  } catch {
    fail(`O registry retornou um JSON inválido em ${url}.`)
  }
}

function safeTargetPath(target) {
  const absoluteTarget = resolve(cwd, target)
  const rootPrefix = cwd.endsWith(sep) ? cwd : `${cwd}${sep}`
  if (!absoluteTarget.startsWith(rootPrefix)) {
    fail(`Caminho recusado por segurança: ${target}`)
  }
  return absoluteTarget
}

function detectPackageManager(explicit) {
  if (explicit) {
    if (!['npm', 'pnpm', 'yarn', 'bun'].includes(explicit)) {
      fail(`Gerenciador inválido: ${explicit}. Use npm, pnpm, yarn ou bun.`)
    }
    return explicit
  }
  if (existsSync(resolve(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(resolve(cwd, 'yarn.lock'))) return 'yarn'
  if (existsSync(resolve(cwd, 'bun.lockb')) || existsSync(resolve(cwd, 'bun.lock'))) return 'bun'
  return 'npm'
}

function installDependencies(dependencies, packageManager) {
  if (!dependencies.length) return

  const commandByManager = {
    npm: ['install'],
    pnpm: ['add'],
    yarn: ['add'],
    bun: ['add'],
  }
  const args = [
    ...commandByManager[packageManager],
    ...dependencies.map((dependency) =>
      process.platform === 'win32' ? `"${dependency}"` : dependency,
    ),
  ]

  console.log(`\nInstalando ${dependencies.length} dependência(s) com ${packageManager}...`)
  const result = spawnSync(packageManager, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) {
    fail(
      `Não foi possível instalar as dependências. Execute manualmente: ${packageManager} ${args.join(' ')}`,
    )
  }
}

function normalizeFileEntry(entry) {
  if (typeof entry === 'string') return { content: entry, encoding: 'utf8' }
  return {
    content: entry.content,
    encoding: entry.encoding === 'base64' ? 'base64' : 'utf8',
  }
}

function writeFiles(files, options) {
  let created = 0
  let updated = 0
  let skipped = 0

  for (const [target, raw] of files) {
    const { content, encoding } = normalizeFileEntry(raw)
    const destination = safeTargetPath(target)
    const payload = encoding === 'base64' ? Buffer.from(content, 'base64') : content

    if (existsSync(destination)) {
      const current =
        encoding === 'base64' ? readFileSync(destination) : readFileSync(destination, 'utf8')
      const same =
        encoding === 'base64'
          ? Buffer.isBuffer(current) && current.equals(payload)
          : current === payload
      if (same) {
        skipped += 1
        continue
      }
      if (!options.overwrite) {
        console.log(`! Mantido: ${target} (use --overwrite para substituir)`)
        skipped += 1
        continue
      }
      updated += 1
    } else {
      created += 1
    }

    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, payload)
    console.log(`✓ ${target}`)
  }

  return { created, updated, skipped }
}

function normalizeItemId(item) {
  if (item === 'all') return 'componentes-bloomin'
  if (item.startsWith('recipe:')) return `recipe-${item.slice('recipe:'.length)}`
  if (item.startsWith('recipe-')) return item
  return item
}

function rememberInstalled(config, items) {
  const installed = { ...(config.installed ?? {}) }
  for (const item of items) {
    installed[item.name] = {
      kind: item.kind,
      hash: hashFiles(item.files ?? []),
      syncedAt: new Date().toISOString(),
    }
  }
  return { ...config, installed }
}

function session(options) {
  const config = readConfig()
  const baseUrl = registryUrl(options, config)
  const apiKey = resolveApiKey(options, config)
  const paths = registryPaths(baseUrl, apiKey)
  return { config, baseUrl, apiKey, paths }
}

async function installTheme(baseUrl, options, paths, apiKey) {
  const theme = await fetchJson(paths?.theme ?? `${baseUrl}/registry/theme.json`, { apiKey })
  const files = new Map()
  for (const file of theme.files ?? []) {
    const target = file.target ?? file.path
    if (!target || typeof file.content !== 'string') {
      fail('O tema do registry contém um arquivo inválido.')
    }
    files.set(target, {
      content: file.content,
      encoding: file.encoding === 'base64' ? 'base64' : 'utf8',
    })
  }

  console.log('\nAplicando tema (tailwind + globals.css)...')
  const result = writeFiles(files, options)
  if (!options.skipInstall) {
    installDependencies(theme.dependencies ?? [], detectPackageManager(options.packageManager))
  }
  return { result, themeHash: hashFiles(theme.files ?? []) }
}

function isMirrorMode(options, config = {}) {
  return Boolean(
    options.mirror ||
    options.all ||
    config.syncMode === 'mirror' ||
    command === 'mirror' ||
    command === 'sync' ||
    command === 'watch',
  )
}

async function login(options) {
  const apiKey = resolveApiKey(options, {})
  if (!apiKey) {
    fail('Informe a key: componentes-bloomin login --api-key cb_live_...')
  }

  const baseUrl = registryUrl(options, readConfig())
  if (!isRemote(baseUrl)) {
    fail('login exige --registry com URL http(s).')
  }

  const me = await fetchJson(`${baseUrl}/api/v1/keys/me`, { apiKey })
  const config = {
    ...readConfig(),
    registry: baseUrl,
    apiKey,
    apiKeyName: me.name,
    apiKeyId: me.id,
    ...(options.mirror ? { syncMode: 'mirror' } : {}),
  }
  writeConfig(config)

  console.log('✓ API key salva em componentes-bloomin.json')
  console.log(`  Projeto: ${me.name}`)
  console.log(`  Registry: ${baseUrl}`)
  console.log(`  Feed: ${baseUrl}/api/v1/feed`)
  if (options.mirror) {
    console.log('  Modo: mirror (biblioteca completa, auto-atualiza)')
    console.log('\nPróximos passos no seu projeto:')
    console.log('  npx componentes-bloomin add all')
    console.log('  npx componentes-bloomin watch --mirror')
  }
}

async function keyCreate(options) {
  const baseUrl = registryUrl(options, readConfig())
  if (!isRemote(baseUrl)) {
    fail('key create exige --registry com URL http(s) do catálogo.')
  }

  const adminSecret =
    options.adminSecret ?? process.env.API_ADMIN_SECRET ?? process.env.COMPONENTES_ADMIN_SECRET
  if (!adminSecret) {
    fail('Informe --admin-secret ou defina API_ADMIN_SECRET.')
  }

  const name = options.name ?? options.items[0] ?? 'projeto'
  const body = {
    name,
    ttlDays: options.ttlDays,
    adminSecret,
  }

  let response
  try {
    response = await fetch(`${baseUrl}/api/v1/keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Secret': adminSecret,
      },
      body: JSON.stringify(body),
    })
  } catch {
    fail(`Não foi possível acessar ${baseUrl}/api/v1/keys`)
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    fail(payload.error || `Falha ao emitir key (HTTP ${response.status}).`)
  }

  console.log('\n✓ API key emitida\n')
  console.log(payload.key)
  console.log(`\nNome: ${payload.name}`)
  console.log(`ID: ${payload.id}`)
  if (payload.expiresAt) console.log(`Expira: ${payload.expiresAt}`)
  console.log('\nNo projeto consumidor:')
  console.log(`  npx componentes-bloomin login --api-key ${payload.key} --registry ${baseUrl}`)
}

async function init(options) {
  let config = readConfig()
  const apiKey = resolveApiKey(options, config)
  if (existsSync(configPath) && !options.overwrite) {
    console.log('✓ componentes-bloomin.json já existe.')
  } else {
    config = {
      registry: registryUrl(options, {}),
      installed: {},
      ...(apiKey ? { apiKey } : {}),
    }
    writeConfig(config)
    console.log('✓ componentes-bloomin.json criado.')
    console.log(`  Registry: ${config.registry}`)
    if (apiKey) console.log('  API key: configurada')
  }

  if (options.skipTheme) {
    console.log('Tema ignorado (--skip-theme).')
    return
  }

  const sessionState = session(options)
  const { themeHash } = await installTheme(
    sessionState.baseUrl,
    options,
    sessionState.paths,
    sessionState.apiKey,
  )
  writeConfig({
    ...readConfig(),
    registry: sessionState.baseUrl,
    themeHash,
    ...(sessionState.apiKey ? { apiKey: sessionState.apiKey } : {}),
  })
  console.log('\nPronto. Em seguida: componentes-bloomin add recipe:institutional')
  console.log('Sync contínuo: componentes-bloomin watch')
}

async function list(options) {
  const { baseUrl, apiKey, paths } = session(options)
  const registry = await fetchJson(paths.registry, { apiKey })
  const items =
    registry.items?.filter(
      (item) => item.name !== 'componentes-bloomin' && item.kind !== 'recipe',
    ) ?? []

  console.log(`\nComponentes Bloomin — ${items.length} itens\n`)
  for (const item of items) {
    console.log(`${item.name.padEnd(34)} ${item.title}`)
  }
  console.log('\nTemplates: componentes-bloomin recipes')
  console.log(`Modo: ${paths.mode === 'api' ? 'API autenticada' : 'registry público'}`)
  console.log(`Feed: ${paths.feed}\n`)
  void baseUrl
}

async function recipes(options) {
  const { apiKey, paths } = session(options)
  let payload
  try {
    payload = await fetchJson(paths.recipes, { apiKey })
  } catch {
    fail('Não foi possível carregar as receitas. Rode npm run registry:build no catálogo.')
  }

  const listItems = payload.recipes ?? []
  console.log(`\nTemplates Bloomin — ${listItems.length} receitas\n`)
  for (const recipe of listItems) {
    console.log(`${`recipe:${recipe.id}`.padEnd(34)} ${recipe.name}`)
    console.log(`  ${recipe.description}`)
    console.log(`  Componentes: ${recipe.components.join(', ')}\n`)
  }
}

async function fetchRegistryItem(id, paths, apiKey) {
  try {
    return await fetchJson(paths.item(id), { apiKey })
  } catch (error) {
    if (typeof paths.itemPublic === 'function') {
      console.log(`! API item falhou para ${id}; usando registry público.`)
      return await fetchJson(paths.itemPublic(id), { apiKey })
    }
    throw error
  }
}

async function installRegistryItems(itemIds, options, paths, apiKey) {
  const registryItems = await Promise.all(
    itemIds.map((item) => fetchRegistryItem(item, paths, apiKey)),
  )
  const files = new Map()
  const dependencies = new Set()

  for (const item of registryItems) {
    if (item.registry !== 'componentes-bloomin' || item.schemaVersion !== 1) {
      fail(`O item "${item.name ?? 'desconhecido'}" não pertence ao registry Componentes Bloomin.`)
    }
    if (item.kind === 'recipe') {
      console.log(`\nTemplate: ${item.title} (${item.components?.length ?? 0} componentes)`)
    }
    for (const file of item.files ?? []) {
      if (!file.target || typeof file.content !== 'string') {
        fail(`O item "${item.name}" contém um arquivo inválido.`)
      }
      const next = {
        content: file.content,
        encoding: file.encoding === 'base64' ? 'base64' : 'utf8',
      }
      const previous = files.get(file.target)
      if (
        previous &&
        (normalizeFileEntry(previous).encoding !== next.encoding ||
          normalizeFileEntry(previous).content !== next.content)
      ) {
        fail(`Dois itens tentaram instalar conteúdos diferentes em ${file.target}.`)
      }
      files.set(file.target, next)
    }
    for (const dependency of item.dependencies ?? []) dependencies.add(dependency)
  }

  const result = writeFiles(files, options)

  if (!options.skipInstall) {
    installDependencies([...dependencies].sort(), detectPackageManager(options.packageManager))
  }

  return { result, registryItems, dependencies }
}

async function add(options) {
  if (!options.items.length) {
    fail('Informe ao menos um ID. Exemplo: componentes-bloomin add faq-search')
  }

  ensureMirrorConfig(options)
  const { config, baseUrl, apiKey, paths } = session(options)

  const requestedItems = options.items.map(normalizeItemId)
  const { result, registryItems, dependencies } = await installRegistryItems(
    requestedItems,
    options,
    paths,
    apiKey,
  )

  const mirroringAll = requestedItems.includes('componentes-bloomin')
  writeConfig(
    rememberInstalled(
      {
        ...config,
        registry: baseUrl,
        ...(apiKey ? { apiKey } : {}),
        ...(mirroringAll ? { syncMode: 'mirror' } : {}),
      },
      registryItems,
    ),
  )

  console.log(
    `\nConcluído: ${result.created} criado(s), ${result.updated} atualizado(s), ${result.skipped} mantido(s).`,
  )
  if (options.skipInstall && dependencies.size) {
    console.log(`Dependências não instaladas: ${[...dependencies].sort().join(', ')}`)
  }
  if (mirroringAll) {
    console.log('Pronto. Para manter atualizado: npx componentes-bloomin watch')
  }
}

async function fetchFeed(paths, apiKey) {
  try {
    return await fetchJson(paths.feed, { apiKey })
  } catch (error) {
    fail(
      `Não foi possível ler ${paths.feed}. ${error instanceof Error ? '' : ''}Confira a API key e o deploy do catálogo.`,
    )
  }
}

function resolveSyncTargets(options, config, feed) {
  // Mirror / --all: sempre puxa a coleção completa (inclui componentes novos).
  if (isMirrorMode(options, config)) return ['componentes-bloomin']
  if (options.items.length) return options.items.map(normalizeItemId)

  const installed = Object.keys(config.installed ?? {})
  if (!installed.length) {
    fail('Nenhum componente rastreado. Rode "add all", ou use "sync --mirror" / "watch --mirror".')
  }

  const feedByName = new Map((feed.items ?? []).map((item) => [item.name, item]))
  return installed.filter((name) => {
    const local = config.installed[name]
    const remote = feedByName.get(name)
    if (!remote) {
      console.log(`! Removido do catálogo: ${name}`)
      return false
    }
    return local?.hash !== remote.hash
  })
}

async function syncOnce(options, { quiet = false } = {}) {
  const { baseUrl, apiKey, paths } = session(options)
  const feed = await fetchFeed(paths, apiKey)
  const syncOptions = { ...options, overwrite: true }
  const config = readConfig()

  let themeUpdated = false
  if (!options.skipTheme && config.themeHash && config.themeHash !== feed.themeHash) {
    if (!quiet) console.log('\nTema desatualizado — sincronizando...')
    const { themeHash } = await installTheme(baseUrl, syncOptions, paths, apiKey)
    writeConfig({ ...readConfig(), registry: baseUrl, themeHash })
    themeUpdated = true
  } else if (!options.skipTheme && !config.themeHash && feed.themeHash) {
    writeConfig({ ...readConfig(), themeHash: feed.themeHash })
  }

  const targets = resolveSyncTargets(options, readConfig(), feed)
  if (!targets.length) {
    if (!quiet || themeUpdated) {
      console.log(
        themeUpdated
          ? '\nTema atualizado. Componentes já estavam em dia.'
          : `\nTudo em dia com ${baseUrl} (libraryHash ${feed.libraryHash.slice(0, 12)}…).`,
      )
    }
    return { updated: themeUpdated, feed }
  }

  if (!quiet) {
    console.log(`\nSincronizando ${targets.length} item(ns) via ${paths.mode}...`)
  }

  const { result, registryItems } = await installRegistryItems(targets, syncOptions, paths, apiKey)
  writeConfig(
    rememberInstalled(
      {
        ...readConfig(),
        registry: baseUrl,
        lastLibraryHash: feed.libraryHash,
        ...(apiKey ? { apiKey } : {}),
        ...(isMirrorMode(options, readConfig()) ? { syncMode: 'mirror' } : {}),
      },
      registryItems,
    ),
  )

  console.log(
    `\nSync: ${result.created} criado(s), ${result.updated} atualizado(s), ${result.skipped} mantido(s).`,
  )
  return { updated: true, feed }
}

async function sync(options) {
  ensureMirrorConfig(options)
  await syncOnce({ ...options, mirror: true, overwrite: true })
}

/** Um comando só: tema + biblioteca completa + watch contínuo. */
async function mirror(options) {
  const mirrorOptions = { ...options, mirror: true, overwrite: true }
  ensureMirrorConfig(mirrorOptions)

  const cfg = readConfig()
  console.log(`\nEspelhando via API ${cfg.registry}/api/v1`)
  console.log('Auth: API key do componentes-bloomin.json (sem login)\n')

  if (!options.skipTheme) {
    const sessionState = session(mirrorOptions)
    const { themeHash } = await installTheme(
      sessionState.baseUrl,
      mirrorOptions,
      sessionState.paths,
      sessionState.apiKey,
    )
    writeConfig({ ...readConfig(), themeHash, syncMode: 'mirror' })
  }

  await add({ ...mirrorOptions, items: ['all'] })
  await watch(mirrorOptions)
}

async function watch(options) {
  ensureMirrorConfig(options)
  const { baseUrl, apiKey, paths } = session(options)
  const tracked = Object.keys(readConfig().installed ?? {})

  if (paths.mode !== 'api' || !apiKey) {
    fail('API key ausente. Coloque "apiKey" em componentes-bloomin.json e rode de novo.')
  }

  console.log(`\nWatch ativo em ${baseUrl}`)
  console.log(`API: ${paths.feed}`)
  console.log('Auth: Bearer API key (sem login)')
  console.log('Componentes novos no catálogo entram automaticamente neste projeto.')
  console.log(`Intervalo: ${options.interval}s — Ctrl+C para parar.\n`)

  let lastHash = readConfig().lastLibraryHash ?? null

  if (!tracked.includes('componentes-bloomin')) {
    console.log('Primeira sincronização (biblioteca completa)...')
    await syncOnce({ ...options, mirror: true, overwrite: true }, { quiet: false })
    lastHash = readConfig().lastLibraryHash ?? lastHash
  }

  for (;;) {
    try {
      const feed = await fetchFeed(paths, apiKey)
      if (feed.libraryHash !== lastHash) {
        const stamp = new Date().toLocaleTimeString()
        console.log(`\n[${stamp}] Mudança detectada (${feed.libraryHash.slice(0, 12)}…)`)
        await syncOnce({ ...options, mirror: true, overwrite: true }, { quiet: false })
        lastHash = feed.libraryHash
        writeConfig({
          ...readConfig(),
          lastLibraryHash: lastHash,
          syncMode: 'mirror',
        })
      } else {
        process.stdout.write(`.`)
      }
    } catch (error) {
      console.error(`\n! Falha no watch: ${error instanceof Error ? error.message : error}`)
    }
    await delay(options.interval * 1000)
  }
}

const options = parseArguments(argv)
const subcommand = argv[1]

if (command === 'help' || command === '--help' || command === '-h') {
  printHelp()
} else if (command === 'mirror') {
  await mirror(options)
} else if (command === 'init') {
  await init(options)
} else if (command === 'login') {
  await login(options)
} else if (command === 'key' && (subcommand === 'create' || subcommand === 'issue')) {
  const keyArgs = parseArguments(['key', ...argv.slice(2)])
  await keyCreate(keyArgs)
} else if (command === 'list') {
  await list(options)
} else if (command === 'recipes') {
  await recipes(options)
} else if (command === 'add') {
  await add(options)
} else if (command === 'sync') {
  await sync(options)
} else if (command === 'watch') {
  await watch(options)
} else {
  fail(`Comando desconhecido: ${command}. Use "componentes-bloomin help".`)
}
