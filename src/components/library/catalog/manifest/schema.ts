export const catalogCategories = [
  'primitives',
  'navigation',
  'marketing',
  'content',
  'data-display',
  'forms',
  'feedback',
  'motion',
] as const

export type CatalogCategory = (typeof catalogCategories)[number]

export type CatalogProp = {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
}

export type CatalogComponent = {
  id: string
  name: string
  category: CatalogCategory
  description: string
  importPath: string
  client: boolean
  dependencies: string[]
  props: CatalogProp[]
  variants: string[]
  tags: string[]
  example: string
}

export const prop = (
  name: string,
  type: string,
  description: string,
  required = false,
  defaultValue?: string,
): CatalogProp => ({ name, type, description, required, default: defaultValue })

export const accentTone = (defaultValue = "'glow'"): CatalogProp =>
  prop(
    'tone',
    "'glow' | 'industrial' | 'industrial-dark'",
    'Tema visual: glow (escuro rosa/roxo), industrial (claro âmbar) ou industrial-dark.',
    false,
    defaultValue,
  )

export const categoryLabels: Record<CatalogCategory, string> = {
  primitives: 'Primitivos',
  navigation: 'Navegação',
  marketing: 'Marketing',
  content: 'Conteúdo',
  'data-display': 'Exibição de dados',
  forms: 'Formulários',
  feedback: 'Feedback',
  motion: 'Movimento',
}
