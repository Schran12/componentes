import { normalizeSearch } from '@/components/library/catalog/catalogSearch'
import type { SectionStyle } from '@/components/library/catalog/templates/sectionCustomization'

export type LayoutPalette = {
  primary: string
  surface: string
  text: string
  onPrimary: string
  label: string
}

export type LayoutStyles = Record<string, SectionStyle>

const NAMED: { tokens: string[]; hex: string }[] = [
  { tokens: ['azul', 'blue', 'navy', 'anil'], hex: '#1d4ed8' },
  { tokens: ['verde', 'green', 'esmeralda'], hex: '#15803d' },
  { tokens: ['vermelho', 'red', 'bordô', 'bordo'], hex: '#b91c1c' },
  { tokens: ['laranja', 'orange'], hex: '#c2410c' },
  { tokens: ['amarelo', 'yellow', 'ouro', 'dourado', 'gold'], hex: '#b45309' },
  { tokens: ['roxo', 'purple', 'violeta', 'violet'], hex: '#7c3aed' },
  { tokens: ['rosa', 'pink', 'magenta'], hex: '#db2777' },
  { tokens: ['ciano', 'teal', 'turquesa'], hex: '#0f766e' },
  { tokens: ['preto', 'black', 'grafite', 'chumbo'], hex: '#0f172a' },
  { tokens: ['branco', 'white'], hex: '#ffffff' },
  { tokens: ['cinza', 'grey', 'gray', 'prateado'], hex: '#475569' },
  { tokens: ['marrom', 'brown', 'terracota'], hex: '#9a3412' },
]

type Rgb = { r: number; g: number; b: number }

function hexToRgb(hex: string): Rgb | null {
  const clean = hex.replace('#', '').trim()
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((char) => char + char)
          .join('')
      : clean
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  return {
    r: Number.parseInt(full.slice(0, 2), 16),
    g: Number.parseInt(full.slice(2, 4), 16),
    b: Number.parseInt(full.slice(4, 6), 16),
  }
}

function relativeLuminance(hex: string) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
}

function contrastText(hex: string) {
  return relativeLuminance(hex) > 0.55 ? '#0f172a' : '#ffffff'
}

function chromaScore(hex: string) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  return Math.max(rgb.r, rgb.g, rgb.b) - Math.min(rgb.r, rgb.g, rgb.b)
}

/** Converte #RRGGBB → componentes HSL (`H S% L%`) das CSS vars do projeto. */
export function hexToHslComponents(hex: string): string | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6
        break
      case g:
        h = (b - r) / delta + 2
        break
      default:
        h = (r - g) / delta + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

function parseHsl(components: string) {
  const match = components.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/)
  if (!match) return null
  return { h: Number(match[1]), s: Number(match[2]), l: Number(match[3]) }
}

function formatHsl(h: number, s: number, l: number) {
  return `${Math.round(h)} ${Math.round(Math.max(0, Math.min(100, s)))}% ${Math.round(Math.max(0, Math.min(100, l)))}%`
}

/** Tema completo e coerente — só tokens, sem pintar seções por cima dos componentes. */
export function paletteToCssVars(palette: LayoutPalette): Record<string, string> {
  const primary = hexToHslComponents(palette.primary)
  if (!primary) return {}
  const parsed = parseHsl(primary)
  if (!parsed) return {}

  const onPrimary =
    hexToHslComponents(palette.onPrimary) ||
    (relativeLuminance(palette.primary) > 0.55 ? '222 47% 11%' : '0 0% 100%')

  // Superfície: branco/claro; se o usuário pediu escuro, usa um off-white suave.
  const surfaceHex = relativeLuminance(palette.surface) > 0.85 ? palette.surface : '#fafafa'
  const background =
    hexToHslComponents(surfaceHex) || formatHsl(parsed.h, Math.min(parsed.s, 18), 98)

  // Texto de leitura sempre escuro o bastante (não herda “preto da marca” em tudo).
  const foreground =
    hexToHslComponents(relativeLuminance(palette.text) < 0.45 ? palette.text : '#0f172a') ||
    '222 47% 11%'

  const softS = Math.min(parsed.s, 28)
  const softSMuted = Math.min(parsed.s, 16)
  const primaryHover = formatHsl(parsed.h, parsed.s, Math.max(12, parsed.l - 10))
  const secondary = formatHsl(parsed.h, softS, 94)
  const secondaryFg = formatHsl(parsed.h, Math.min(parsed.s, 45), Math.min(28, parsed.l))
  const muted = formatHsl(parsed.h, softSMuted, 96)
  const mutedFg = formatHsl(parsed.h, Math.min(parsed.s, 12), 38)
  const accent = formatHsl(parsed.h, softS, 95)
  const accentFg = secondaryFg
  const border = formatHsl(parsed.h, Math.min(parsed.s, 14), 90)
  const card = '0 0% 100%'

  return {
    '--background': background,
    '--foreground': foreground,
    '--card': card,
    '--card-foreground': foreground,
    '--popover': card,
    '--popover-foreground': foreground,
    '--primary': primary,
    '--primary-hover': primaryHover,
    '--primary-foreground': onPrimary,
    '--secondary': secondary,
    '--secondary-foreground': secondaryFg,
    '--muted': muted,
    '--muted-foreground': mutedFg,
    '--accent': accent,
    '--accent-foreground': accentFg,
    '--border': border,
    '--input': border,
    '--ring': primary,
  }
}

/** Extrai paleta de frases como “azul e branco”, “#0f172a”, “cores verde”. */
export function parsePalette(text: string): LayoutPalette | null {
  const normalized = normalizeSearch(text)
  const mentionsColorWord =
    /(cor|cores|paleta|tom|tons|azul|verde|vermelho|roxo|rosa|laranja|amarelo|preto|branco|cinza|marrom|ciano|dourado|navy|teal)/.test(
      normalized,
    )
  const hasHex = /#[0-9a-f]{3,8}/i.test(text)
  if (!mentionsColorWord && !hasHex) return null

  const hexes = [...text.matchAll(/#([0-9a-f]{3}|[0-9a-f]{6})\b/gi)].map((match) => {
    const raw = match[1]
    if (raw.length === 3) {
      return `#${raw
        .split('')
        .map((char) => char + char)
        .join('')}`
    }
    return `#${raw}`
  })

  const named = NAMED.filter((entry) =>
    entry.tokens.some((token) => normalized.includes(normalizeSearch(token))),
  ).map((entry) => entry.hex)

  const colors = [...hexes, ...named]
  if (!colors.length) return null

  const unique = [...new Set(colors.map((hex) => hex.toLowerCase()))]
  const isLight = (hex: string) => relativeLuminance(hex) > 0.75
  const isDark = (hex: string) => relativeLuminance(hex) < 0.22

  // Prefere a cor mais cromática (ex.: dourado em “preto e dourado”) como marca.
  const chromatic = [...unique]
    .filter((hex) => !isLight(hex) && chromaScore(hex) > 40)
    .sort((a, b) => chromaScore(b) - chromaScore(a))

  const primary =
    chromatic[0] ||
    unique.find((hex) => !isLight(hex) && !isDark(hex)) ||
    unique.find((hex) => !isLight(hex)) ||
    unique[0]

  const surface = unique.find((hex) => hex !== primary && isLight(hex)) || '#ffffff'

  // Texto de UI: escuro legível; só usa preto pedido se não for a própria primária.
  const textColor = unique.find((hex) => hex !== primary && isDark(hex)) || '#0f172a'

  return {
    primary,
    surface,
    text: textColor,
    onPrimary: contrastText(primary),
    label: unique.join(' · '),
  }
}

const NICHE_DEFAULTS: Record<string, LayoutPalette> = {
  'industrial-services': {
    primary: '#0f172a',
    surface: '#f8fafc',
    text: '#0f172a',
    onPrimary: '#ffffff',
    label: 'industrial',
  },
  industrial: {
    primary: '#1e293b',
    surface: '#f8fafc',
    text: '#0f172a',
    onPrimary: '#ffffff',
    label: 'industrial',
  },
  clinic: {
    primary: '#0f766e',
    surface: '#f0fdfa',
    text: '#134e4a',
    onPrimary: '#ffffff',
    label: 'clínica',
  },
  restaurant: {
    primary: '#c2410c',
    surface: '#fff7ed',
    text: '#431407',
    onPrimary: '#ffffff',
    label: 'restaurante',
  },
  saas: {
    primary: '#4f46e5',
    surface: '#f8fafc',
    text: '#1e1b4b',
    onPrimary: '#ffffff',
    label: 'saas',
  },
  fintech: {
    primary: '#0369a1',
    surface: '#f0f9ff',
    text: '#0c4a6e',
    onPrimary: '#ffffff',
    label: 'fintech',
  },
  ecommerce: {
    primary: '#be123c',
    surface: '#fff1f2',
    text: '#881337',
    onPrimary: '#ffffff',
    label: 'loja',
  },
  'real-estate': {
    primary: '#1d4ed8',
    surface: '#eff6ff',
    text: '#1e3a8a',
    onPrimary: '#ffffff',
    label: 'imobiliária',
  },
  agency: {
    primary: '#7c3aed',
    surface: '#faf5ff',
    text: '#4c1d95',
    onPrimary: '#ffffff',
    label: 'agência',
  },
  education: {
    primary: '#b45309',
    surface: '#fffbeb',
    text: '#78350f',
    onPrimary: '#ffffff',
    label: 'educação',
  },
  nonprofit: {
    primary: '#15803d',
    surface: '#f0fdf4',
    text: '#14532d',
    onPrimary: '#ffffff',
    label: 'ong',
  },
  event: {
    primary: '#db2777',
    surface: '#fdf2f8',
    text: '#831843',
    onPrimary: '#ffffff',
    label: 'evento',
  },
  blog: {
    primary: '#334155',
    surface: '#f8fafc',
    text: '#0f172a',
    onPrimary: '#ffffff',
    label: 'blog',
  },
  'landing-page': {
    primary: '#0f766e',
    surface: '#ffffff',
    text: '#0f172a',
    onPrimary: '#ffffff',
    label: 'landing',
  },
  institutional: {
    primary: '#1e3a5f',
    surface: '#f8fafc',
    text: '#0f172a',
    onPrimary: '#ffffff',
    label: 'institucional',
  },
  'institutional-corporate': {
    primary: '#0f172a',
    surface: '#f1f5f9',
    text: '#0f172a',
    onPrimary: '#ffffff',
    label: 'corporativo',
  },
  consulting: {
    primary: '#3730a3',
    surface: '#eef2ff',
    text: '#312e81',
    onPrimary: '#ffffff',
    label: 'consultoria',
  },
}

/** Paleta pedida no texto, ou padrão do nicho. */
export function resolvePalette(text: string, recipeId?: string | null): LayoutPalette {
  return (
    parsePalette(text) ||
    (recipeId ? NICHE_DEFAULTS[recipeId] : undefined) ||
    NICHE_DEFAULTS.institutional
  )
}

/**
 * Não pinta fundo dos componentes — só marca vazia.
 * Cores de marca entram via CSS vars (--primary) no preview do montador.
 */
export function buildComponentStyles(
  componentIds: string[],
  _text: string,
  _palette: LayoutPalette,
): LayoutStyles {
  return Object.fromEntries(componentIds.map((id) => [id, {}]))
}
