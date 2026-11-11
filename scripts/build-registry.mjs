import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import ts from 'typescript'

import { extractPageSnippets } from './page-snippets.mjs'

function hashPayload(parts) {
  const hash = createHash('sha256')
  for (const part of parts) hash.update(String(part))
  return hash.digest('hex')
}

function hashFiles(files) {
  const sorted = [...files].sort((a, b) =>
    String(a.target ?? a.path).localeCompare(String(b.target ?? b.path)),
  )
  return hashPayload(
    sorted.flatMap((file) => [file.target ?? file.path ?? '', '\0', file.content ?? '', '\0']),
  )
}

const root = resolve(import.meta.dirname, '..')
const outputDirectory = resolve(root, 'public/registry')
const manifestPath = resolve(root, 'src/components/library/catalog/manifest/index.ts')
const registryBaseUrl = (
  process.env.VITE_REGISTRY_URL ??
  process.env.NEXT_PUBLIC_REGISTRY_URL ??
  'https://componentes-indol.vercel.app'
).replace(/\/+$/, '')
const layoutRecipesPath = resolve(root, 'src/components/library/catalog/layoutRecipes.ts')
const catalogFiltersPath = resolve(root, 'src/components/library/catalog/catalogFilters.ts')
const packageVersion = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).version

/**
 * Etapa de página a que o componente serve (usada por consumidores como o wizard do boilerplate).
 * Vem dos tópicos do catálogo (catalogFilters.ts): o primeiro tópico que casa define a etapa,
 * exceto nos ids abaixo, onde o primeiro tópico não representa o uso real.
 */
const STAGE_BY_TOPIC = {
  topbar: 'topbar',
  banner: 'hero',
  navbar: 'header',
  faq: 'faq',
  testimonials: 'depoimentos',
  about: 'sobre',
  contact: 'contato',
  products: 'servicos',
  differentials: 'diferenciais',
  breadcrumbs: 'breadcrumbs',
  blog: 'blog',
  footer: 'footer',
  floating: 'flutuantes',
  cards: 'cards',
  galleries: 'galeria',
  cta: 'cta',
}
const STAGE_BY_ID = {
  'team-grid': 'equipe',
  'team-section': 'equipe',
  'credibility-section': 'diferenciais',
  'coverage-callout': 'contato',
  'service-area-cards': 'servicos',
}
const STAGE_LABELS = {
  topbar: 'Top bar',
  header: 'Header',
  hero: 'Hero',
  sobre: 'Sobre',
  servicos: 'Serviços e produtos',
  diferenciais: 'Diferenciais',
  equipe: 'Equipe',
  depoimentos: 'Depoimentos',
  faq: 'FAQ',
  cta: 'CTA',
  contato: 'Contato',
  footer: 'Rodapé',
  breadcrumbs: 'Breadcrumbs',
  blog: 'Blog',
  flutuantes: 'Flutuantes',
  cards: 'Cards',
  galeria: 'Galeria',
}
const frameworkPackages = new Set(['react', 'react-dom', 'next'])
const packageVersions = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).dependencies
const withVersion = (dependency) =>
  packageVersions[dependency] ? `${dependency}@${packageVersions[dependency]}` : dependency
const categoryGuidance = {
  primitives: 'Peças pequenas para compor ações, títulos, mídia e estrutura.',
  navigation: 'Cabeçalhos, navbars, menus, breadcrumbs e rodapés.',
  marketing: 'Banners, heros e cabeçalhos para abertura de páginas.',
  content: 'Seções institucionais, narrativas, galerias, métricas e processos.',
  'data-display': 'Produtos, cards, tabelas, preços, equipes e coleções de dados.',
  forms: 'Contato, newsletter, pesquisa e captura de dados.',
  feedback: 'FAQ, depoimentos, CTAs, estados, diálogos e notificações.',
  motion: 'Animações e comportamentos visuais progressivos.',
}
function loadLayoutRecipes() {
  return loadTypeScriptModule(layoutRecipesPath).layoutRecipes
}

function loadTypeScriptModule(file, cache = new Map()) {
  if (cache.has(file)) return cache.get(file).exports

  const module = { exports: {} }
  cache.set(file, module)
  const compiled = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
  const localRequire = (specifier) => {
    const base = resolve(dirname(file), specifier)
    const target = [`${base}.ts`, resolve(base, 'index.ts')].find((path) => existsSync(path))
    if (!target) throw new Error(`Não foi possível resolver "${specifier}" em ${file}`)
    return loadTypeScriptModule(target, cache)
  }
  new Function('require', 'module', 'exports', compiled)(localRequire, module, module.exports)
  return module.exports
}

function loadManifest() {
  return loadTypeScriptModule(manifestPath).componentManifest
}

function resolveSourcePath(importPath, importer) {
  const base = importPath.startsWith('@/')
    ? resolve(root, 'src', importPath.slice(2))
    : importPath.startsWith('.')
      ? resolve(dirname(importer), importPath)
      : null

  if (!base) return null
  const candidates = extname(base)
    ? [base]
    : [
        `${base}.ts`,
        `${base}.tsx`,
        `${base}.js`,
        `${base}.jsx`,
        resolve(base, 'index.ts'),
        resolve(base, 'index.tsx'),
      ]
  return candidates.find((candidate) => existsSync(candidate)) ?? null
}

function packageName(importPath) {
  if (importPath.startsWith('@')) return importPath.split('/').slice(0, 2).join('/')
  return importPath.split('/')[0]
}

function registryFileType(path) {
  const normalized = path.replaceAll('\\', '/')
  if (normalized.startsWith('public/')) return 'asset'
  if (normalized.includes('/components/ui/')) return 'ui'
  if (normalized.includes('/hooks/') || normalized.includes('/lib/hooks/')) return 'hook'
  if (normalized.includes('/lib/')) return 'lib'
  return 'component'
}

const BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.ico',
  '.mp4',
  '.webm',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.pdf',
])

/** Entrada do registry: texto UTF-8 ou binário em base64. */
function readRegistryFile(absolutePath) {
  const encoding = BINARY_EXTENSIONS.has(extname(absolutePath).toLowerCase()) ? 'base64' : 'utf8'
  const content = readFileSync(absolutePath, encoding === 'base64' ? null : 'utf8')
  return {
    content: encoding === 'base64' ? content.toString('base64') : content,
    ...(encoding === 'base64' ? { encoding: 'base64' } : {}),
  }
}

function listPublicFiles(absoluteDir) {
  if (!existsSync(absoluteDir)) return []
  const out = []
  const stack = [absoluteDir]
  while (stack.length) {
    const current = stack.pop()
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
        continue
      }
      if (entry.isFile()) out.push(full)
    }
  }
  return out
}

/**
 * Inclui demos estáticos referenciados no código (`/liquid-buttons/`, `/nimbus/index.html`, …)
 * para a API/CLI entregarem CSS, JS e efeitos junto com o componente.
 */
function attachPublicAssets(files) {
  const publicRoot = resolve(root, 'public')
  const queued = new Set()

  const enqueue = (webPath) => {
    const cleaned = webPath.split('?')[0].split('#')[0]
    if (!cleaned.startsWith('/') || cleaned.startsWith('/registry')) return
    queued.add(cleaned)
  }

  for (const entry of files.values()) {
    const source = typeof entry === 'string' ? entry : entry.content
    if (typeof source !== 'string' || entry.encoding === 'base64') continue
    for (const match of source.matchAll(/['"`](\/(?!\/)[a-zA-Z0-9._/-]*?)['"`]/g)) {
      enqueue(match[1])
    }
  }

  const includeTree = (dirAbsolute) => {
    const dirRel = relative(publicRoot, dirAbsolute)
    if (!dirRel || dirRel.startsWith('..')) return
    if (!existsSync(dirAbsolute) || !statSync(dirAbsolute).isDirectory()) return
    for (const filePath of listPublicFiles(dirAbsolute)) {
      if (!files.has(filePath)) files.set(filePath, readRegistryFile(filePath))
    }
  }

  for (const webPath of queued) {
    const absolute = resolve(publicRoot, `.${webPath}`)
    const rel = relative(publicRoot, absolute)
    if (!rel || rel.startsWith('..') || rel.includes('..')) continue

    // Pasta de demo completa (ex.: /hueline/index.html → public/hueline/**)
    const topSegment = webPath.split('/').filter(Boolean)[0]
    if (topSegment && !['registry', 'images', 'fonts', 'logo'].includes(topSegment)) {
      includeTree(resolve(publicRoot, topSegment))
    }

    if (existsSync(absolute) && statSync(absolute).isFile()) {
      if (!files.has(absolute)) files.set(absolute, readRegistryFile(absolute))
      continue
    }

    const asDir = webPath.endsWith('/')
      ? absolute
      : existsSync(absolute) && statSync(absolute).isDirectory()
        ? absolute
        : resolve(publicRoot, `.${webPath.replace(/\/?$/, '')}`)

    includeTree(asDir)
  }

  return files
}

function collectFiles(entryPath) {
  const files = new Map()
  const dependencies = new Set()
  const pending = [entryPath]
  const importPattern = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g

  while (pending.length) {
    const current = pending.pop()
    if (!current || files.has(current)) continue

    const content = readFileSync(current, 'utf8')
    files.set(current, { content })
    importPattern.lastIndex = 0

    for (const match of content.matchAll(importPattern)) {
      const importPath = match[1]
      const localPath = resolveSourcePath(importPath, current)
      if (localPath) {
        pending.push(localPath)
        continue
      }
      if (importPath.startsWith('.') || importPath.startsWith('@/')) continue

      const dependency = packageName(importPath)
      if (!frameworkPackages.has(dependency)) dependencies.add(dependency)
    }
  }

  attachPublicAssets(files)
  return { files, dependencies }
}

function serializeFiles(files) {
  return [...files.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([absolutePath, entry]) => {
      const path = relative(root, absolutePath).replaceAll('\\', '/')
      const payload = typeof entry === 'string' ? { content: entry } : entry
      return {
        path,
        type: registryFileType(path),
        target: path,
        content: payload.content,
        ...(payload.encoding ? { encoding: payload.encoding } : {}),
      }
    })
}

function fileSignature(file) {
  return `${file.encoding ?? 'utf8'}\0${file.content}`
}

function semanticRole(component) {
  const id = component.id
  if (id.startsWith('navbar-') || id === 'announcement-bar') return 'page.navigation'
  if (id.startsWith('footer-')) return 'page.footer'
  if (id.startsWith('banner-') || id.includes('hero')) return 'page.hero'
  if (id.startsWith('faq-')) return 'section.faq'
  if (id.startsWith('testimonials-')) return 'section.social-proof'
  if (id.startsWith('contact-')) return 'section.contact'
  if (id.startsWith('product-') || id === 'category-mosaic') return 'section.products'
  if (id.startsWith('about-') || id === 'media-split') return 'section.about'
  if (id.startsWith('cta-')) return 'section.conversion'
  if (component.category === 'motion') return 'enhancement.motion'
  if (component.category === 'forms') return 'element.form'
  if (component.category === 'navigation') return 'element.navigation'
  return `section.${component.category}`
}

function placementFor(role) {
  if (role === 'page.navigation') return 'before-main'
  if (role === 'page.hero') return 'start-of-main'
  if (role === 'page.footer') return 'after-main'
  if (role === 'section.conversion' || role === 'section.contact') return 'end-of-main'
  if (role === 'enhancement.motion') return 'wrap-or-enhance-content'
  return 'inside-main'
}

const manifest = loadManifest()
const layoutRecipes = loadLayoutRecipes()
const catalogFilters = loadTypeScriptModule(catalogFiltersPath)

/** Tópicos do catálogo em que o componente aparece e a etapa principal (null = sem etapa). */
function topicsAndStage(component) {
  const topics = catalogFilters.topicFilters
    .filter(
      (topic) => topic.id !== 'all' && catalogFilters.matchesSectionFilter(component, topic.id),
    )
    .map((topic) => topic.id)
  const stage =
    STAGE_BY_ID[component.id] ?? (topics.length ? STAGE_BY_TOPIC[topics[0]] : null) ?? null
  return { topics, stage }
}

/** Metadados que o consumidor precisa para listar, escolher e usar o componente sem abrir o código. */
function componentMeta(component) {
  const role = semanticRole(component)
  const { topics, stage } = topicsAndStage(component)
  return {
    category: component.category,
    role,
    placement: placementFor(role),
    stage,
    topics,
    clientComponent: component.client,
    importPath: component.importPath,
    tags: [...component.tags],
    variants: [...component.variants],
    props: component.props,
    example: component.example,
  }
}
const generatedItems = []
const allFiles = new Map()
const allDependencies = new Set()
const itemsById = new Map()

rmSync(outputDirectory, { recursive: true, force: true })
mkdirSync(outputDirectory, { recursive: true })

for (const component of manifest) {
  const entryPath = resolveSourcePath(component.importPath, manifestPath)
  if (!entryPath) throw new Error(`Arquivo não encontrado para ${component.name}`)

  const { files, dependencies } = collectFiles(entryPath)
  files.forEach((content, path) => allFiles.set(path, content))
  dependencies.forEach((dependency) => allDependencies.add(dependency))

  const item = {
    schemaVersion: 1,
    registry: 'componentes-bloomin',
    name: component.id,
    kind: 'component',
    title: component.name,
    description: component.description,
    meta: componentMeta(component),
    dependencies: [...dependencies].sort().map(withVersion),
    files: serializeFiles(files),
  }
  generatedItems.push(item)
  itemsById.set(component.id, item)
  writeFileSync(
    resolve(outputDirectory, `${component.id}.json`),
    `${JSON.stringify(item, null, 2)}\n`,
  )
}

const completeLibrary = {
  schemaVersion: 1,
  registry: 'componentes-bloomin',
  name: 'componentes-bloomin',
  kind: 'collection',
  title: 'Componentes Bloomin — biblioteca completa',
  description: 'Todos os componentes reutilizáveis e suas dependências locais.',
  dependencies: [...allDependencies].sort().map(withVersion),
  files: serializeFiles(allFiles),
}
writeFileSync(
  resolve(outputDirectory, 'componentes-bloomin.json'),
  `${JSON.stringify(completeLibrary, null, 2)}\n`,
)

const registry = {
  schemaVersion: 1,
  name: 'componentes-bloomin',
  title: 'Componentes Bloomin',
  homepage: `${registryBaseUrl}/componentes`,
  resources: {
    aiContext: `${registryBaseUrl}/registry/ai-context.json`,
    recipes: `${registryBaseUrl}/registry/recipes.json`,
    feed: `${registryBaseUrl}/registry/feed.json`,
    llms: `${registryBaseUrl}/llms.txt`,
    fullDocumentation: `${registryBaseUrl}/llms-full.txt`,
  },
  items: [
    {
      name: completeLibrary.name,
      kind: completeLibrary.kind,
      title: completeLibrary.title,
      description: completeLibrary.description,
    },
    ...generatedItems.map(({ name, kind, title, description }) => ({
      name,
      kind,
      title,
      description,
    })),
  ],
}

const knownIds = new Set(manifest.map(({ id }) => id))

for (const recipe of layoutRecipes) {
  for (const id of recipe.components) {
    if (!knownIds.has(id)) throw new Error(`Receita ${recipe.id} referencia o ID inexistente ${id}`)
  }

  const recipeFiles = new Map()
  const recipeDependencies = new Set()
  for (const id of recipe.components) {
    const item = itemsById.get(id)
    if (!item) throw new Error(`Receita ${recipe.id}: item ${id} não gerado`)
    for (const file of item.files) {
      const previous = recipeFiles.get(file.target)
      if (previous && fileSignature(previous) !== fileSignature(file)) {
        throw new Error(`Receita ${recipe.id}: conflito em ${file.target}`)
      }
      recipeFiles.set(file.target, file)
    }
    for (const dependency of item.dependencies ?? []) recipeDependencies.add(dependency)
  }

  const recipeItem = {
    schemaVersion: 1,
    registry: 'componentes-bloomin',
    name: `recipe-${recipe.id}`,
    kind: 'recipe',
    title: recipe.name,
    description: recipe.description,
    audience: recipe.audience,
    components: [...recipe.components],
    installCommand: `npx componentes-bloomin@latest add recipe:${recipe.id}`,
    dependencies: [...recipeDependencies].sort(),
    files: [...recipeFiles.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, file]) => ({
        path: file.path ?? file.target,
        type: file.type ?? registryFileType(file.target),
        target: file.target,
        content: file.content,
        ...(file.encoding ? { encoding: file.encoding } : {}),
      })),
  }
  writeFileSync(
    resolve(outputDirectory, `${recipeItem.name}.json`),
    `${JSON.stringify(recipeItem, null, 2)}\n`,
  )
  registry.items.push({
    name: recipeItem.name,
    kind: recipeItem.kind,
    title: recipeItem.title,
    description: recipeItem.description,
  })
}

writeFileSync(resolve(outputDirectory, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`)
writeFileSync(resolve(outputDirectory, 'index.json'), `${JSON.stringify(registry, null, 2)}\n`)
writeFileSync(
  resolve(outputDirectory, 'recipes.json'),
  `${JSON.stringify(
    {
      schemaVersion: 1,
      recipes: layoutRecipes.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        audience: recipe.audience,
        components: [...recipe.components],
        installCommand: `npx componentes-bloomin@latest add recipe:${recipe.id}`,
        registryItem: `recipe-${recipe.id}`,
      })),
    },
    null,
    2,
  )}\n`,
)

const pagesDirectory = resolve(outputDirectory, 'pages')
mkdirSync(pagesDirectory, { recursive: true })
const pageSnippets = extractPageSnippets({ root, componentIds: knownIds })
for (const component of manifest) {
  const snippet = pageSnippets.get(component.id)
  if (!snippet) {
    console.warn(`Sem preview para montar página: ${component.id}`)
    continue
  }

  const files = new Map()
  const dependencies = new Set()
  for (const { module } of snippet.imports) {
    const localPath = resolveSourcePath(module, manifestPath)
    if (localPath) {
      const collected = collectFiles(localPath)
      collected.files.forEach((content, path) => files.set(path, content))
      collected.dependencies.forEach((dependency) => dependencies.add(dependency))
      continue
    }
    const dependency = packageName(module)
    if (!frameworkPackages.has(dependency)) dependencies.add(dependency)
  }

  const page = {
    schemaVersion: 1,
    name: component.id,
    title: component.name,
    jsx: snippet.jsx,
    declarations: snippet.declarations,
    imports: snippet.imports,
    dependencies: [...dependencies].sort().map(withVersion),
    files: serializeFiles(files),
  }
  writeFileSync(resolve(pagesDirectory, `${component.id}.json`), `${JSON.stringify(page)}\n`)
}

const theme = {
  schemaVersion: 1,
  name: 'theme',
  dependencies: [withVersion('tailwindcss-animate')],
  files: [
    {
      path: 'tailwind.config.js',
      content: readFileSync(resolve(root, 'tailwind.config.js'), 'utf8'),
    },
    {
      path: 'src/app/globals.css',
      content: readFileSync(resolve(root, 'src/styles/globals.css'), 'utf8').replace(
        /@font-face\s*\{[^}]*\}\s*/g,
        '',
      ),
    },
  ],
}
writeFileSync(resolve(outputDirectory, 'theme.json'), `${JSON.stringify(theme, null, 2)}\n`)

// `hash` cobre só os arquivos (o CLI compara com o hash local dos arquivos instalados).
// `metaHash` cobre os metadados: mudar descrição, props ou etapa também altera o libraryHash,
// então quem faz polling percebe a mudança mesmo sem arquivo novo.
const feedItems = [
  {
    name: completeLibrary.name,
    kind: completeLibrary.kind,
    title: completeLibrary.title,
    description: completeLibrary.description,
    dependencies: completeLibrary.dependencies,
    fileCount: completeLibrary.files.length,
    hash: hashFiles(completeLibrary.files),
    url: `${registryBaseUrl}/registry/${completeLibrary.name}.json`,
  },
  ...generatedItems.map((item) => ({
    name: item.name,
    kind: item.kind,
    title: item.title,
    description: item.description,
    category: item.meta.category,
    role: item.meta.role,
    placement: item.meta.placement,
    stage: item.meta.stage,
    topics: item.meta.topics,
    tags: item.meta.tags,
    clientComponent: item.meta.clientComponent,
    importPath: item.meta.importPath,
    dependencies: item.dependencies,
    fileCount: item.files.length,
    hash: hashFiles(item.files),
    metaHash: hashPayload([JSON.stringify(item.meta), item.title, item.description]),
    url: `${registryBaseUrl}/registry/${item.name}.json`,
  })),
]

for (const recipe of layoutRecipes) {
  const recipeName = `recipe-${recipe.id}`
  const recipePath = resolve(outputDirectory, `${recipeName}.json`)
  const recipeItem = JSON.parse(readFileSync(recipePath, 'utf8'))
  feedItems.push({
    name: recipeItem.name,
    kind: recipeItem.kind,
    title: recipeItem.title,
    description: recipeItem.description,
    audience: recipeItem.audience,
    components: recipeItem.components,
    dependencies: recipeItem.dependencies,
    fileCount: recipeItem.files.length,
    hash: hashFiles(recipeItem.files),
    metaHash: hashPayload([
      recipeItem.title,
      recipeItem.description,
      recipeItem.audience,
      ...recipeItem.components,
    ]),
    url: `${registryBaseUrl}/registry/${recipeItem.name}.json`,
  })
}

const themeHash = hashFiles(theme.files)
const libraryHash = hashPayload(
  [...feedItems]
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((item) => [item.name, item.hash, item.metaHash ?? '']),
)

const stageCounts = new Map()
for (const item of generatedItems) {
  if (item.meta.stage) stageCounts.set(item.meta.stage, (stageCounts.get(item.meta.stage) ?? 0) + 1)
}

const feed = {
  schemaVersion: 1,
  registry: 'componentes-bloomin',
  version: packageVersion,
  generatedAt: new Date().toISOString(),
  libraryHash,
  themeHash,
  counts: {
    components: generatedItems.length,
    recipes: layoutRecipes.length,
  },
  stages: [...stageCounts.entries()]
    .map(([id, count]) => ({ id, label: STAGE_LABELS[id] ?? id, count }))
    .sort((a, b) => a.id.localeCompare(b.id)),
  pollHintSeconds: 5,
  endpoints: {
    registry: `${registryBaseUrl}/registry/registry.json`,
    theme: `${registryBaseUrl}/registry/theme.json`,
    feed: `${registryBaseUrl}/registry/feed.json`,
    item: `${registryBaseUrl}/registry/{name}.json`,
  },
  items: feedItems,
}

writeFileSync(resolve(outputDirectory, 'feed.json'), `${JSON.stringify(feed, null, 2)}\n`)

registry.resources = {
  ...registry.resources,
  feed: `${registryBaseUrl}/registry/feed.json`,
}
writeFileSync(resolve(outputDirectory, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`)
writeFileSync(resolve(outputDirectory, 'index.json'), `${JSON.stringify(registry, null, 2)}\n`)

const aiComponents = manifest.map((component) => {
  const role = semanticRole(component)
  const { stage, topics } = topicsAndStage(component)
  return {
    id: component.id,
    name: component.name,
    category: component.category,
    role,
    stage,
    topics,
    placement: placementFor(role),
    description: component.description,
    importPath: component.importPath,
    installCommand: `npx componentes-bloomin@latest add ${component.id}`,
    clientComponent: component.client,
    props: component.props,
    variants: component.variants,
    keywords: [...new Set([component.category, role, ...component.tags])],
    dependencies: component.dependencies,
    example: component.example,
  }
})

const aiContext = {
  schemaVersion: 1,
  library: {
    name: 'componentes-bloomin',
    displayName: 'Componentes Bloomin',
    language: 'pt-BR',
    componentCount: aiComponents.length,
    catalog: `${registryBaseUrl}/componentes`,
    installationGuide: `${registryBaseUrl}/como-utilizar`,
  },
  conventions: [
    'Use apenas componentes listados neste arquivo.',
    'Forneça textos, imagens, links, callbacks e configuração exclusivamente por props.',
    'Prefira imports diretos informados em importPath.',
    'Respeite a ordem navigation, hero, conteúdo, prova social, conversão e footer.',
    'Não invente props: consulte a lista props do componente.',
    'Componentes com clientComponent=true exigem uma fronteira client no Next.js.',
    'Preserve foco visível, semântica e prefers-reduced-motion.',
  ],
  categories: Object.entries(categoryGuidance).map(([id, description]) => ({
    id,
    description,
  })),
  layoutRecipes: layoutRecipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    audience: recipe.audience,
    components: [...recipe.components],
    installCommand: `npx componentes-bloomin@latest add recipe:${recipe.id}`,
  })),
  components: aiComponents,
}

writeFileSync(
  resolve(outputDirectory, 'ai-context.json'),
  `${JSON.stringify(aiContext, null, 2)}\n`,
)

const llmsText = `# Componentes Bloomin

> Biblioteca React, Next.js, TypeScript e Tailwind com componentes instaláveis por CLI próprio.

## Fontes principais

- [Contexto semântico para IA](${registryBaseUrl}/registry/ai-context.json): catálogo completo, props, exemplos e receitas.
- [Catálogo visual](${registryBaseUrl}/componentes): previews reais e busca.
- [Como instalar](${registryBaseUrl}/como-utilizar): instalação individual ou completa.
- [Documentação completa](${registryBaseUrl}/llms-full.txt): referência textual de todos os componentes.

## Regras essenciais

- Não invente componentes ou props.
- Use conteúdo e configuração por props.
- Importe pelo importPath declarado no contexto semântico.
- Instale com: npx componentes-bloomin@latest add <id>
- Instale um template: npx componentes-bloomin@latest add recipe:<id>
- Ou baixe o ZIP dos arquivos no catálogo (sem CLI)
- Lista de templates: ${registryBaseUrl}/registry/recipes.json
- Valide acessibilidade e responsividade.
`

const llmsFullText = `# Componentes Bloomin — referência completa

## Convenções

${aiContext.conventions.map((rule) => `- ${rule}`).join('\n')}

## Receitas de layout

${layoutRecipes
  .map(
    (recipe) =>
      `### ${recipe.name} (\`recipe:${recipe.id}\`)\n${recipe.description}\nPúblico: ${recipe.audience}\nOrdem: ${recipe.components.join(' → ')}`,
  )
  .join('\n\n')}

## Componentes

${aiComponents
  .map(
    (component) => `### ${component.name} (${component.id})
Categoria: ${component.category}
Papel: ${component.role}
Posição: ${component.placement}
Descrição: ${component.description}
Import: ${component.importPath}
Client: ${component.clientComponent ? 'sim' : 'não'}
Props: ${component.props
      .map(
        (prop) =>
          `${prop.name}: ${prop.type}${prop.required ? ' (obrigatória)' : ''}${prop.default ? ` = ${prop.default}` : ''}`,
      )
      .join('; ')}
Variantes: ${component.variants.join(', ')}
Exemplo: ${component.example}`,
  )
  .join('\n\n')}
`

writeFileSync(resolve(root, 'public/llms.txt'), llmsText)
writeFileSync(resolve(root, 'public/llms-full.txt'), llmsFullText)

console.log(
  `Registry gerado com ${generatedItems.length} componentes em ${relative(root, outputDirectory)}.`,
)
console.log(
  `Feed de sync: ${registryBaseUrl}/registry/feed.json (libraryHash ${libraryHash.slice(0, 12)}…)`,
)
