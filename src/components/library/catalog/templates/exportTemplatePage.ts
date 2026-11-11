import {
  generatePageDocument,
  type PageSnippet,
  type ThemeBundle,
} from '../builder/generatePageDocument'
import { stepIdForComponent, stepsByIdSafe } from './builderStepLookup'
import {
  applyImageOverrides,
  applyTextOverrides,
  describeImagesForPrompt,
  describeStyleForPrompt,
  hasImageCustomizations,
  hasStyleCustomizations,
  wrapJsxWithStyle,
  type TemplateSlot,
} from './sectionCustomization'
import { componentManifest } from '../manifest'
import type { LayoutRecipe } from '../layoutRecipes'

const componentsById = new Map(componentManifest.map((item) => [item.id, item]))
const jsonCache = new Map<string, Promise<unknown>>()

function fetchJson<T>(url: string) {
  if (!jsonCache.has(url)) {
    jsonCache.set(
      url,
      fetch(url).then((response) => {
        if (!response.ok) throw new Error(`Falha ao carregar ${url}`)
        return response.json()
      }),
    )
  }
  return jsonCache.get(url) as Promise<T>
}

export type TemplateExportResult = {
  document: string
  prompt: string
  installCommand: string
  files: { path: string; content: string }[]
}

export async function exportTemplatePage({
  recipe,
  slots,
  route = '/',
  includeTheme = true,
}: {
  recipe: LayoutRecipe
  slots: TemplateSlot[]
  route?: string
  includeTheme?: boolean
}): Promise<TemplateExportResult> {
  const [snippets, theme] = await Promise.all([
    Promise.all(
      slots.map((slot) => fetchJson<PageSnippet>(`/registry/pages/${slot.componentId}.json`)),
    ),
    includeTheme ? fetchJson<ThemeBundle>('/registry/theme.json') : Promise.resolve(undefined),
  ])

  const sections = slots.map((slot, index) => {
    const source = snippets[index]
    const withImages = applyImageOverrides(source.jsx, source.declarations ?? [], slot.images)
    const withTexts = applyTextOverrides(withImages.jsx, slot.texts)
    const snippet: PageSnippet = {
      ...source,
      declarations: withImages.declarations,
      jsx: wrapJsxWithStyle(withTexts, slot.style),
    }
    const stepId = stepIdForComponent(slot.componentId)
    const stepTitle = stepId ? (stepsByIdSafe.get(stepId)?.title ?? 'Seção') : 'Seção'
    const placement = stepId ? (stepsByIdSafe.get(stepId)?.placement ?? 'main') : 'main'
    return {
      snippet,
      stepTitle,
      placement,
    }
  })

  const generated = generatePageDocument({
    sections,
    route,
    theme,
  })

  const prompt = buildAiPrompt({
    recipe,
    slots,
    document: generated.document,
    route,
  })

  return {
    document: generated.document,
    prompt,
    installCommand: generated.installCommand,
    files: generated.files,
  }
}

function buildAiPrompt({
  recipe,
  slots,
  document,
  route,
}: {
  recipe: LayoutRecipe
  slots: TemplateSlot[]
  document: string
  route: string
}) {
  const structure = slots
    .map((slot, index) => {
      const component = componentsById.get(slot.componentId)
      const styleNotes = describeStyleForPrompt(slot.style)
      const textNotes = Object.entries(slot.texts)
        .filter(([, value]) => value.trim())
        .map(([key, value]) => `${key} = "${value}"`)
      const imageNotes = describeImagesForPrompt(slot.images)

      const extras = [
        ...styleNotes.map((note) => `estilo: ${note}`),
        ...textNotes.map((note) => `conteúdo: ${note}`),
        ...imageNotes.map((note) => `imagem: ${note}`),
      ]

      return `${index + 1}. ${component?.name ?? slot.componentId} (\`${slot.componentId}\`)${
        extras.length ? `\n   - ${extras.join('\n   - ')}` : ''
      }`
    })
    .join('\n')

  return [
    `# Prompt — montar página com Componentes Bloomin`,
    '',
    `Quero que você implemente no meu projeto Next.js (App Router + TypeScript + Tailwind) a página da rota \`${route}\`, baseada no template **${recipe.name}**.`,
    '',
    recipe.description,
    '',
    '## Objetivo',
    '',
    'Use o documento completo abaixo (código pronto + arquivos). Limpe o conteúdo de exemplo do template e aplique **somente** as seções listadas, na ordem, respeitando as personalizações de estilo, texto e imagens.',
    '',
    '## Estrutura personalizada',
    '',
    structure,
    '',
    '## Regras',
    '',
    '1. Não invente seções extras.',
    '2. Preserve a ordem da estrutura.',
    '3. Aplique cores, bordas, gradientes, paddings, deslocamentos e imagens exatamente como no código gerado.',
    '4. Se algum texto/imagem personalizado não couber como prop, adapte o conteúdo do componente sem mudar a estrutura visual.',
    '5. Ao final, liste os arquivos criados/substituídos.',
    '',
    '## Documento completo da página',
    '',
    document,
    '',
  ].join('\n')
}

export function summarizeCustomizations(slots: TemplateSlot[]) {
  return slots.reduce((count, slot) => {
    const texts = Object.values(slot.texts).filter(Boolean).length
    const images = hasImageCustomizations(slot.images) ? 1 : 0
    const styles = hasStyleCustomizations(slot.style) ? 1 : 0
    return count + texts + images + styles
  }, 0)
}
