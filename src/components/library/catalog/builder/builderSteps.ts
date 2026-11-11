import { matchesSectionFilter, type SectionFilter } from '../catalogFilters'
import { componentManifest, type CatalogComponent } from '../manifest'
import { getLayoutRecipe, normalizeRecipeComponents, type LayoutRecipe } from '../layoutRecipes'

export type BuilderPlacement = 'header' | 'main' | 'footer' | 'floating'

export type BuilderStep = {
  id: string
  title: string
  description: string
  placement: BuilderPlacement
  matches: (component: CatalogComponent) => boolean
}

const byTopic = (topic: SectionFilter) => (component: CatalogComponent) =>
  matchesSectionFilter(component, topic)

export const builderSteps: BuilderStep[] = [
  {
    id: 'topbar',
    title: 'Top bars',
    description: 'Faixas superiores de anúncio ou contato, acima da navbar.',
    placement: 'header',
    matches: byTopic('topbar'),
  },
  {
    id: 'navbar',
    title: 'Navbars',
    description: 'Menu principal e navegação do site.',
    placement: 'header',
    matches: byTopic('navbar'),
  },
  {
    id: 'banner',
    title: 'Banner',
    description: 'A primeira dobra da página: hero, carrossel ou cabeçalho de página.',
    placement: 'main',
    matches: byTopic('banner'),
  },
  {
    id: 'about',
    title: 'Sobre nós',
    description: 'História, números, valores, equipe e presença da empresa.',
    placement: 'main',
    matches: byTopic('about'),
  },
  {
    id: 'differentials',
    title: 'Diferenciais',
    description: 'Benefícios, recursos, processos e motivos para escolher a empresa.',
    placement: 'main',
    matches: (component) =>
      byTopic('differentials')(component) ||
      component.id === 'process-steps' ||
      component.id === 'interactive-steps' ||
      component.id === 'progress-steps',
  },
  {
    id: 'products',
    title: 'Produtos e serviços',
    description: 'Vitrines, catálogos, planos e comparativos.',
    placement: 'main',
    matches: byTopic('products'),
  },
  {
    id: 'galleries',
    title: 'Galeria',
    description: 'Fotos de projetos, mosaicos e carrosséis de imagens.',
    placement: 'main',
    matches: byTopic('galleries'),
  },
  {
    id: 'testimonials',
    title: 'Depoimentos',
    description: 'Prova social com avaliações de clientes.',
    placement: 'main',
    matches: byTopic('testimonials'),
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Listagens de posts e páginas de artigo.',
    placement: 'main',
    matches: byTopic('blog'),
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Perguntas frequentes em acordeão.',
    placement: 'main',
    matches: byTopic('faq'),
  },
  {
    id: 'cta',
    title: 'Chamada para ação',
    description: 'Blocos que convidam o visitante para o próximo passo.',
    placement: 'main',
    matches: ({ id }) => id.startsWith('cta-'),
  },
  {
    id: 'contact',
    title: 'Contato',
    description: 'Formulários, canais de atendimento e mapa.',
    placement: 'main',
    matches: byTopic('contact'),
  },
  {
    id: 'footer',
    title: 'Rodapé',
    description: 'O fechamento do site com links, contatos e redes sociais.',
    placement: 'footer',
    matches: byTopic('footer'),
  },
  {
    id: 'floating',
    title: 'Flutuantes',
    description:
      'Elementos fixos na tela: WhatsApp, voltar ao topo, aviso de cookies e barra de progresso.',
    placement: 'floating',
    matches: byTopic('floating'),
  },
]

export const reviewStepIndex = builderSteps.length

export const stepComponents = Object.fromEntries(
  builderSteps.map((step) => [step.id, componentManifest.filter(step.matches)]),
) as Record<string, CatalogComponent[]>

export type BuilderSelection = { stepId: string; componentId: string }

const componentsById = new Map(componentManifest.map((component) => [component.id, component]))

/** Associa um componente à primeira etapa do builder que o aceita. */
export function stepIdForComponent(componentId: string): string | null {
  const component = componentsById.get(componentId)
  if (!component) return null
  return builderSteps.find((step) => step.matches(component))?.id ?? null
}

/** Converte uma receita de layout em seleções do page builder, na ordem da receita. */
export function selectionsFromRecipe(recipe: LayoutRecipe): BuilderSelection[] {
  const selections: BuilderSelection[] = []
  for (const componentId of normalizeRecipeComponents(recipe.components)) {
    const stepId = stepIdForComponent(componentId)
    if (!stepId) continue
    if (selections.some((selection) => selection.componentId === componentId)) continue
    selections.push({ stepId, componentId })
  }
  return selections
}

export function selectionsFromRecipeId(recipeId: string): BuilderSelection[] {
  const recipe = getLayoutRecipe(recipeId)
  return recipe ? selectionsFromRecipe(recipe) : []
}
