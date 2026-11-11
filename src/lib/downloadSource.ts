/** Empacota arquivos do registry num ZIP (store) sem depender da CLI nem de URL externa. */

type RegistryFile = {
  path?: string
  target?: string
  content?: string
}

type RegistryItem = {
  name?: string
  title?: string
  files?: RegistryFile[]
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff
  for (let index = 0; index < bytes.length; index += 1) {
    crc ^= bytes[index]
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1)
      crc = (crc >>> 1) ^ (0xedb88320 & mask)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function u16(value: number) {
  const buffer = new Uint8Array(2)
  new DataView(buffer.buffer).setUint16(0, value, true)
  return buffer
}

function u32(value: number) {
  const buffer = new Uint8Array(4)
  new DataView(buffer.buffer).setUint32(0, value, true)
  return buffer
}

function concat(chunks: Uint8Array[]) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const result = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  return result
}

/** ZIP sem compressão (método store). */
export function createZipStore(files: { path: string; content: string }[]) {
  const encoder = new TextEncoder()
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  for (const file of files) {
    const name = encoder.encode(file.path.replace(/^\/+/, ''))
    const data = encoder.encode(file.content)
    const checksum = crc32(data)
    const localHeader = concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(checksum),
      u32(data.length),
      u32(data.length),
      u16(name.length),
      u16(0),
      name,
    ])
    localParts.push(localHeader, data)

    centralParts.push(
      concat([
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(checksum),
        u32(data.length),
        u32(data.length),
        u16(name.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        name,
      ]),
    )
    offset += localHeader.length + data.length
  }

  const central = concat(centralParts)
  const end = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(central.length),
    u32(offset),
    u16(0),
  ])

  return new Blob([concat([...localParts, central, end])], { type: 'application/zip' })
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export async function downloadRegistryItemZip(itemId: string) {
  const response = await fetch(`/registry/${itemId}.json`)
  if (!response.ok) {
    throw new Error(`Não foi possível carregar ${itemId}`)
  }
  const item = (await response.json()) as RegistryItem
  const files = (item.files ?? [])
    .map((file) => ({
      path: (file.target || file.path || '').replace(/\\/g, '/'),
      content: file.content ?? '',
    }))
    .filter((file) => file.path && file.content !== undefined)

  if (!files.length) {
    throw new Error('Este item não possui arquivos para baixar.')
  }

  const readme = [
    `# ${item.title || itemId}`,
    '',
    'Arquivos-fonte do Componentes Bloomin.',
    'Copie as pastas para o seu projeto Next.js (respeitando os caminhos).',
    '',
    'Dependências npm: veja o JSON original ou rode no projeto:',
    `npx componentes-bloomin@latest add ${itemId.replace(/^recipe-/, 'recipe:')}`,
    '',
  ].join('\n')

  const blob = createZipStore([{ path: 'README.md', content: readme }, ...files])
  triggerDownload(blob, `${itemId}.zip`)
}

export async function downloadThemeZip() {
  const response = await fetch('/registry/theme.json')
  if (!response.ok) throw new Error('Tema não encontrado no registry.')
  const theme = (await response.json()) as {
    files?: { path?: string; target?: string; content?: string }[]
  }
  const files = (theme.files ?? [])
    .map((file) => ({
      path: (file.target || file.path || '').replace(/\\/g, '/'),
      content: file.content ?? '',
    }))
    .filter((file) => file.path)

  if (!files.length) throw new Error('Tema sem arquivos.')
  const blob = createZipStore(files)
  triggerDownload(blob, 'componentes-bloomin-theme.zip')
}

async function loadRegistryFiles(itemId: string) {
  const response = await fetch(`/registry/${itemId}.json`)
  if (!response.ok) throw new Error(`Não foi possível carregar ${itemId}`)
  const item = (await response.json()) as RegistryItem
  return (item.files ?? [])
    .map((file) => ({
      path: (file.target || file.path || '').replace(/\\/g, '/'),
      content: file.content ?? '',
    }))
    .filter((file) => file.path)
}

/** Baixa vários itens do registry (+ tema opcional) num único ZIP. */
export async function downloadRegistryItemsZip(
  itemIds: string[],
  options?: {
    filename?: string
    includeTheme?: boolean
    extraFiles?: { path: string; content: string }[]
    title?: string
  },
) {
  const uniqueIds = [...new Set(itemIds.filter(Boolean))]
  if (!uniqueIds.length && !options?.extraFiles?.length) {
    throw new Error('Nenhum arquivo para baixar.')
  }

  const byPath = new Map<string, string>()

  for (const id of uniqueIds) {
    const files = await loadRegistryFiles(id)
    for (const file of files) {
      if (!byPath.has(file.path)) byPath.set(file.path, file.content)
    }
  }

  if (options?.includeTheme) {
    try {
      const themeFiles = await loadRegistryFiles('theme')
      for (const file of themeFiles) {
        if (!byPath.has(file.path)) byPath.set(file.path, file.content)
      }
    } catch {
      // tema opcional
    }
  }

  for (const file of options?.extraFiles ?? []) {
    byPath.set(file.path.replace(/^\/+/, ''), file.content)
  }

  const readme = [
    `# ${options?.title || 'Página montada'}`,
    '',
    'Arquivos-fonte do Componentes Bloomin (montador de páginas).',
    'Copie as pastas para o seu projeto Next.js respeitando os caminhos.',
    '',
    uniqueIds.length ? `Componentes: ${uniqueIds.join(', ')}` : '',
    '',
  ]
    .filter(Boolean)
    .join('\n')

  byPath.set('README.md', readme)

  const files = [...byPath.entries()].map(([path, content]) => ({ path, content }))
  const blob = createZipStore(files)
  triggerDownload(blob, options?.filename || 'pagina-montada.zip')
}
