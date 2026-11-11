import type { BuilderPlacement } from './builderSteps'

export type PageSnippet = {
  name: string
  title: string
  jsx: string
  declarations: { name: string; code: string }[]
  imports: { module: string; name: string; imported: string }[]
  dependencies: string[]
  files: { path: string; content: string }[]
}

export type ThemeBundle = {
  dependencies: string[]
  files: { path: string; content: string }[]
}

export type PageSection = {
  snippet: PageSnippet
  stepTitle: string
  placement: BuilderPlacement
}

export type GeneratePageOptions = {
  sections: PageSection[]
  route: string
  theme?: ThemeBundle
}

export type GeneratedPage = {
  document: string
  files: { path: string; content: string }[]
  installCommand: string
}

const placementOrder: BuilderPlacement[] = ['header', 'main', 'footer', 'floating']

function packageOf(dependency: string) {
  const versionAt = dependency.lastIndexOf('@')
  return versionAt > 0 ? dependency.slice(0, versionAt) : dependency
}

function indent(code: string, spaces: number) {
  const pad = ' '.repeat(spaces)
  return code
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n')
}

export function normalizeRoute(route: string) {
  const segments = route
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split('/')
    .map((segment) => segment.replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean)
  return `/${segments.join('/')}`
}

function componentNameFor(route: string) {
  if (route === '/') return 'PaginaInicial'
  return `Pagina${route
    .split(/[/-]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')}`
}

function importLines(imports: Map<string, Map<string, string>>) {
  const rank = (module: string) => (module === 'react' ? 0 : module.startsWith('@/') ? 2 : 1)
  return Array.from(imports.entries())
    .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
    .map(([module, names]) => {
      const specifiers = Array.from(names.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([local, imported]) =>
          imported === 'default' ? null : imported === local ? local : `${imported} as ${local}`,
        )
        .filter(Boolean) as string[]
      const defaultName = Array.from(names.entries()).find(
        ([, imported]) => imported === 'default',
      )?.[0]
      const named = specifiers.length ? `{ ${specifiers.join(', ')} }` : ''
      const clause = [defaultName, named].filter(Boolean).join(', ')
      const line = `import ${clause} from '${module}'`
      if (line.length <= 100 || !specifiers.length) return line
      const multiline = `{\n${specifiers.map((specifier) => `  ${specifier},`).join('\n')}\n}`
      return `import ${[defaultName, multiline].filter(Boolean).join(', ')} from '${module}'`
    })
}

function languageOf(path: string) {
  const extension = path.split('.').pop() ?? ''
  return { tsx: 'tsx', ts: 'ts', js: 'js', jsx: 'jsx', css: 'css' }[extension] ?? ''
}

export function generatePageDocument({
  sections,
  route: rawRoute,
  theme,
}: GeneratePageOptions): GeneratedPage {
  const route = normalizeRoute(rawRoute)
  const componentName = componentNameFor(route)
  const componentPath = `src/components/paginas/${componentName}.tsx`
  const pagePath = route === '/' ? 'src/app/page.tsx' : `src/app${route}/page.tsx`

  const ordered = placementOrder.flatMap((placement) =>
    sections.filter((section) => section.placement === placement),
  )

  const imports = new Map<string, Map<string, string>>()
  const declarations = new Map<string, string>()
  const libraryFiles = new Map<string, string>()
  const dependencies = new Map<string, string>()

  for (const { snippet } of ordered) {
    for (const { module, name, imported } of snippet.imports) {
      if (!imports.has(module)) imports.set(module, new Map())
      imports.get(module)!.set(name, imported)
    }
    for (const { name, code } of snippet.declarations) {
      if (!declarations.has(name)) declarations.set(name, code)
    }
    for (const file of snippet.files) libraryFiles.set(file.path, file.content)
    for (const dependency of snippet.dependencies) {
      dependencies.set(packageOf(dependency), dependency)
    }
  }
  for (const dependency of theme?.dependencies ?? []) {
    dependencies.set(packageOf(dependency), dependency)
  }

  const renderSection = ({ snippet, stepTitle }: PageSection, spaces: number) =>
    `${' '.repeat(spaces)}{/* ${stepTitle} · ${snippet.title} (${snippet.name}) */}\n${indent(snippet.jsx, spaces)}`

  const inPlacement = (placement: BuilderPlacement) =>
    ordered.filter((section) => section.placement === placement)
  const mainSections = inPlacement('main')
  const body = [
    ...inPlacement('header').map((section) => renderSection(section, 6)),
    mainSections.length
      ? `      <main>\n${mainSections.map((section) => renderSection(section, 8)).join('\n\n')}\n      </main>`
      : '',
    ...inPlacement('footer').map((section) => renderSection(section, 6)),
    ...inPlacement('floating').map((section) => renderSection(section, 6)),
  ].filter(Boolean)

  const componentSource = [
    "'use client'",
    '',
    ...importLines(imports),
    '',
    ...Array.from(declarations.values()).flatMap((code) => [code, '']),
    `export function ${componentName}() {`,
    '  return (',
    '    <>',
    body.join('\n\n'),
    '    </>',
    '  )',
    '}',
    '',
  ].join('\n')

  const pageSource = `import { Suspense } from 'react'
import { ${componentName} } from '@/components/paginas/${componentName}'

export default function Page() {
  return (
    <Suspense>
      <${componentName} />
    </Suspense>
  )
}
`

  const files = [
    { path: pagePath, content: pageSource },
    { path: componentPath, content: componentSource },
    ...Array.from(libraryFiles.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, content]) => ({ path, content })),
    ...(theme?.files ?? []),
  ]

  const installCommand = dependencies.size
    ? `npm install ${Array.from(dependencies.values())
        .sort()
        .map((dependency) => `"${dependency}"`)
        .join(' ')}`
    : ''
  const usesNextImage = files.some(({ content }) => content.includes("from 'next/image'"))

  const steps = [
    'Faça a limpeza descrita na seção "Limpeza do template" **antes** de criar os arquivos.',
    'Para cada seção "Arquivo: `caminho`", crie o arquivo exatamente nesse caminho, a partir da raiz do projeto. Se ele já existir, **apague todo o conteúdo antigo e substitua pelo novo**. Nunca mescle com o que já existia nem preserve seções, imports ou JSX anteriores.',
    'Copie o conteúdo do bloco de código **literalmente**. Não refatore, não renomeie, não reformate, não traduza, não remova comentários e não "melhore" nada.',
    'Não adicione seções, textos ou componentes que não estejam neste documento.',
    ...(installCommand ? ['Instale as dependências com o comando da seção "Dependências".'] : []),
    'Ao final, liste os arquivos criados, substituídos e removidos.',
  ]

  const document = [
    '# Página montada com Componentes Bloomin',
    '',
    `Rota: \`${route}\` · ${ordered.length} seções · ${files.length} arquivos`,
    '',
    '## Instruções para a IA',
    '',
    'Este documento contém o código completo e pronto de uma página. A página final deve conter **somente** as seções listadas em "Estrutura da página", na mesma ordem. Sua tarefa é limpar o conteúdo de exemplo do template e separar este documento em arquivos:',
    '',
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    'Requisitos do projeto: Next.js com App Router, TypeScript, Tailwind CSS 3 e o alias `@/*` apontando para `src/*`. Se o projeto usar a pasta `app/` na raiz (sem `src/`), remova o prefixo `src/` de todos os caminhos deste documento, mantendo o alias `@/*` apontando para a raiz.',
    '',
    '## Limpeza do template',
    '',
    'O conteúdo que vem de fábrica no template deve sair, para que só as seções deste documento apareçam:',
    '',
    `1. \`${pagePath}\` será substituído por inteiro: descarte todo o conteúdo atual (hero, cards, links e imagens de exemplo).`,
    '2. No `layout.tsx` raiz, deixe o `<body>` renderizando apenas `{children}`. Remova navbar, header, footer, banners, wrappers com estilo e qualquer outro elemento visual do template. Mantenha `metadata`, fontes, providers sem UI e o import de `globals.css`.',
    '3. Apague os componentes, seções e estilos de exemplo do template que deixarem de ser usados (por exemplo `page.module.css`, pastas de seções de demonstração) e os assets padrão sem referência em `public/` (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`).',
    '4. Não altere configurações, rotas de API, autenticação ou lógica de negócio do projeto.',
    '',
    ...(installCommand ? ['## Dependências', '', '```bash', installCommand, '```', ''] : []),
    ...(usesNextImage
      ? [
          '## Ajuste de imagens',
          '',
          'As imagens de exemplo vêm de `images.unsplash.com`. Adicione apenas esta entrada em `images.remotePatterns` no `next.config` do projeto, sem alterar o restante:',
          '',
          '```js',
          "{ protocol: 'https', hostname: 'images.unsplash.com' }",
          '```',
          '',
        ]
      : []),
    '## Estrutura da página',
    '',
    ...ordered.map(
      ({ snippet, stepTitle }, index) =>
        `${index + 1}. ${stepTitle} — ${snippet.title} (\`${snippet.name}\`)`,
    ),
    '',
    '## Arquivos',
    '',
    ...files.flatMap(({ path, content }) => [
      `### Arquivo: \`${path}\``,
      '',
      `\`\`\`\`${languageOf(path)}`,
      content.trimEnd(),
      '````',
      '',
    ]),
  ]
    .filter((line, index, lines) => line !== '' || lines[index - 1] !== '')
    .join('\n')

  return { document, files, installCommand }
}
