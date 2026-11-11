import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const root = resolve(import.meta.dirname, '..')
const categories = [
  'primitives',
  'navigation',
  'marketing',
  'content',
  'data-display',
  'forms',
  'feedback',
  'motion',
]
const args = process.argv.slice(2)

function option(name) {
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : undefined
}

function kebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function fail(message) {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

function replaceRequired(source, search, replacement, file) {
  if (!source.includes(search)) fail(`Marcador não encontrado em ${file}.`)
  return source.replace(search, replacement)
}

function insertBeforeLast(source, search, insertion, file) {
  const index = source.lastIndexOf(search)
  if (index < 0) fail(`Fechamento "${search.trim()}" não encontrado em ${file}.`)
  return `${source.slice(0, index)}${insertion}${source.slice(index)}`
}

function addLibraryImport(source, name) {
  const pattern = /import \{([^}]*)\} from '@\/components\/library'/
  const match = source.match(pattern)
  if (!match) return `import { ${name} } from '@/components/library'\n${source}`
  const names = match[1]
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  if (!names.includes(name)) names.push(name)
  names.sort((a, b) => a.localeCompare(b))
  return source.replace(pattern, `import { ${names.join(', ')} } from '@/components/library'`)
}

function incrementFirst(source, pattern, replacement) {
  const match = source.match(pattern)
  if (!match) return source
  return source.replace(pattern, replacement(Number(match[1]) + 1))
}

async function collectAnswers() {
  const positional = args.filter((value, index) => {
    if (value.startsWith('--')) return false
    return index === 0 || !args[index - 1]?.startsWith('--')
  })
  let name = option('--name') ?? positional[0]
  let category = option('--category') ?? positional[1]
  let description = option('--description')
  const interactive = !name || !category
  const prompt = interactive ? createInterface({ input, output }) : null

  if (!name) name = await prompt.question('Nome em PascalCase (ex.: AlertCard): ')
  if (!category) {
    category = await prompt.question(`Categoria (${categories.join(', ')}): `)
  }
  if (!description && prompt) {
    description = await prompt.question('Descrição curta (opcional): ')
  }
  prompt?.close()

  return {
    name: name.trim(),
    category: category.trim(),
    description: description?.trim() || `Componente ${name.trim()} reutilizável.`,
    client: args.includes('--client'),
    dryRun: args.includes('--dry-run'),
    skipBuild: args.includes('--skip-build'),
  }
}

function updateReadmeCount() {
  const readmePath = resolve(root, 'README.md')
  if (!existsSync(readmePath)) return
  const readme = incrementFirst(
    readFileSync(readmePath, 'utf8'),
    /Biblioteca com (\d+) componentes/,
    (count) => `Biblioteca com ${count} componentes`,
  )
  writeFileSync(readmePath, readme)
}

async function main() {
  const { name, category, description, client, dryRun, skipBuild } = await collectAnswers()
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    fail('O nome deve usar PascalCase e conter apenas letras e números.')
  }
  if (!categories.includes(category)) {
    fail(`Categoria inválida. Use: ${categories.join(', ')}.`)
  }

  const id = option('--id') ?? kebabCase(name)
  const componentPath = resolve(root, 'src/components/library', category, `${name}.tsx`)
  if (existsSync(componentPath)) fail(`O arquivo ${name}.tsx já existe em ${category}.`)

  const catalogDirectory = resolve(root, 'src/components/library/catalog')
  const manifestPath = resolve(catalogDirectory, 'manifest', `${category}.ts`)
  const previewsPath = resolve(catalogDirectory, 'previews', `${category}.tsx`)
  const indexPath = resolve(root, 'src/components/library/index.ts')
  const idAlreadyUsed = categories.some((item) =>
    readFileSync(resolve(catalogDirectory, 'manifest', `${item}.ts`), 'utf8').includes(
      `id: '${id}'`,
    ),
  )
  if (idAlreadyUsed) fail(`O ID "${id}" já está registrado.`)

  const componentCode = `${client ? "'use client'\n\n" : ''}import { cn } from '@/lib/utils'

export type ${name}Props = {
  title: string
  description?: string
  className?: string
}

export function ${name}({ title, description, className }: ${name}Props) {
  return (
    <section className={cn('rounded-2xl border bg-card p-6', className)}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description ? (
        <p className="mt-2 text-muted-foreground">{description}</p>
      ) : null}
    </section>
  )
}
`

  const manifestEntry = `  {
    id: '${id}',
    name: '${name}',
    category: '${category}',
    description: ${JSON.stringify(description)},
    importPath: '@/components/library/${category}/${name}',
    client: ${client},
    dependencies: [],
    props: [
      prop('title', 'string', 'Título.', true),
      prop('description', 'string', 'Descrição.'),
      prop('className', 'string', 'Classes adicionais.'),
    ],
    variants: ['padrão', 'com descrição'],
    tags: ['${category}', 'reutilizável'],
    example: \`<${name} title="Lorem ipsum" description="Dolor sit amet." />\`,
  },
`

  const previewEntry = `  '${id}': () => (
    <${name}
      title="Lorem ipsum dolor"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    />
  ),
`

  if (dryRun) {
    console.log(`\nComponente: ${name}`)
    console.log(`ID: ${id}`)
    console.log(`Categoria: ${category}`)
    console.log(`Arquivo: src/components/library/${category}/${name}.tsx`)
    console.log('Modo simulação: nenhum arquivo foi alterado.\n')
    return
  }

  await mkdir(resolve(root, 'src/components/library', category), { recursive: true })
  writeFileSync(componentPath, componentCode)

  let index = readFileSync(indexPath, 'utf8')
  index = replaceRequired(
    index,
    '// Catalog metadata',
    `export * from './${category}/${name}'\n\n// Catalog metadata`,
    'index.ts',
  )
  writeFileSync(indexPath, index)

  const manifestFile = `manifest/${category}.ts`
  writeFileSync(
    manifestPath,
    insertBeforeLast(readFileSync(manifestPath, 'utf8'), '\n]', `\n${manifestEntry}`, manifestFile),
  )

  const previewsFile = `previews/${category}.tsx`
  let previews = addLibraryImport(readFileSync(previewsPath, 'utf8'), name)
  previews = insertBeforeLast(previews, '\n}', `\n${previewEntry}`, previewsFile)
  writeFileSync(previewsPath, previews)

  updateReadmeCount()

  if (!skipBuild) {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    execFileSync(npm, ['run', 'format'], { cwd: root, stdio: 'inherit' })
    execFileSync(npm, ['run', 'registry:build'], { cwd: root, stdio: 'inherit' })
  }

  console.log(`\n✓ ${name} criado e registrado como "${id}".`)
  console.log(`  Edite: src/components/library/${category}/${name}.tsx`)
  console.log(`  Preview: http://localhost:2004/componentes/${id}\n`)
}

await main()
