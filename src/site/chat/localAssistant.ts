import { componentManifest, type CatalogComponent } from '@/components/library/catalog/manifest'
import {
  layoutRecipes,
  normalizeRecipeComponents,
  type LayoutRecipe,
} from '@/components/library/catalog/layoutRecipes'
import { normalizeSearch } from '@/components/library/catalog/catalogSearch'
import { builderSteps, stepIdForComponent } from '@/components/library/catalog/builder/builderSteps'
import {
  buildComponentStyles,
  parsePalette,
  resolvePalette,
  type LayoutPalette,
  type LayoutStyles,
} from './colorPalette'
import { understandQuery, tokensMatchAny, type UnderstoodQuery } from './understandQuery'

export type { LayoutPalette }

export type GeneratedLayout = {
  title: string
  summary: string
  components: string[]
  baseRecipeId: string | null
  palette: LayoutPalette
  styles: LayoutStyles
  interpretation?: string
}

export type LocalChatResult = {
  text: string
  layout?: GeneratedLayout
}

type Scored<T> = { item: T; score: number }

/** Pedidos de seção → componentes preferidos. */
const FEATURE_RULES: { tokens: string[]; add: string[]; label: string }[] = [
  {
    tokens: ['whatsapp', 'zap', 'wpp', 'orcamento', 'cotacao', 'pedido'],
    add: ['whatsapp-quote-form', 'floating-whatsapp-button'],
    label: 'WhatsApp / orçamento',
  },
  {
    tokens: ['faq', 'duvida', 'perguntas', 'ajuda'],
    add: ['faq-help-card'],
    label: 'FAQ',
  },
  {
    tokens: ['equipe', 'time', 'medico', 'doutor', 'profissionais', 'staff'],
    add: ['team-section'],
    label: 'equipe',
  },
  {
    tokens: ['depoimento', 'avaliacao', 'review', 'testemunho'],
    add: ['testimonials-grid'],
    label: 'depoimentos',
  },
  {
    tokens: ['galeria', 'foto', 'fotos', 'imagens', 'portfolio', 'trabalhos'],
    add: ['gallery-grid'],
    label: 'galeria',
  },
  {
    tokens: ['mapa', 'endereco', 'localizacao', 'local', 'maps'],
    add: ['map-embed-section'],
    label: 'mapa',
  },
  {
    tokens: ['blog', 'artigos', 'noticias', 'posts', 'conteudo'],
    add: ['blog-grid'],
    label: 'blog',
  },
  {
    tokens: ['preco', 'plano', 'pricing', 'pacote', 'valores', 'mensalidade'],
    add: ['pricing-cards'],
    label: 'preços',
  },
  {
    tokens: ['processo', 'etapas', 'comofunciona', 'passoapasso', 'metodologia'],
    add: ['process-steps'],
    label: 'processo',
  },
  {
    tokens: ['credibilidad', 'selo', 'certific'],
    add: ['credibility-section'],
    label: 'credibilidade',
  },
  {
    tokens: ['cobertura', 'regiao', 'atendemos'],
    add: ['coverage-callout'],
    label: 'cobertura',
  },
  { tokens: ['newsletter'], add: ['newsletter-form'], label: 'newsletter' },
  { tokens: ['cookie'], add: ['cookie-banner'], label: 'cookies' },
  {
    tokens: ['metricas', 'numeros', 'stats'],
    add: ['about-metrics-section'],
    label: 'métricas',
  },
  {
    tokens: ['servico', 'tratamentos', 'pilares'],
    add: ['hover-reveal-services'],
    label: 'serviços',
  },
  {
    tokens: ['problema', 'solucao'],
    add: ['problem-solution-cards'],
    label: 'problema→solução',
  },
  {
    tokens: ['logo', 'parceiro', 'clientes'],
    add: ['logo-carousel-band'],
    label: 'logos',
  },
  { tokens: ['cta'], add: ['cta-banner'], label: 'CTA' },
  {
    tokens: ['formulario', 'contato', 'faleconosco', 'agendar'],
    add: ['contact-form'],
    label: 'contato',
  },
]

function scoreText(haystack: string, tokens: string[]) {
  const normalized = normalizeSearch(haystack)
  let score = 0
  for (const token of tokens) {
    if (token.length < 2) continue
    if (normalized === token) score += 12
    else if (normalized.includes(token)) score += 6
    else if (token.length >= 4 && normalized.includes(token.slice(0, 4))) score += 2
  }
  return score
}

function scoreRecipe(recipe: LayoutRecipe, tokens: string[]) {
  return (
    scoreText(recipe.id, tokens) * 1.4 +
    scoreText(recipe.name, tokens) * 1.3 +
    scoreText(recipe.description, tokens) +
    scoreText(recipe.audience, tokens) +
    scoreText(recipe.components.join(' '), tokens) * 0.5
  )
}

function scoreComponent(component: CatalogComponent, tokens: string[]) {
  return (
    scoreText(component.id, tokens) * 1.5 +
    scoreText(component.name, tokens) * 1.4 +
    scoreText(component.description, tokens) +
    scoreText(component.tags.join(' '), tokens) * 1.2 +
    scoreText(component.category, tokens)
  )
}

function topRecipes(tokens: string[], limit = 3): Scored<LayoutRecipe>[] {
  return layoutRecipes
    .map((item) => ({ item, score: scoreRecipe(item, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function topComponents(tokens: string[], limit = 5): Scored<CatalogComponent>[] {
  return componentManifest
    .map((item) => ({ item, score: scoreComponent(item, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function findComponent(query: string) {
  const normalized = normalizeSearch(query)
  return (
    componentManifest.find((item) => item.id === normalized) ||
    componentManifest.find((item) => normalizeSearch(item.name) === normalized) ||
    componentManifest.find(
      (item) =>
        normalized.includes(item.id) ||
        item.id.includes(normalized) ||
        normalizeSearch(item.name).includes(normalized),
    )
  )
}

function findRecipe(query: string) {
  const normalized = normalizeSearch(query).replace(/^recipe:/, '')
  return (
    layoutRecipes.find((item) => item.id === normalized) ||
    layoutRecipes.find((item) => normalizeSearch(item.name) === normalized) ||
    layoutRecipes.find(
      (item) => normalized.includes(item.id) || normalizeSearch(item.name).includes(normalized),
    )
  )
}

function componentLabel(id: string) {
  return componentManifest.find((item) => item.id === id)?.name ?? id
}

/** Monta um layout ordenado a partir do entendimento do texto. */
export function composeLayout(userText: string, understood?: UnderstoodQuery): GeneratedLayout {
  const understoodQueryResult = understood ?? understandQuery(userText)
  const tokens = [
    ...understoodQueryResult.expanded,
    ...understoodQueryResult.features,
    ...understoodQueryResult.subjects.flatMap((subject) => subject.split(' ')),
  ]
  const niche = understoodQueryResult.niche
  const scored = topRecipes(tokens, 1)
  const base =
    (niche && layoutRecipes.find((recipe) => recipe.id === niche.recipeIds[0])) ||
    scored[0]?.item ||
    (understoodQueryResult.subjects.length
      ? layoutRecipes.find((recipe) => recipe.id === 'institutional')
      : null) ||
    layoutRecipes.find((recipe) => recipe.id === 'landing-page') ||
    layoutRecipes[0]

  const byStep = new Map<string, string>()
  const floating: string[] = []

  for (const id of base.components) {
    const step = stepIdForComponent(id)
    if (!step) continue
    if (step === 'floating') {
      if (!floating.includes(id)) floating.push(id)
    } else {
      byStep.set(step, id)
    }
  }

  if (!byStep.has('navbar')) byStep.set('navbar', 'navbar-accent')
  if (!byStep.has('banner')) byStep.set('banner', 'pillars-hero')
  if (!byStep.has('footer')) byStep.set('footer', 'footer-contact-columns')

  const appliedFeatures: string[] = []
  for (const rule of FEATURE_RULES) {
    const fromFeatures = rule.tokens.some((token) =>
      understoodQueryResult.features.some(
        (feature) => feature.includes(token) || token.includes(feature),
      ),
    )
    if (!fromFeatures && !tokensMatchAny(tokens, rule.tokens)) continue
    appliedFeatures.push(rule.label)
    for (const id of rule.add) {
      const step = stepIdForComponent(id)
      if (!step) continue
      if (step === 'floating') {
        if (!floating.includes(id)) floating.push(id)
      } else {
        byStep.set(step, id)
      }
    }
  }

  for (const component of componentManifest) {
    if (!tokens.includes(component.id) && !normalizeSearch(userText).includes(component.id)) {
      continue
    }
    const step = stepIdForComponent(component.id)
    if (!step) continue
    if (step === 'floating') {
      if (!floating.includes(component.id)) floating.push(component.id)
    } else {
      byStep.set(step, component.id)
    }
  }

  const components = normalizeRecipeComponents([
    ...builderSteps
      .filter((step) => step.id !== 'floating')
      .map((step) => byStep.get(step.id))
      .filter((id): id is string => Boolean(id)),
    ...floating,
  ])

  const title = niche?.label || base.name
  const palette = resolvePalette(userText, base.id)
  const styles = buildComponentStyles(components, userText, palette)
  const featureNote =
    appliedFeatures.length > 0
      ? ` Ajustes: ${[...new Set(appliedFeatures)].slice(0, 8).join(', ')}.`
      : ''
  const styleNote = ` Estilo aplicado: marca ${palette.primary}${
    /escuro|dark/.test(normalizeSearch(userText)) ? ', tema escuro' : ''
  }${/arredond|moderno|soft/.test(normalizeSearch(userText)) ? ', cantos suaves' : ''}.`

  return {
    title,
    summary: `${niche?.blurb || `Baseado no template ${base.name}.`}${featureNote}${styleNote}`,
    components,
    baseRecipeId: base.id,
    palette,
    styles,
    interpretation: understoodQueryResult.interpretation,
  }
}

function builderUrl(components: string[]) {
  return `/montar-pagina?components=${encodeURIComponent(components.join(','))}`
}

function formatLayout(layout: GeneratedLayout) {
  const lines = layout.components.map((id, index) => {
    const step = stepIdForComponent(id)
    return `${index + 1}. \`${id}\` — **${componentLabel(id)}**${step ? ` (${step})` : ''}`
  })
  return [
    `### Layout: ${layout.title}`,
    layout.interpretation ? `_Entendi: ${layout.interpretation}_` : '',
    layout.summary,
    '',
    `**${layout.components.length} seções** · marca \`${layout.palette.primary}\``,
    '',
    ...lines,
    '',
    `**Abrir no montador:** ${builderUrl(layout.components)}`,
  ]
    .filter(Boolean)
    .join('\n')
}

function formatRecipe(recipe: LayoutRecipe) {
  return [
    `**${recipe.name}** (\`recipe:${recipe.id}\`)`,
    recipe.description,
    `Público: ${recipe.audience}`,
    `Seções: ${recipe.components.join(' → ')}`,
    `Montar página: /montar-pagina?recipe=${recipe.id}`,
  ].join('\n')
}

function formatComponent(component: CatalogComponent) {
  const props = component.props
    .slice(0, 6)
    .map((prop) => `• \`${prop.name}\` (${prop.type}) — ${prop.description}`)
    .join('\n')
  return [
    `**${component.name}** (\`${component.id}\`)`,
    component.description,
    `Categoria: ${component.category}${component.client ? ' · client component' : ''}`,
    `Import: \`import { ${component.name} } from '${component.importPath}'\``,
    props ? `Principais props:\n${props}` : '',
    `Catálogo: /componentes/${component.id}`,
  ]
    .filter(Boolean)
    .join('\n')
}

function extractIds(text: string, tokens: string[]) {
  const recipeIds = [...text.matchAll(/recipe:([a-z0-9-]+)/gi)].map((match) => match[1])
  const componentIds = tokens.filter((token) => componentManifest.some((item) => item.id === token))
  return { recipeIds, componentIds }
}

/** Resposta local — sem API. Entende pedidos fora do padrão. */
export function answerLocally(userText: string): LocalChatResult {
  const text = userText.trim()
  if (!text) {
    return {
      text: 'Pode escrever naturalmente — ex.: “tenho uma funilaria e quero site com zap e fotos dos serviços”.',
    }
  }

  const understood = understandQuery(text)
  const { recipeIds, componentIds } = extractIds(text, understood.expanded)

  if (understood.intent === 'hello' && understood.layoutConfidence < 0.35) {
    return {
      text: [
        'Olá! Pode digitar do seu jeito — não precisa de comando certo.',
        '',
        'Exemplos fora do comum que eu entendo:',
        '• “mano preciso de um site pra minha oficina de funilaria com zap”',
        '• “consultorio de psico, quero mostrar a equipe e as duvidas frequentes”',
        '• “eh um app de assinatura, azul, com precos e CTA”',
        '',
        `Catálogo: **${layoutRecipes.length} templates** · **${componentManifest.length} componentes**.`,
      ].join('\n'),
    }
  }

  if (understood.intent === 'compare' || recipeIds.length >= 2) {
    const a = findRecipe(recipeIds[0] || 'industrial') || findRecipe('industrial')
    const b = findRecipe(recipeIds[1] || 'industrial-services') || findRecipe('industrial-services')
    if (a && b) {
      return {
        text: [
          `Comparando **${a.name}** e **${b.name}**:`,
          '',
          `### ${a.name}`,
          a.description,
          `Foco: ${a.audience}`,
          '',
          `### ${b.name}`,
          b.description,
          `Foco: ${b.audience}`,
          '',
          `Abrir: /montar-pagina?recipe=${a.id} · /montar-pagina?recipe=${b.id}`,
        ].join('\n'),
      }
    }
  }

  // Pedido livre → monta layout sempre que houver nicho, assunto ou seções
  if (
    understood.layoutConfidence >= 0.25 ||
    understood.intent === 'create' ||
    parsePalette(text) ||
    understood.niche ||
    understood.subjects.length > 0 ||
    understood.features.length > 0
  ) {
    const layout = composeLayout(text, understood)
    return { text: formatLayout(layout), layout }
  }

  const mentionedComponent =
    componentIds.map((id) => findComponent(id)).find(Boolean) ||
    (understood.intent === 'component' || understood.intent === 'install'
      ? findComponent(text)
      : undefined)

  if (
    mentionedComponent &&
    (understood.intent === 'install' || understood.intent === 'component' || componentIds.length)
  ) {
    return {
      text: [
        formatComponent(mentionedComponent),
        '',
        'Quer um layout em volta disso? Descreva o negócio do seu jeito.',
      ].join('\n'),
    }
  }

  const mentionedRecipe =
    recipeIds.map((id) => findRecipe(id)).find(Boolean) ||
    (understood.intent === 'template' ? findRecipe(text) : undefined)

  if (mentionedRecipe) {
    const layout = composeLayout(text, understood)
    return {
      text: [formatRecipe(mentionedRecipe), '', formatLayout(layout)].join('\n'),
      layout,
    }
  }

  const recipes = topRecipes(understood.expanded, 3)
  const components = topComponents(understood.expanded, 5)

  if (understood.intent === 'install') {
    return {
      text: [
        'Para levar o código: monte o layout e use **Baixar ZIP** no montador, ou baixe o ZIP do template.',
        components.length
          ? `\nSugestões: ${components
              .slice(0, 3)
              .map(({ item }) => `\`${item.id}\``)
              .join(', ')}`
          : '',
      ].join('\n'),
    }
  }

  if (recipes.length) {
    const layout = composeLayout(text, understood)
    return {
      text: [`_Entendi: ${understood.interpretation}_`, '', formatLayout(layout)]
        .filter(Boolean)
        .join('\n'),
      layout,
    }
  }

  return {
    text: [
      'Não fechei o nicho com segurança — pode reformular à vontade.',
      `_Sinais que peguei: ${understood.interpretation}_`,
      '',
      'Tente algo como:',
      '• “tenho uma pizzaria e quero site com cardapio e whatsapp”',
      '• “sou corretor, preciso mostrar imoveis e depoimentos”',
      '• “oficina de galvanizacao em azul, com faq e orcamento”',
    ].join('\n'),
  }
}

/** Simula digitação na UI (continua 100% local). */
export async function streamLocalAnswer(
  userText: string,
  onDelta: (chunk: string) => void,
): Promise<LocalChatResult> {
  const result = answerLocally(userText)
  const parts = result.text.split(/(\s+)/)
  for (const part of parts) {
    onDelta(part)
    await new Promise((resolve) => setTimeout(resolve, part.trim() ? 6 : 2))
  }
  return result
}
