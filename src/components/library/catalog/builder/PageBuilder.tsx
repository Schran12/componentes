'use client'

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  Eye,
  FileCode2,
  GripVertical,
  Loader2,
  Maximize2,
  Trash2,
  Wand2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ComponentPreview } from '../ComponentPreview'
import { getLayoutRecipe, type LayoutRecipe } from '../layoutRecipes'
import { componentManifest } from '../manifest'
import { ScrollToTopButton } from '@/components/library/navigation/ScrollToTopButton'
import { paletteToCssVars, type LayoutPalette, type LayoutStyles } from '@/site/chat/colorPalette'
import { StyledSlotCanvas } from '../templates/StyledSlotCanvas'
import type { SectionStyle } from '../templates/sectionCustomization'
import { BuilderOptionCard } from './BuilderOptionCard'
import {
  builderSteps,
  selectionsFromRecipe,
  stepIdForComponent,
  type BuilderPlacement,
  type BuilderSelection,
} from './builderSteps'
import {
  generatePageDocument,
  normalizeRoute,
  type GeneratedPage,
  type PageSnippet,
  type ThemeBundle,
} from './generatePageDocument'
import { useSortableList } from '../useSortableList'
import { downloadRegistryItemsZip } from '@/lib/downloadSource'

const placementOrder: BuilderPlacement[] = ['header', 'main', 'footer', 'floating']
const componentsById = new Map(componentManifest.map((component) => [component.id, component]))
const stepsById = new Map(builderSteps.map((step) => [step.id, step]))
const jsonCache = new Map<string, Promise<unknown>>()
const reviewStepIndex = builderSteps.length

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

function sortByPlacement(selections: BuilderSelection[]) {
  const rank = (selection: BuilderSelection) =>
    placementOrder.indexOf(stepsById.get(selection.stepId)?.placement ?? 'main')
  return [...selections].sort((a, b) => rank(a) - rank(b))
}

function builderStepAt(stepIndex: number) {
  if (stepIndex < 0 || stepIndex >= reviewStepIndex) return null
  return builderSteps[stepIndex]
}

type BuilderLocationState = {
  recipeId?: string
  components?: string[]
  selections?: BuilderSelection[]
  palette?: LayoutPalette
  styles?: LayoutStyles
}

export function PageBuilder() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const locationState = (location.state as BuilderLocationState | null) ?? null
  const recipeParam = searchParams.get('recipe')
  const componentsParam = searchParams.get('components')
  const [stepIndex, setStepIndex] = useState(0)
  const [selections, setSelections] = useState<BuilderSelection[]>([])
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null)
  const [route, setRoute] = useState('/')
  const [includeTheme, setIncludeTheme] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [palette, setPalette] = useState<LayoutPalette | null>(locationState?.palette ?? null)
  const [styles, setStyles] = useState<LayoutStyles>(locationState?.styles ?? {})
  const [result, setResult] = useState<GeneratedPage | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [copied, setCopied] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const appliedRecipe = useRef<string | null>(null)
  const appliedCustom = useRef(false)

  useEffect(() => setResult(null), [selections, route, includeTheme])

  useEffect(() => {
    if (locationState?.palette) setPalette(locationState.palette)
    if (locationState?.styles) setStyles(locationState.styles)
  }, [locationState?.palette, locationState?.styles])

  function applyComponentIds(componentIds: string[], recipeId?: string | null) {
    const next = componentIds
      .map((componentId) => {
        const stepId = stepIdForComponent(componentId)
        return stepId ? { stepId, componentId } : null
      })
      .filter(Boolean) as BuilderSelection[]
    if (!next.length) return
    setSelections(next)
    setActiveRecipeId(recipeId ?? null)
    goTo(reviewStepIndex)
  }

  useEffect(() => {
    if (appliedCustom.current) return
    if (locationState?.selections?.length) {
      appliedCustom.current = true
      setSelections(locationState.selections)
      setActiveRecipeId(locationState.recipeId ?? null)
      if (locationState.recipeId) {
        setSearchParams({ recipe: locationState.recipeId }, { replace: true })
      }
      goTo(reviewStepIndex)
      return
    }
    if (locationState?.components?.length) {
      appliedCustom.current = true
      applyComponentIds(locationState.components, locationState.recipeId)
      if (locationState.recipeId) {
        setSearchParams({ recipe: locationState.recipeId }, { replace: true })
      } else {
        setSearchParams({ components: locationState.components.join(',') }, { replace: true })
      }
      return
    }
    if (componentsParam) {
      appliedCustom.current = true
      const ids = componentsParam
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
      applyComponentIds(ids)
      return
    }
    if (!recipeParam || appliedRecipe.current === recipeParam) return
    const recipe = getLayoutRecipe(recipeParam)
    if (!recipe) return
    appliedRecipe.current = recipeParam
    applyRecipe(recipe)
  }, [recipeParam, componentsParam, locationState])

  const ordered = useMemo(() => sortByPlacement(selections), [selections])
  const isReview = stepIndex === reviewStepIndex
  const step = builderStepAt(stepIndex)
  const options = step ? builderSteps.find((item) => item.id === step.id)! : null
  const stepOptions = options
    ? componentManifest.filter((component) => options.matches(component))
    : []

  function goTo(index: number) {
    setStepIndex(Math.min(Math.max(index, 0), reviewStepIndex))
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function applyRecipe(recipe: LayoutRecipe) {
    setSelections(selectionsFromRecipe(recipe))
    setActiveRecipeId(recipe.id)
    setSearchParams({ recipe: recipe.id }, { replace: true })
    goTo(reviewStepIndex)
  }

  function isSelected(stepId: string, componentId: string) {
    return selections.some(
      (selection) => selection.stepId === stepId && selection.componentId === componentId,
    )
  }

  function toggle(stepId: string, componentId: string) {
    setActiveRecipeId(null)
    setSelections((current) =>
      isSelected(stepId, componentId)
        ? current.filter(
            (selection) => !(selection.stepId === stepId && selection.componentId === componentId),
          )
        : [...current, { stepId, componentId }],
    )
  }

  function reorderSelections(next: BuilderSelection[]) {
    setSelections(next)
  }

  async function generate() {
    setStatus('loading')
    try {
      const [snippets, theme] = await Promise.all([
        Promise.all(
          ordered.map((selection) =>
            fetchJson<PageSnippet>(`/registry/pages/${selection.componentId}.json`),
          ),
        ),
        includeTheme ? fetchJson<ThemeBundle>('/registry/theme.json') : undefined,
      ])
      setResult(
        generatePageDocument({
          route,
          theme,
          sections: ordered.map((selection, index) => {
            const selectionStep = stepsById.get(selection.stepId)!
            return {
              snippet: snippets[index],
              stepTitle: selectionStep.title,
              placement: selectionStep.placement,
            }
          }),
        }),
      )
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }

  async function copyDocument() {
    if (!result) return
    await navigator.clipboard.writeText(result.document)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function downloadDocument() {
    if (!result) return
    const url = URL.createObjectURL(new Blob([result.document], { type: 'text/markdown' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `pagina${normalizeRoute(route) === '/' ? '-inicial' : normalizeRoute(route).replace(/\//g, '-')}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  const [zipStatus, setZipStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function downloadZip() {
    if (!ordered.length || zipStatus === 'loading') return
    setZipStatus('loading')
    try {
      const slug =
        activeRecipeId ||
        (normalizeRoute(route) === '/'
          ? 'pagina-inicial'
          : normalizeRoute(route).replace(/\//g, '-').replace(/^-/, ''))
      await downloadRegistryItemsZip(
        ordered.map((selection) => selection.componentId),
        {
          filename: `${slug || 'pagina-montada'}.zip`,
          includeTheme,
          title: activeRecipeId
            ? getLayoutRecipe(activeRecipeId)?.name || 'Página montada'
            : 'Página montada',
          extraFiles: result
            ? [
                { path: 'INSTRUCOES.md', content: result.document },
                ...result.files.map((file) => ({
                  path: file.path.replace(/^\/+/, ''),
                  content: file.content,
                })),
              ]
            : undefined,
        },
      )
      setZipStatus('done')
      window.setTimeout(() => setZipStatus('idle'), 2000)
    } catch {
      setZipStatus('error')
      window.setTimeout(() => setZipStatus('idle'), 2500)
    }
  }

  const stepCount = (stepId: string) =>
    selections.filter((selection) => selection.stepId === stepId).length

  const navItems = [...builderSteps, { id: 'review', title: 'Revisão e código' }]

  return (
    <main id="conteudo">
      <section className="border-b bg-slate-950 text-white">
        <div className="container py-12 md:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
            <Wand2 className="h-3.5 w-3.5" />
            Construtor de páginas
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Monte a página seção por seção.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/70">
            Escolha os componentes de cada etapa, ajuste a ordem e gere o documento completo da
            página.
          </p>
        </div>
      </section>

      <div
        ref={topRef}
        className="container grid scroll-mt-20 gap-8 py-8 md:py-12 lg:grid-cols-[220px_minmax(0,1fr)]"
      >
        <aside className="hidden lg:block">
          <nav aria-label="Etapas" className="sticky top-24">
            <ol className="space-y-0.5">
              {navItems.map((item, index) => {
                const count = item.id === 'review' ? selections.length : stepCount(item.id)
                const active = index === stepIndex
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-current={active ? 'step' : undefined}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        active
                          ? 'bg-primary font-medium text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] tabular-nums',
                          active
                            ? 'bg-primary-foreground/20'
                            : count
                              ? 'bg-primary/15 text-primary'
                              : 'bg-muted',
                        )}
                      >
                        {count && !active && item.id !== 'review' ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="truncate">{item.title}</span>
                      {count ? (
                        <span className="ml-auto text-[11px] tabular-nums opacity-80">{count}</span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>
        </aside>

        <section className="min-w-0" aria-live="polite">
          <div className="mb-5 lg:hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Etapa {stepIndex + 1} de {reviewStepIndex + 1}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${((stepIndex + 1) / (reviewStepIndex + 1)) * 100}%` }}
              />
            </div>
          </div>

          {step ? (
            <>
              <header className="mb-5">
                <h2 className="text-2xl font-bold tracking-tight">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description} Selecione um ou mais, ou pule esta etapa.
                </p>
              </header>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stepOptions.map((component) => (
                  <BuilderOptionCard
                    key={component.id}
                    component={component}
                    selected={isSelected(step.id, component.id)}
                    onToggle={() => toggle(step.id, component.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <ReviewStep
              ordered={ordered}
              activeRecipeId={activeRecipeId}
              route={route}
              onRouteChange={setRoute}
              includeTheme={includeTheme}
              onIncludeThemeChange={setIncludeTheme}
              showPreview={showPreview}
              onShowPreviewChange={setShowPreview}
              palette={palette}
              styles={styles}
              onClearPalette={() => {
                setPalette(null)
                setStyles({})
              }}
              onReorder={reorderSelections}
              onRemove={(selection) => toggle(selection.stepId, selection.componentId)}
              onEditStep={(stepId) => goTo(builderSteps.findIndex(({ id }) => id === stepId))}
              onGenerate={generate}
              status={status}
              result={result}
              copied={copied}
              onCopy={copyDocument}
              onDownload={downloadDocument}
              onDownloadZip={downloadZip}
              zipStatus={zipStatus}
            />
          )}

          <div className="sticky bottom-0 z-20 -mx-1 mt-8 flex items-center gap-3 border-t bg-background/95 px-1 py-3 backdrop-blur">
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo(stepIndex - 1)}
              disabled={stepIndex === 0}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar
            </Button>
            <p className="min-w-0 flex-1 truncate text-center text-sm text-muted-foreground">
              {selections.length}{' '}
              {selections.length === 1 ? 'componente na página' : 'componentes na página'}
            </p>
            {isReview ? null : (
              <Button type="button" onClick={() => goTo(stepIndex + 1)}>
                {step && stepCount(step.id) ? 'Próximo' : 'Pular'}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

const PREVIEW_FLOATING_IDS = new Set([
  'scroll-to-top-button',
  'floating-whatsapp-button',
  'floating-instagram-button',
  'floating-facebook-button',
  'floating-linkedin-button',
  'floating-youtube-button',
  'floating-tiktok-button',
  'floating-x-button',
  'floating-social-stack',
  'cookie-banner',
  'scroll-progress',
])

function MountedLayoutPreview({
  ordered,
  palette,
  styles,
  onClearPalette,
  chrome,
  fill = false,
}: {
  ordered: BuilderSelection[]
  palette: LayoutPalette | null
  styles: LayoutStyles
  onClearPalette: () => void
  chrome: boolean
  /** Ocupa a altura do pai (tela cheia). */
  fill?: boolean
}) {
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null)
  const sections = ordered.filter((selection) => !PREVIEW_FLOATING_IDS.has(selection.componentId))
  const hasScrollToTop = ordered.some(
    (selection) => selection.componentId === 'scroll-to-top-button',
  )

  return (
    <div
      className={cn('preview-light relative bg-white', fill ? 'h-full min-h-0' : 'max-h-[70vh]')}
    >
      <div
        ref={setScrollEl}
        className={cn(
          'overflow-auto bg-background text-foreground',
          fill ? 'h-full' : 'max-h-[70vh]',
          chrome ? 'space-y-6 p-4 md:p-6' : 'min-h-full',
        )}
        style={palette ? (paletteToCssVars(palette) as CSSProperties) : undefined}
      >
        {palette && chrome ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">Tema da marca</span>
            <span className="inline-flex h-3.5 w-3.5 rounded-full bg-primary" />
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
              Botão
            </span>
            <span>{palette.label}</span>
            <button
              type="button"
              className="ml-auto text-primary underline"
              onClick={onClearPalette}
            >
              Remover tema
            </button>
          </div>
        ) : null}
        {sections.map((selection) => {
          const style: SectionStyle = styles[selection.componentId] ?? {}
          const hasStyle = Object.keys(style).length > 0
          const body = hasStyle ? (
            <StyledSlotCanvas
              slot={{
                key: selection.componentId,
                componentId: selection.componentId,
                style,
                texts: {},
                images: {},
              }}
            />
          ) : (
            <ComponentPreview id={selection.componentId} />
          )

          if (!chrome) {
            return <div key={`full:${selection.componentId}`}>{body}</div>
          }

          return (
            <div
              key={`preview:${selection.componentId}`}
              className="overflow-hidden rounded-lg border"
            >
              <p className="border-b bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                {componentsById.get(selection.componentId)?.name} · {selection.componentId}
                {hasStyle ? ' · estilizado' : ''}
              </p>
              <div className={hasStyle ? undefined : 'p-3 md:p-6'}>{body}</div>
            </div>
          )
        })}
      </div>

      {hasScrollToTop && scrollEl ? (
        <div className="pointer-events-none absolute inset-0 z-40">
          <div className="pointer-events-auto absolute bottom-6 right-6">
            <ScrollToTopButton position="static" scrollContainer={scrollEl} threshold={48} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

type ReviewStepProps = {
  ordered: BuilderSelection[]
  activeRecipeId: string | null
  route: string
  onRouteChange: (route: string) => void
  includeTheme: boolean
  onIncludeThemeChange: (value: boolean) => void
  showPreview: boolean
  onShowPreviewChange: (value: boolean) => void
  palette: LayoutPalette | null
  styles: LayoutStyles
  onClearPalette: () => void
  onReorder: (next: BuilderSelection[]) => void
  onRemove: (selection: BuilderSelection) => void
  onEditStep: (stepId: string) => void
  onGenerate: () => void
  status: 'idle' | 'loading' | 'error'
  result: GeneratedPage | null
  copied: boolean
  onCopy: () => void
  onDownload: () => void
  onDownloadZip: () => void
  zipStatus: 'idle' | 'loading' | 'done' | 'error'
}

function LayoutFullscreenPreview({
  open,
  onClose,
  ordered,
  palette,
  styles,
  onClearPalette,
}: {
  open: boolean
  onClose: () => void
  ordered: BuilderSelection[]
  palette: LayoutPalette | null
  styles: LayoutStyles
  onClearPalette: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Layout em tela cheia"
      className="fixed inset-0 z-[100] flex flex-col bg-background"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 100,
      }}
    >
      <div className="flex shrink-0 items-start justify-between gap-3 border-b bg-background px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Layout em tela cheia</p>
          <p className="text-xs text-muted-foreground">
            Visualize a página montada como no projeto final. Esc ou o X para fechar.
          </p>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="shrink-0"
          onClick={onClose}
          aria-label="Fechar tela cheia"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 bg-white">
        <MountedLayoutPreview
          ordered={ordered}
          palette={palette}
          styles={styles}
          onClearPalette={onClearPalette}
          chrome={false}
          fill
        />
      </div>
    </div>,
    document.body,
  )
}

function ReviewStep({
  ordered,
  activeRecipeId,
  route,
  onRouteChange,
  includeTheme,
  onIncludeThemeChange,
  showPreview,
  onShowPreviewChange,
  palette,
  styles,
  onClearPalette,
  onReorder,
  onRemove,
  onEditStep,
  onGenerate,
  status,
  result,
  copied,
  onCopy,
  onDownload,
  onDownloadZip,
  zipStatus,
}: ReviewStepProps) {
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const placementOf = (selection?: BuilderSelection) =>
    selection && stepsById.get(selection.stepId)?.placement
  const recipe = activeRecipeId ? getLayoutRecipe(activeRecipeId) : null
  const { dragIndex, getItemProps } = useSortableList({
    items: ordered,
    onReorder,
    canMove: (from, to, items) => placementOf(items[from]) === placementOf(items[to]),
  })

  return (
    <div>
      <header className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">Revisão e código</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Arraste as seções para reordenar (dentro do mesmo bloco), veja o preview e gere o código
          da página.
        </p>
      </header>

      {recipe ? (
        <div className="mb-5 rounded-xl border bg-muted/40 px-4 py-3">
          <p className="text-sm font-medium">Template: {recipe.name}</p>
          <p className="text-xs text-muted-foreground">{recipe.description}</p>
        </div>
      ) : null}

      {ordered.length ? (
        <ol className="divide-y rounded-xl border bg-card">
          {ordered.map((selection, index) => {
            const component = componentsById.get(selection.componentId)!
            const selectionStep = stepsById.get(selection.stepId)!
            const sortable = getItemProps(index)
            const dragging = dragIndex === index
            return (
              <li
                key={`${selection.stepId}:${selection.componentId}`}
                {...sortable}
                className={cn(
                  'flex cursor-grab items-center gap-2 px-3 py-2.5 transition active:cursor-grabbing',
                  dragging && 'bg-primary/5 opacity-70',
                  dragIndex !== null && !dragging && 'border-dashed',
                )}
              >
                <span className="text-muted-foreground" aria-hidden>
                  <GripVertical className="h-4 w-4" />
                </span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs tabular-nums">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{component.name}</p>
                  <button
                    type="button"
                    onClick={() => onEditStep(selection.stepId)}
                    className="cursor-pointer text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                  >
                    {selectionStep.title} · {component.id}
                  </button>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(selection)}
                  aria-label={`Remover ${component.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            )
          })}
        </ol>
      ) : (
        <div className="rounded-xl border border-dashed py-14 text-center text-sm text-muted-foreground">
          Nenhum componente selecionado. Volte às etapas e adicione as seções.
        </div>
      )}

      {ordered.length ? (
        <div className="mt-6 overflow-hidden rounded-xl border">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-4 py-2.5">
            <p className="inline-flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4" />
              Preview ao vivo
            </p>
            <div className="flex flex-wrap items-center gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setFullscreenOpen(true)}
              >
                <Maximize2 className="mr-1.5 h-4 w-4" />
                Tela cheia
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onShowPreviewChange(!showPreview)}
              >
                {showPreview ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
          </div>
          {showPreview ? (
            <MountedLayoutPreview
              ordered={ordered}
              palette={palette}
              styles={styles}
              onClearPalette={onClearPalette}
              chrome
            />
          ) : null}
          <LayoutFullscreenPreview
            open={fullscreenOpen}
            onClose={() => setFullscreenOpen(false)}
            ordered={ordered}
            palette={palette}
            styles={styles}
            onClearPalette={onClearPalette}
          />
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Rota da página</span>
          <input
            value={route}
            onChange={(event) => onRouteChange(event.target.value)}
            placeholder="/"
            className="mt-1.5 h-10 w-full rounded-lg border bg-background px-3 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            Gera{' '}
            <code>
              src/app{normalizeRoute(route) === '/' ? '' : normalizeRoute(route)}/page.tsx
            </code>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm sm:pt-6">
          <input
            type="checkbox"
            checked={includeTheme}
            onChange={(event) => onIncludeThemeChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <span>
            <span className="font-medium">Incluir o tema</span>
            <span className="block text-xs text-muted-foreground">
              Adiciona <code>tailwind.config.js</code> e <code>globals.css</code> com cores, raio e
              animações da biblioteca.
            </span>
          </span>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          size="lg"
          className="w-full sm:w-auto"
          onClick={onGenerate}
          disabled={!ordered.length || status === 'loading'}
        >
          {status === 'loading' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileCode2 className="mr-2 h-4 w-4" />
          )}
          Gerar código completo
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onDownloadZip}
          disabled={!ordered.length || zipStatus === 'loading'}
        >
          {zipStatus === 'loading' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : zipStatus === 'done' ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {zipStatus === 'loading'
            ? 'Baixando ZIP…'
            : zipStatus === 'done'
              ? 'ZIP baixado'
              : zipStatus === 'error'
                ? 'Falhou — tente de novo'
                : 'Baixar ZIP'}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        O ZIP traz o código-fonte dos componentes selecionados
        {includeTheme ? ' + tema' : ''}
        {result ? ' + página gerada' : ''}. Sem CLI.
      </p>
      {status === 'error' ? (
        <p className="mt-3 text-sm text-destructive">
          Não foi possível carregar o registry. Rode <code>npm run registry:build</code> e tente de
          novo.
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 overflow-hidden rounded-xl border bg-slate-950">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
            <p className="text-xs text-slate-400">
              {result.files.length} arquivos ·{' '}
              {result.document.split('\n').length.toLocaleString('pt-BR')} linhas
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onDownload}
                className="text-slate-200 hover:bg-white/10 hover:text-white"
              >
                <Download className="mr-1.5 h-4 w-4" />
                Baixar .md
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={onDownloadZip}
                disabled={zipStatus === 'loading'}
                className="text-slate-200 hover:bg-white/10 hover:text-white"
              >
                <Download className="mr-1.5 h-4 w-4" />
                Baixar ZIP
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onCopy}
                className={cn(copied && 'bg-emerald-600 hover:bg-emerald-600')}
              >
                {copied ? (
                  <Check className="mr-1.5 h-4 w-4" />
                ) : (
                  <Copy className="mr-1.5 h-4 w-4" />
                )}
                {copied ? 'Copiado' : 'Copiar tudo'}
              </Button>
            </div>
          </div>
          <pre className="max-h-[70vh] overflow-auto p-4 text-xs leading-5 text-slate-100">
            <code>{result.document}</code>
          </pre>
        </div>
      ) : null}
    </div>
  )
}
