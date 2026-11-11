import type { CSSProperties } from 'react'
import type { CatalogComponent, CatalogProp } from '../manifest'

export type SectionStyle = {
  backgroundType?: 'solid' | 'gradient' | 'none'
  background?: string
  gradientFrom?: string
  gradientTo?: string
  gradientAngle?: number
  textColor?: string
  borderWidth?: number
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none'
  borderRadius?: number
  paddingY?: number
  paddingX?: number
  contentAlign?: 'start' | 'center' | 'end'
  contentJustify?: 'start' | 'center' | 'end' | 'between'
  offsetX?: number
  offsetY?: number
  opacity?: number
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  maxWidth?: 'full' | '5xl' | '6xl' | '7xl'
  /** Força filhos a herdarem fundo/cor (necessário p/ estilos “pegarem”). */
  forceChildSurface?: boolean
}

export type ImageOverride = {
  src: string
  alt?: string
}

export type TemplateSlot = {
  key: string
  componentId: string
  style: SectionStyle
  texts: Record<string, string>
  /** Chaves: image, backgroundImage, image1, image2... */
  images: Record<string, ImageOverride>
}

const IMAGE_PROP_NAMES = new Set([
  'image',
  'images',
  'backgroundImage',
  'primaryImage',
  'secondaryImage',
  'illustration',
  'before',
  'after',
  'photo',
  'cover',
  'avatar',
])

const SKIP_PROP_NAMES = new Set([
  'children',
  'className',
  'onClick',
  'onSubmit',
  'onDismiss',
  'onChange',
  'icon',
  'logo',
  'icons',
  'render',
  'formatter',
  'asChild',
])

const PROP_LABELS: Record<string, string> = {
  title: 'Título',
  description: 'Descrição',
  eyebrow: 'Rótulo superior',
  subtitle: 'Subtítulo',
  message: 'Mensagem',
  heading: 'Cabeçalho',
  label: 'Rótulo',
  brandName: 'Nome da marca',
  copyright: 'Copyright',
  ctaLabel: 'Texto do botão',
  actionLabel: 'Texto da ação',
  buttonLabel: 'Texto do botão',
  phone: 'Telefone',
  email: 'E-mail',
  hours: 'Horário',
  address: 'Endereço',
  query: 'Busca do mapa',
  tone: 'Tema visual',
  align: 'Alinhamento',
  variant: 'Variante',
  height: 'Altura',
  columns: 'Colunas',
  position: 'Posição',
  size: 'Tamanho',
  primaryAction: 'Botão principal',
  secondaryAction: 'Botão secundário',
  action: 'Ação / link',
  allAction: 'Link “ver todos”',
  directionsHref: 'Link “como chegar”',
  directionsLabel: 'Texto “como chegar”',
  chips: 'Selos (separados por vírgula)',
  caption: 'Legenda',
  cardTitle: 'Título do card',
  cardDescription: 'Descrição do card',
  badge: 'Selo / badge',
  stat: 'Estatística',
  help: 'Card de ajuda',
  dismissible: 'Pode fechar',
  stacked: 'Empilhado',
  perPage: 'Itens por página',
  interval: 'Intervalo (ms)',
  duration: 'Duração',
  defaultOpen: 'Aberto por padrão',
  submitLabel: 'Texto enviar',
  nextLabel: 'Texto próximo',
  previousLabel: 'Texto anterior',
  successTitle: 'Título de sucesso',
  successDescription: 'Descrição de sucesso',
  errorMessage: 'Mensagem de erro',
  emptyMessage: 'Mensagem vazia',
  allLabel: 'Rótulo “todos”',
  couponLabel: 'Rótulo do cupom',
  mediaPosition: 'Posição da mídia',
}

export type EditableField =
  | {
      kind: 'text'
      name: string
      label: string
      description: string
      multiline?: boolean
    }
  | {
      kind: 'action'
      name: string
      label: string
      description: string
    }
  | {
      kind: 'select'
      name: string
      label: string
      description: string
      options: string[]
    }
  | {
      kind: 'number'
      name: string
      label: string
      description: string
    }
  | {
      kind: 'boolean'
      name: string
      label: string
      description: string
    }
  | {
      kind: 'chips'
      name: string
      label: string
      description: string
    }
  | {
      kind: 'object'
      name: string
      label: string
      description: string
      keys: { key: string; label: string }[]
    }
  | {
      kind: 'json'
      name: string
      label: string
      description: string
    }

export const IMAGE_PRESETS = [
  {
    label: 'Produto digital',
    src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Equipe',
    src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Escritório',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Tecnologia',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Industrial',
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
  },
  {
    label: 'Cidade',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  },
] as const

export function createSlot(componentId: string): TemplateSlot {
  return {
    key: `${componentId}-${Math.random().toString(36).slice(2, 10)}`,
    componentId,
    style: {},
    texts: {},
    images: {},
  }
}

export function slotsFromComponents(components: readonly string[]): TemplateSlot[] {
  return components.map((componentId) => createSlot(componentId))
}

export function humanizePropName(name: string) {
  if (PROP_LABELS[name]) return PROP_LABELS[name]
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^\w/, (char) => char.toUpperCase())
}

function parseUnionOptions(type: string): string[] | null {
  const matches = [...type.matchAll(/'([^']+)'/g)].map((item) => item[1])
  if (matches.length < 2) return null
  if (!type.includes('|')) return null
  if (/[\{\[]/.test(type.replace(/'[^']*'/g, ''))) return null
  return matches
}

function isActionType(type: string) {
  const normalized = type.replace(/\s+/g, ' ')
  return (
    /label\s*:\s*string/.test(normalized) &&
    /href\s*:\s*string/.test(normalized) &&
    !/\[\]/.test(normalized) &&
    !/Array</.test(normalized) &&
    !/readonly .+\[\]/.test(normalized)
  )
}

function isImageObjectType(type: string) {
  return /src\s*:\s*string/.test(type) && !/\[\]/.test(type) && !/Array</.test(type)
}

function isSimpleStringObject(type: string) {
  if (!/\{/.test(type) || /\[\]/.test(type) || /Array</.test(type)) return false
  if (isActionType(type) || isImageObjectType(type)) return false
  const keys = [...type.matchAll(/(\w+)\s*\??\s*:\s*string/g)].map((item) => item[1])
  return keys.length >= 1 && keys.length <= 4
}

function isStringArray(type: string) {
  return (
    /^string\[\]$/.test(type.trim()) ||
    /^readonly string\[\]$/.test(type.trim()) ||
    type.trim() === 'string[]'
  )
}

function isComplexArray(type: string) {
  if (isStringArray(type) || isImageObjectType(type)) return false
  return /\[\]/.test(type) || /Array\s*</.test(type) || /readonly\s+[A-Z]/.test(type)
}

function shouldSkipProp(prop: CatalogProp) {
  if (SKIP_PROP_NAMES.has(prop.name)) return true
  if (IMAGE_PROP_NAMES.has(prop.name)) return true
  const type = prop.type.replace(/\s+/g, ' ')
  if (isImageObjectType(type)) return true
  if (/LucideIcon|MouseEvent|FormEvent|CSSProperties|HTMLElement/.test(type)) return true
  if (/^\(\)\s*=>/.test(type) || /=>\s*void/.test(type) || /=>\s*Promise/.test(type)) return true
  return false
}

/** Todos os campos personalizáveis do componente (exceto imagens — use editableImageProps). */
export function getEditableFields(component: CatalogComponent | undefined): EditableField[] {
  if (!component) return []
  const fields: EditableField[] = []

  for (const prop of component.props) {
    if (shouldSkipProp(prop)) continue
    const type = prop.type.replace(/\s+/g, ' ').trim()
    const label = humanizePropName(prop.name)
    const description = prop.description

    if (isActionType(type)) {
      fields.push({ kind: 'action', name: prop.name, label, description })
      continue
    }

    const union = parseUnionOptions(type)
    if (union) {
      fields.push({ kind: 'select', name: prop.name, label, description, options: union })
      continue
    }

    if (type === 'boolean' || type.startsWith('boolean ')) {
      fields.push({ kind: 'boolean', name: prop.name, label, description })
      continue
    }

    if (type === 'number' || type.startsWith('number ') || /^number\s*\|/.test(type)) {
      fields.push({ kind: 'number', name: prop.name, label, description })
      continue
    }

    if (isStringArray(type)) {
      fields.push({ kind: 'chips', name: prop.name, label, description })
      continue
    }

    if (isSimpleStringObject(type)) {
      const keys = [...type.matchAll(/(\w+)\s*\??\s*:\s*string/g)].map((item) => item[1])
      fields.push({
        kind: 'object',
        name: prop.name,
        label,
        description,
        keys: keys.map((key) => ({ key, label: humanizePropName(key) })),
      })
      continue
    }

    if (isComplexArray(type)) {
      fields.push({
        kind: 'json',
        name: prop.name,
        label: `${label} (lista)`,
        description: `${description} Edite como JSON — ex.: lista de itens do bloco.`,
      })
      continue
    }

    if (
      type === 'string' ||
      type.includes('string') ||
      type === 'ReactNode' ||
      type.includes('ReactNode')
    ) {
      const multiline = /description|message|paragraph|content|quote|answer|caption/i.test(
        prop.name + prop.description,
      )
      fields.push({ kind: 'text', name: prop.name, label, description, multiline })
    }
  }

  return fields
}

/** @deprecated use getEditableFields */
export function editableTextProps(component: CatalogComponent | undefined): CatalogProp[] {
  if (!component) return []
  return getEditableFields(component)
    .filter((field) => field.kind === 'text')
    .map((field) => ({
      name: field.name,
      type: 'string',
      description: field.description,
    }))
}

export function editableImageProps(component: CatalogComponent | undefined): CatalogProp[] {
  if (!component) return []
  return component.props.filter((item) => {
    if (IMAGE_PROP_NAMES.has(item.name)) return true
    const type = item.type.toLowerCase()
    return type.includes('src: string') || type.includes('src?: string')
  })
}

export function hasTextCustomizations(texts: Record<string, string>) {
  return Object.values(texts).some((value) => Boolean(value?.trim()))
}

export function imageSlotsFor(component: CatalogComponent | undefined) {
  const named = editableImageProps(component).map((field) => ({
    key: field.name,
    label: humanizePropName(field.name),
    hint: field.description,
  }))
  const sequential = [
    { key: 'image1', label: '1ª imagem do bloco', hint: 'Substitui a primeira foto encontrada' },
    { key: 'image2', label: '2ª imagem do bloco', hint: 'Substitui a segunda foto' },
    { key: 'image3', label: '3ª imagem do bloco', hint: 'Substitui a terceira foto' },
    { key: 'image4', label: '4ª imagem do bloco', hint: 'Substitui a quarta foto' },
  ]
  return [...named, ...sequential].filter(
    (item, index, list) => list.findIndex((entry) => entry.key === item.key) === index,
  )
}

export function hasStyleCustomizations(style: SectionStyle) {
  if (style.backgroundType && style.backgroundType !== 'none') return true
  if (style.textColor) return true
  if (style.borderStyle && style.borderStyle !== 'none') return true
  if ((style.borderWidth ?? 0) > 0) return true
  if ((style.borderRadius ?? 0) > 0) return true
  if ((style.paddingY ?? 0) > 0 || (style.paddingX ?? 0) > 0) return true
  if (style.contentAlign || style.contentJustify) return true
  if ((style.offsetX ?? 0) !== 0 || (style.offsetY ?? 0) !== 0) return true
  if (style.opacity !== undefined && style.opacity < 100) return true
  if (style.shadow && style.shadow !== 'none') return true
  if (style.maxWidth && style.maxWidth !== 'full') return true
  return false
}

export function hasImageCustomizations(images: Record<string, ImageOverride>) {
  return Object.values(images).some((image) => Boolean(image?.src?.trim()))
}

function shadowClass(shadow: SectionStyle['shadow']) {
  switch (shadow) {
    case 'sm':
      return 'shadow-sm'
    case 'md':
      return 'shadow-md'
    case 'lg':
      return 'shadow-lg'
    case 'xl':
      return 'shadow-xl'
    default:
      return ''
  }
}

function maxWidthClass(maxWidth: SectionStyle['maxWidth']) {
  switch (maxWidth) {
    case '5xl':
      return 'mx-auto w-full max-w-5xl'
    case '6xl':
      return 'mx-auto w-full max-w-6xl'
    case '7xl':
      return 'mx-auto w-full max-w-7xl'
    default:
      return 'w-full'
  }
}

export function resolveBackground(style: SectionStyle): string | undefined {
  if (style.backgroundType === 'solid') {
    return style.background || '#0f172a'
  }
  if (style.backgroundType === 'gradient') {
    const from = style.gradientFrom || '#0f172a'
    const to = style.gradientTo || '#7c3aed'
    const angle = style.gradientAngle ?? 135
    return `linear-gradient(${angle}deg, ${from}, ${to})`
  }
  return undefined
}

export type SectionSkin = {
  outerClassName: string
  outerStyle: CSSProperties
  frameClassName: string
  frameStyle: CSSProperties
  contentClassName: string
  background?: string
  hasBackground: boolean
}

/** Skin completo para preview e export — aplica estilos de forma que realmente sobrescrevem o bloco. */
export function buildSectionSkin(style: SectionStyle): SectionSkin {
  const background = resolveBackground(style)
  const hasBackground = Boolean(background)
  // Nunca sobrescrever o fundo interno do componente a menos que o usuário peça.
  const force = style.forceChildSurface === true && hasBackground
  const hasText = Boolean(style.textColor)
  const radius = style.borderRadius ?? 0
  const borderWidth = style.borderWidth ?? 0
  const borderStyle =
    style.borderStyle === 'none'
      ? undefined
      : style.borderStyle || (borderWidth > 0 ? 'solid' : undefined)

  const outerStyle: CSSProperties = {}
  const tx = style.offsetX ?? 0
  const ty = style.offsetY ?? 0
  if (tx || ty) outerStyle.transform = `translate(${tx}px, ${ty}px)`
  if (style.opacity !== undefined && style.opacity < 100) {
    outerStyle.opacity = Math.max(0, Math.min(100, style.opacity)) / 100
  }

  const frameStyle: CSSProperties = {}
  if (style.textColor) frameStyle.color = style.textColor
  if (borderStyle) {
    frameStyle.borderStyle = borderStyle
    frameStyle.borderWidth = borderWidth || 1
    frameStyle.borderColor = style.borderColor || '#c4b5fd'
  }
  if (radius > 0) frameStyle.borderRadius = radius
  if ((style.paddingY ?? 0) > 0 || (style.paddingX ?? 0) > 0) {
    frameStyle.padding = `${style.paddingY ?? 0}px ${style.paddingX ?? 0}px`
  }

  const align =
    style.contentAlign === 'center'
      ? 'text-center'
      : style.contentAlign === 'end'
        ? 'text-right'
        : style.contentAlign === 'start'
          ? 'text-left'
          : ''

  const justify =
    style.contentJustify === 'center'
      ? 'flex flex-col items-center'
      : style.contentJustify === 'end'
        ? 'flex flex-col items-end'
        : style.contentJustify === 'start'
          ? 'flex flex-col items-start'
          : style.contentJustify === 'between'
            ? 'flex flex-col justify-between'
            : ''

  const contentClassName = [
    'relative z-[1] min-w-0',
    align,
    justify,
    force &&
      '[&>:first-child]:!bg-transparent [&>:first-child]:![background-image:none] [&>:first-child]:!bg-none',
    force &&
      '[&>:first-child_*]:![background-color:transparent] [&>:first-child_section]:!bg-transparent [&>:first-child_aside]:!bg-transparent [&>:first-child_header]:!bg-transparent [&>:first-child_footer]:!bg-transparent',
    // Texto herdado só em tipografia — não em botões / links com fundo (evita botão ilegível).
    hasText &&
      '[&_:where(h1,h2,h3,h4,h5,h6,p,li,label,small,strong,em)]:![color:inherit] [&_a:not([class*="bg-"])]:![color:inherit] [&_button]:![color:unset] [&_a[class*="bg-"]]:![color:unset]',
  ]
    .filter(Boolean)
    .join(' ')

  return {
    outerClassName: [maxWidthClass(style.maxWidth), shadowClass(style.shadow), 'transition-all']
      .filter(Boolean)
      .join(' '),
    outerStyle,
    frameClassName: [
      'relative isolate box-border',
      radius > 0 || hasBackground ? 'overflow-hidden' : '',
    ]
      .filter(Boolean)
      .join(' '),
    frameStyle,
    contentClassName,
    background,
    hasBackground,
  }
}

/** @deprecated use buildSectionSkin — mantido para compat. */
export function sectionStyleToCss(style: SectionStyle): CSSProperties {
  return buildSectionSkin(style).frameStyle
}

/** @deprecated use buildSectionSkin */
export function sectionStyleToClassName(style: SectionStyle) {
  return buildSectionSkin(style).contentClassName
}

function cssPropsToJsxObject(style: CSSProperties) {
  const parts: string[] = []
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined || value === '') continue
    const serialized =
      typeof value === 'number' && key !== 'opacity'
        ? `${value}${['borderWidth', 'borderRadius'].includes(key) ? 'px' : ''}`
        : String(value).replace(/'/g, "\\'")
    parts.push(`${key}: '${serialized}'`)
  }
  return parts.length ? `{ ${parts.join(', ')} }` : undefined
}

export function wrapJsxWithStyle(jsx: string, style: SectionStyle) {
  if (!hasStyleCustomizations(style)) return jsx
  const skin = buildSectionSkin(style)
  const indented = jsx
    .split('\n')
    .map((line) => (line ? `      ${line}` : line))
    .join('\n')

  const outerStyle = cssPropsToJsxObject(skin.outerStyle)
  const frameStyle = cssPropsToJsxObject(skin.frameStyle)
  const bgStyle = skin.background
    ? `{ background: '${skin.background.replace(/'/g, "\\'")}' }`
    : undefined

  return [
    `<div className="${skin.outerClassName}"${outerStyle ? ` style={${outerStyle}}` : ''}>`,
    `  <div className="${skin.frameClassName}"${frameStyle ? ` style={${frameStyle}}` : ''}>`,
    skin.hasBackground
      ? `    <div aria-hidden className="pointer-events-none absolute inset-0 -z-0" style={${bgStyle}} />`
      : null,
    `    <div className="${skin.contentClassName}">`,
    indented,
    '    </div>',
    '  </div>',
    '</div>',
  ]
    .filter(Boolean)
    .join('\n')
}

function escapeJsxString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/`/g, '\\`').replace(/'/g, "\\'")
}

function setOrInsertProp(jsx: string, propName: string, assignment: string) {
  const existing = new RegExp(
    `${propName}\\s*=\\s*(?:\\{(?:\\{[\\s\\S]*?\\}|[^{}])*?\\}|"[^"]*"|'[^']*')`,
  )
  if (existing.test(jsx)) {
    return jsx.replace(existing, `${propName}=${assignment}`)
  }
  return jsx.replace(/(<[A-Z][A-Za-z0-9.]*)(\s|\/?>)/, `$1\n  ${propName}=${assignment}$2`)
}

function patchObjectStringField(jsx: string, objectName: string, field: string, value: string) {
  const escaped = escapeJsxString(value)
  const objectPattern = new RegExp(`${objectName}\\s*=\\s*\\{\\{([\\s\\S]*?)\\}\\}`)
  const match = jsx.match(objectPattern)
  if (!match) {
    return setOrInsertProp(jsx, objectName, `{{ ${field}: "${escaped}" }}`)
  }
  let body = match[1]
  const fieldPattern = new RegExp(`${field}\\s*:\\s*(['\`"])([\\s\\S]*?)\\1`)
  if (fieldPattern.test(body)) {
    body = body.replace(fieldPattern, `${field}: "${escaped}"`)
  } else {
    body = `${body.trim().replace(/,\s*$/, '')}, ${field}: "${escaped}"`
  }
  return jsx.replace(objectPattern, `${objectName}={{${body}}}`)
}

export function applyTextOverrides(jsx: string, texts: Record<string, string>) {
  let result = jsx
  const nested = new Map<string, Record<string, string>>()

  for (const [key, value] of Object.entries(texts)) {
    if (!value.trim() && value !== '0' && value !== 'false') continue

    if (key.includes('.')) {
      const [objectName, field] = key.split('.', 2)
      if (!objectName || !field) continue
      const current = nested.get(objectName) ?? {}
      current[field] = value
      nested.set(objectName, current)
      continue
    }

    if (key.startsWith('json:')) {
      const propName = key.slice(5)
      try {
        JSON.parse(value)
        result = setOrInsertProp(result, propName, `{${value}}`)
      } catch {
        // ignora JSON inválido na exportação
      }
      continue
    }

    if (key.startsWith('chips:')) {
      const propName = key.slice(6)
      const items = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => `"${escapeJsxString(item)}"`)
      result = setOrInsertProp(result, propName, `{[${items.join(', ')}]}`)
      continue
    }

    if (value === 'true' || value === 'false') {
      result = setOrInsertProp(result, key, `{${value}}`)
      continue
    }

    if (/^-?\d+(\.\d+)?$/.test(value.trim())) {
      result = setOrInsertProp(result, key, `{${value.trim()}}`)
      continue
    }

    const escaped = escapeJsxString(value)
    const patterns = [
      new RegExp(`(${key}\\s*=\\s*)"([^"]*)"`),
      new RegExp(`(${key}\\s*=\\s*)\\{'([^']*)'\\}`),
      new RegExp(`(${key}\\s*=\\s*)\\{\`([^\`]*)\`\\}`),
      new RegExp(`(${key}\\s*=\\s*)\\{"([^"]*)"\\}`),
    ]

    let replaced = false
    for (const pattern of patterns) {
      if (pattern.test(result)) {
        result = result.replace(pattern, `$1"${escaped}"`)
        replaced = true
        break
      }
    }
    if (!replaced) {
      result = setOrInsertProp(result, key, `"${escaped}"`)
    }
  }

  for (const [objectName, fields] of nested) {
    for (const [field, value] of Object.entries(fields)) {
      if (!value.trim()) continue
      result = patchObjectStringField(result, objectName, field, value)
    }
  }

  return result
}

function escapeJsString(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

/** Aplica URLs de imagem no JSX e nas declarações do snippet. */
export function applyImageOverrides(
  jsx: string,
  declarations: { name: string; code: string }[],
  images: Record<string, ImageOverride>,
) {
  let nextJsx = jsx
  let nextDeclarations = declarations.map((item) => ({ ...item }))
  const ordered = orderedImageOverrides(images)

  for (const [key, image] of Object.entries(images)) {
    if (!image.src.trim() || (key.startsWith('image') && /^image\d+$/.test(key))) continue
    const src = escapeJsString(image.src.trim())
    const alt = escapeJsString(image.alt?.trim() || 'Imagem')

    // image={{ src: imageOne, alt: '...' }} ou image={{ src: '...', alt: '...' }}
    const objectPattern = new RegExp(
      `${key}\\s*=\\s*\\{\\{\\s*src:\\s*([^,}]+)\\s*,\\s*alt:\\s*(['\`"])(.*?)\\2\\s*\\}\\}`,
    )
    if (objectPattern.test(nextJsx)) {
      nextJsx = nextJsx.replace(objectPattern, `${key}={{ src: '${src}', alt: '${alt}' }}`)
      continue
    }

    const srcOnly = new RegExp(`${key}\\s*=\\s*\\{\\{\\s*src:\\s*([^}]+)\\}\\}`)
    if (srcOnly.test(nextJsx)) {
      nextJsx = nextJsx.replace(srcOnly, `${key}={{ src: '${src}', alt: '${alt}' }}`)
    }
  }

  // Substitui constantes imageOne / URLs unsplash na ordem
  let urlIndex = 0
  nextDeclarations = nextDeclarations.map((declaration) => {
    if (urlIndex >= ordered.length) return declaration
    const match = declaration.code.match(/(['"`])(https?:\/\/[^'"`]+)\1/)
    if (!match) return declaration
    const replacement = ordered[urlIndex]
    urlIndex += 1
    return {
      ...declaration,
      code: declaration.code.replace(match[0], `'${escapeJsString(replacement.src)}'`),
    }
  })

  // URLs literais restantes no JSX
  nextJsx = nextJsx.replace(/(['"`])(https?:\/\/[^'"`]+)\1/g, (full, quote, url) => {
    if (urlIndex >= ordered.length) return full
    if (!/unsplash\.com|\/images\/|\.(jpg|jpeg|png|webp|svg|avif)/i.test(url)) return full
    const replacement = ordered[urlIndex]
    urlIndex += 1
    return `${quote}${replacement.src}${quote}`
  })

  return { jsx: nextJsx, declarations: nextDeclarations }
}

export function orderedImageOverrides(images: Record<string, ImageOverride>) {
  const named = Object.entries(images)
    .filter(([key, value]) => value?.src?.trim() && !/^image\d+$/.test(key))
    .map(([, value]) => value)
  const sequential = [images.image1, images.image2, images.image3, images.image4].filter(
    (item): item is ImageOverride => Boolean(item?.src?.trim()),
  )
  // Prefer sequential for DOM order; named also included if not duplicated
  const seen = new Set<string>()
  const result: ImageOverride[] = []
  for (const item of [...sequential, ...named]) {
    const src = item.src.trim()
    if (seen.has(src)) continue
    seen.add(src)
    result.push({ src, alt: item.alt })
  }
  return result
}

export function describeStyleForPrompt(style: SectionStyle) {
  const lines: string[] = []
  if (style.backgroundType === 'solid' && style.background) {
    lines.push(`fundo sólido ${style.background}`)
  }
  if (style.backgroundType === 'gradient') {
    lines.push(
      `gradiente ${style.gradientAngle ?? 135}° de ${style.gradientFrom || '#0f172a'} para ${style.gradientTo || '#7c3aed'}`,
    )
  }
  if (style.textColor) lines.push(`cor do texto ${style.textColor}`)
  if ((style.borderWidth ?? 0) > 0 || (style.borderStyle && style.borderStyle !== 'none')) {
    lines.push(
      `borda ${style.borderWidth || 1}px ${style.borderStyle || 'solid'} ${style.borderColor || '#c4b5fd'}`,
    )
  }
  if ((style.borderRadius ?? 0) > 0) lines.push(`raio ${style.borderRadius}px`)
  if ((style.paddingY ?? 0) > 0 || (style.paddingX ?? 0) > 0) {
    lines.push(`padding ${style.paddingY ?? 0}px / ${style.paddingX ?? 0}px`)
  }
  if (style.contentAlign) lines.push(`alinhamento ${style.contentAlign}`)
  if (style.contentJustify) lines.push(`distribuição ${style.contentJustify}`)
  if ((style.offsetX ?? 0) !== 0 || (style.offsetY ?? 0) !== 0) {
    lines.push(`deslocamento x=${style.offsetX ?? 0}px y=${style.offsetY ?? 0}px`)
  }
  if (style.opacity !== undefined && style.opacity < 100) lines.push(`opacidade ${style.opacity}%`)
  if (style.shadow && style.shadow !== 'none') lines.push(`sombra ${style.shadow}`)
  if (style.maxWidth && style.maxWidth !== 'full') lines.push(`largura máx. ${style.maxWidth}`)
  return lines
}

export function describeImagesForPrompt(images: Record<string, ImageOverride>) {
  return Object.entries(images)
    .filter(([, image]) => image?.src?.trim())
    .map(([key, image]) => `${key}: ${image.src}${image.alt ? ` (alt: ${image.alt})` : ''}`)
}
