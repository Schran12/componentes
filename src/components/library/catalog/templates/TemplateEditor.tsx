'use client'

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Download,
  FileCode2,
  GripVertical,
  ImageIcon,
  Layers,
  Loader2,
  PanelRightClose,
  RefreshCcw,
  Replace,
  Sparkles,
  Trash2,
  Undo2,
  Wand2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { stepIdForComponent, stepComponents } from '../builder/builderSteps'
import { normalizeRecipeComponents, type LayoutRecipe } from '../layoutRecipes'
import { componentManifest } from '../manifest'
import { useSortableList } from '../useSortableList'
import { exportTemplatePage, summarizeCustomizations } from './exportTemplatePage'
import {
  getEditableFields,
  hasImageCustomizations,
  hasStyleCustomizations,
  hasTextCustomizations,
  IMAGE_PRESETS,
  imageSlotsFor,
  slotsFromComponents,
  type ImageOverride,
  type SectionStyle,
  type TemplateSlot,
} from './sectionCustomization'
import { SlotCustomizationHints, StyledSlotCanvas } from './StyledSlotCanvas'
import { TemplateContentPanel } from './TemplateContentPanel'
import { TemplateStylePanel } from './TemplateStylePanel'
import { paletteToCssVars, type LayoutPalette } from '@/site/chat/colorPalette'

const componentsById = new Map(componentManifest.map((item) => [item.id, item]))

type PanelTab = 'trocar' | 'estilo' | 'conteudo' | 'imagens'
type HistoryEntry = { previous: TemplateSlot[]; next: TemplateSlot[] }

export type TemplateEditorSeed = {
  components?: string[]
  palette?: LayoutPalette
}

function buildInitialSlots(componentIds: string[]): TemplateSlot[] {
  return slotsFromComponents(componentIds)
}

function alternativesFor(componentId: string) {
  const stepId = stepIdForComponent(componentId)
  if (!stepId) return []
  return (stepComponents[stepId] ?? []).filter((item) => item.id !== componentId)
}

function cloneSlots(slots: TemplateSlot[]): TemplateSlot[] {
  return slots.map((slot) => ({
    ...slot,
    style: { ...slot.style },
    texts: { ...slot.texts },
    images: Object.fromEntries(
      Object.entries(slot.images).map(([key, value]) => [key, { ...value }]),
    ),
  }))
}

export function TemplateEditor({
  recipe,
  seed,
}: {
  recipe: LayoutRecipe
  seed?: TemplateEditorSeed | null
}) {
  const originalIds = useMemo(
    () => normalizeRecipeComponents(seed?.components?.length ? seed.components : recipe.components),
    [recipe.components, seed?.components],
  )
  const [slots, setSlots] = useState<TemplateSlot[]>(() => buildInitialSlots(originalIds))
  const [palette, setPalette] = useState<LayoutPalette | null>(seed?.palette ?? null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [showNavigator, setShowNavigator] = useState(true)
  const [panelTab, setPanelTab] = useState<PanelTab>(seed?.palette ? 'estilo' : 'conteudo')
  const [exportStatus, setExportStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [exportMessage, setExportMessage] = useState<string | null>(null)

  const seedKey = [
    seed?.components?.join(',') ?? '',
    seed?.palette?.primary ?? '',
    seed?.palette?.surface ?? '',
    seed?.palette?.text ?? '',
  ].join('|')

  useEffect(() => {
    if (!seed?.palette && !seed?.components?.length) return
    const ids = normalizeRecipeComponents(
      seed.components?.length ? seed.components : recipe.components,
    )
    setSlots(buildInitialSlots(ids))
    setPalette(seed.palette ?? null)
    if (seed.palette) setPanelTab('conteudo')
    // Aplica seed só quando a origem (deep link / state) muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe.components, seedKey])

  const componentIds = slots.map((slot) => slot.componentId)
  const isDirty =
    componentIds.join('|') !== originalIds.join('|') || summarizeCustomizations(slots) > 0

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  function commit(next: TemplateSlot[]) {
    setHistory((current) => [...current, { previous: cloneSlots(slots), next: cloneSlots(next) }])
    setSlots(next)
  }

  function updateActiveLive(updater: (slot: TemplateSlot) => TemplateSlot) {
    if (activeKey === null) return
    setSlots((current) => current.map((slot) => (slot.key === activeKey ? updater(slot) : slot)))
  }

  function patchStyle(patch: Partial<SectionStyle>) {
    updateActiveLive((slot) => ({ ...slot, style: { ...slot.style, ...patch } }))
  }

  function patchText(name: string, value: string) {
    updateActiveLive((slot) => ({
      ...slot,
      texts: { ...slot.texts, [name]: value },
    }))
  }

  function patchImage(name: string, patch: Partial<ImageOverride>) {
    updateActiveLive((slot) => ({
      ...slot,
      images: {
        ...slot.images,
        [name]: {
          src: patch.src ?? slot.images[name]?.src ?? '',
          alt: patch.alt ?? slot.images[name]?.alt,
        },
      },
    }))
  }

  function swapAt(index: number, nextId: string) {
    const current = slots[index]
    if (!current || current.componentId === nextId) return
    const next = cloneSlots(slots)
    next[index] = {
      ...next[index],
      componentId: nextId,
      texts: {},
      images: {},
    }
    commit(next)
  }

  function removeAt(index: number) {
    const removed = slots[index]
    if (!removed) return
    const next = slots.filter((_, itemIndex) => itemIndex !== index)
    commit(next)
    if (activeKey === removed.key) setActiveKey(null)
  }

  function moveAt(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= slots.length) return
    const next = cloneSlots(slots)
    ;[next[index], next[target]] = [next[target], next[index]]
    commit(next)
  }

  const { dragIndex, getItemProps } = useSortableList({
    items: slots,
    onReorder: (next) => setSlots(next),
    onReorderCommit: (previous, next) => {
      setHistory((current) => [
        ...current,
        { previous: cloneSlots(previous), next: cloneSlots(next) },
      ])
    },
  })

  function undo() {
    setHistory((current) => {
      if (!current.length) return current
      const entry = current[current.length - 1]
      setSlots(cloneSlots(entry.previous))
      return current.slice(0, -1)
    })
  }

  function reset() {
    setSlots(buildInitialSlots(originalIds))
    setHistory([])
    setActiveKey(null)
    setExportMessage(null)
  }

  async function copyExport(kind: 'code' | 'prompt') {
    setExportStatus('loading')
    setExportMessage(null)
    try {
      const result = await exportTemplatePage({ recipe, slots })
      const value = kind === 'code' ? result.document : result.prompt
      await navigator.clipboard.writeText(value)
      setExportStatus('idle')
      setExportMessage(kind === 'code' ? 'Código copiado' : 'Prompt IA copiado')
      window.setTimeout(() => setExportMessage(null), 2200)
    } catch {
      setExportStatus('error')
      setExportMessage('Falha ao gerar. Tente de novo.')
    }
  }

  async function downloadExport() {
    setExportStatus('loading')
    setExportMessage(null)
    try {
      const result = await exportTemplatePage({ recipe, slots })
      const blob = new Blob([result.prompt], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `template-${recipe.id}.md`
      link.click()
      URL.revokeObjectURL(url)
      setExportStatus('idle')
      setExportMessage('Download pronto')
      window.setTimeout(() => setExportMessage(null), 2200)
    } catch {
      setExportStatus('error')
      setExportMessage('Falha ao gerar. Tente de novo.')
    }
  }

  const activeIndex = activeKey === null ? -1 : slots.findIndex((slot) => slot.key === activeKey)
  const activeSlot = activeIndex >= 0 ? slots[activeIndex] : null
  const activeComponent = activeSlot ? componentsById.get(activeSlot.componentId) : null
  const alternatives = activeSlot ? alternativesFor(activeSlot.componentId) : []
  const stepId = activeSlot ? stepIdForComponent(activeSlot.componentId) : null
  const contentFields = getEditableFields(activeComponent ?? undefined)
  const imageSlots = imageSlotsFor(activeComponent ?? undefined)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-200 text-slate-900">
      <header className="relative z-40 flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950 px-3 py-2 text-white shadow-lg sm:px-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Link to="/templates">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Sair
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight">{recipe.name}</p>
          <p className="truncate text-[11px] text-white/50">
            Personalize seções, estilos e exporte código ou prompt para IA
            {isDirty ? ` · ${history.length || '—'} alteração(ões)` : ''}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-white/80 hover:bg-white/10 hover:text-white"
          onClick={() => setShowNavigator((value) => !value)}
        >
          <Layers className="mr-1.5 h-4 w-4" />
          Camadas
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-white/80 hover:bg-white/10 hover:text-white"
          onClick={undo}
          disabled={!history.length}
        >
          <Undo2 className="mr-1.5 h-4 w-4" />
          Desfazer
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-white/80 hover:bg-white/10 hover:text-white"
          onClick={reset}
          disabled={!isDirty}
        >
          <RefreshCcw className="mr-1.5 h-4 w-4" />
          Restaurar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-white/20 bg-transparent text-white hover:bg-white/10"
          disabled={exportStatus === 'loading' || !slots.length}
          onClick={() => copyExport('code')}
        >
          {exportStatus === 'loading' ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <FileCode2 className="mr-1.5 h-4 w-4" />
          )}
          Copiar código
        </Button>
        <Button
          type="button"
          size="sm"
          className="bg-violet-600 text-white hover:bg-violet-500"
          disabled={exportStatus === 'loading' || !slots.length}
          onClick={() => copyExport('prompt')}
        >
          {exportStatus === 'loading' ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-1.5 h-4 w-4" />
          )}
          Prompt IA
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-white/80 hover:bg-white/10 hover:text-white"
          disabled={exportStatus === 'loading' || !slots.length}
          onClick={downloadExport}
          aria-label="Baixar markdown"
          title="Baixar .md"
        >
          <Download className="h-4 w-4" />
        </Button>
      </header>

      {exportMessage ? (
        <div
          className={cn(
            'z-40 px-4 py-1.5 text-center text-xs font-medium',
            exportStatus === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white',
          )}
        >
          {exportMessage}
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-auto" onClick={() => setActiveKey(null)}>
          <div
            className="mx-auto min-h-full w-full max-w-6xl bg-background text-foreground shadow-2xl"
            style={palette ? (paletteToCssVars(palette) as CSSProperties) : undefined}
          >
            {palette ? (
              <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/60 px-4 py-2 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Tema da marca</span>
                <span
                  className="inline-flex h-4 w-4 rounded-full border border-border bg-primary"
                  title={`Primária ${palette.primary}`}
                />
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                  Botão
                </span>
                <span className="text-muted-foreground">{palette.label}</span>
                <button
                  type="button"
                  className="ml-auto text-primary underline"
                  onClick={(event) => {
                    event.stopPropagation()
                    setPalette(null)
                  }}
                >
                  Remover tema
                </button>
              </div>
            ) : null}
            {!slots.length ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="text-sm text-slate-500">
                  Nenhuma seção. Restaure o original para continuar.
                </p>
                <Button type="button" size="sm" variant="outline" onClick={reset}>
                  Restaurar original
                </Button>
              </div>
            ) : (
              slots.map((slot) => {
                const component = componentsById.get(slot.componentId)
                const active = activeKey === slot.key
                const hovered = hoveredKey === slot.key
                const highlight = active || hovered

                return (
                  <div
                    key={slot.key}
                    role="button"
                    tabIndex={0}
                    aria-label={`Editar ${component?.name ?? slot.componentId}`}
                    aria-pressed={active}
                    className={cn('relative outline-none transition', highlight && 'z-10')}
                    onMouseEnter={() => setHoveredKey(slot.key)}
                    onMouseLeave={() =>
                      setHoveredKey((current) => (current === slot.key ? null : current))
                    }
                    onClick={(event) => {
                      event.stopPropagation()
                      setActiveKey(slot.key)
                      setPanelTab('conteudo')
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setActiveKey(slot.key)
                      }
                    }}
                  >
                    <StyledSlotCanvas slot={slot} footer={<SlotCustomizationHints slot={slot} />} />

                    <div
                      className={cn(
                        'pointer-events-none absolute inset-0 border-2 transition',
                        active
                          ? 'border-violet-500 bg-violet-500/[0.04]'
                          : hovered
                            ? 'border-violet-400/80 bg-violet-500/[0.03]'
                            : 'border-transparent',
                      )}
                    />

                    {highlight ? (
                      <div className="pointer-events-none absolute left-0 top-0 z-20 flex max-w-[min(100%,22rem)] items-center gap-1.5 bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                        <Replace className="h-3 w-3 shrink-0 opacity-90" />
                        <span className="truncate">{component?.name ?? slot.componentId}</span>
                        {hasTextCustomizations(slot.texts) ? (
                          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">
                            texto
                          </span>
                        ) : null}
                        {hasStyleCustomizations(slot.style) ? (
                          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">
                            estilo
                          </span>
                        ) : null}
                        {hasImageCustomizations(slot.images) ? (
                          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">img</span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {showNavigator ? (
          <aside className="absolute bottom-4 left-3 top-4 z-30 flex w-[min(100%,17.5rem)] flex-col overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/95 text-white shadow-2xl backdrop-blur sm:left-4">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-violet-300" />
                <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  Camadas ({slots.length})
                </p>
              </div>
              <button
                type="button"
                className="rounded p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                onClick={() => setShowNavigator(false)}
                aria-label="Fechar camadas"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ol className="min-h-0 flex-1 space-y-1 overflow-auto p-2">
              {slots.map((slot, index) => {
                const component = componentsById.get(slot.componentId)
                const sortable = getItemProps(index)
                const dragging = dragIndex === index
                const active = activeKey === slot.key

                return (
                  <li
                    key={slot.key}
                    {...sortable}
                    className={cn(
                      'flex cursor-grab items-center gap-1 rounded-lg border border-transparent bg-white/5 px-1 py-1 transition active:cursor-grabbing',
                      active && 'border-violet-400/60 bg-violet-500/20',
                      dragging && 'opacity-60',
                    )}
                  >
                    <span className="px-1 text-white/40" aria-hidden>
                      <GripVertical className="h-3.5 w-3.5" />
                    </span>
                    <button
                      type="button"
                      className="min-w-0 flex-1 cursor-pointer rounded px-1 py-1 text-left"
                      onClick={(event) => {
                        event.stopPropagation()
                        setActiveKey(slot.key)
                      }}
                    >
                      <span className="block truncate text-xs font-medium">
                        {component?.name ?? slot.componentId}
                      </span>
                      <span className="block truncate font-mono text-[10px] text-white/40">
                        {slot.componentId}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 text-white/40 transition hover:bg-red-500/20 hover:text-red-300"
                      aria-label={`Excluir ${component?.name ?? slot.componentId}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        removeAt(index)
                      }}
                      onMouseDown={(event) => event.stopPropagation()}
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                )
              })}
            </ol>
          </aside>
        ) : null}

        {activeSlot && activeIndex >= 0 ? (
          <aside
            className="absolute bottom-4 right-3 top-4 z-30 flex w-[min(100%,26rem)] flex-col overflow-hidden rounded-xl border border-violet-500/40 bg-white shadow-2xl sm:right-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-2 border-b bg-violet-600 px-3 py-3 text-white">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-200">
                  {stepId ?? 'seção'}
                </p>
                <h2 className="truncate text-base font-bold leading-tight">
                  {activeComponent?.name ?? activeSlot.componentId}
                </h2>
                <p className="mt-0.5 truncate font-mono text-[11px] text-violet-100/80">
                  {activeSlot.componentId}
                </p>
              </div>
              <button
                type="button"
                className="rounded p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
                onClick={() => setActiveKey(null)}
                aria-label="Fechar painel"
              >
                <PanelRightClose className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 border-b bg-slate-50 p-1">
              {(
                [
                  ['conteudo', 'Conteúdo'],
                  ['estilo', 'Visual'],
                  ['imagens', 'Imagens'],
                  ['trocar', 'Trocar'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPanelTab(id)}
                  className={cn(
                    'rounded-md px-1.5 py-1.5 text-[11px] font-semibold transition sm:text-xs',
                    panelTab === id
                      ? 'bg-white text-violet-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border-b px-2 py-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 flex-1"
                disabled={activeIndex <= 0}
                onClick={() => moveAt(activeIndex, -1)}
              >
                <ArrowUp className="mr-1 h-3.5 w-3.5" />
                Subir
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 flex-1"
                disabled={activeIndex >= slots.length - 1}
                onClick={() => moveAt(activeIndex, 1)}
              >
                <ArrowDown className="mr-1 h-3.5 w-3.5" />
                Descer
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeAt(activeIndex)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-3">
              {panelTab === 'trocar' ? (
                <>
                  <p className="mb-1 text-xs font-semibold text-slate-700">Substituir este bloco</p>
                  <p className="mb-3 text-[11px] leading-4 text-slate-500">
                    Opções da mesma etapa do template
                    {alternatives.length ? ` · ${alternatives.length} disponíveis` : ''}.
                  </p>
                  {!alternatives.length ? (
                    <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-slate-500">
                      Não há outro componente equivalente nesta etapa.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {alternatives.map((option) => (
                        <li key={option.id}>
                          <button
                            type="button"
                            onClick={() => swapAt(activeIndex, option.id)}
                            className="flex w-full items-start gap-2 rounded-lg border bg-slate-50 px-2.5 py-2 text-left text-sm transition hover:border-violet-400 hover:bg-violet-50"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-slate-900">
                                {option.name}
                              </span>
                              <span className="mt-0.5 line-clamp-2 block text-[11px] text-slate-500">
                                {option.description}
                              </span>
                            </span>
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500 opacity-0" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : null}

              {panelTab === 'estilo' ? (
                <TemplateStylePanel
                  style={activeSlot.style}
                  onChange={patchStyle}
                  onClear={() => updateActiveLive((slot) => ({ ...slot, style: {} }))}
                />
              ) : null}

              {panelTab === 'imagens' ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Escolha um preset ou cole a URL. Cada campo abaixo troca uma foto do bloco na
                    prévia e na exportação.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.src}
                        type="button"
                        title={`Usar em Imagem 1: ${preset.label}`}
                        onClick={() => patchImage('image1', { src: preset.src, alt: preset.label })}
                        className="overflow-hidden rounded-md border transition hover:ring-2 hover:ring-violet-400"
                      >
                        <img
                          src={preset.src}
                          alt={preset.label}
                          className="h-14 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                  {imageSlots.map((field) => {
                    const current = activeSlot.images[field.key]
                    return (
                      <div key={field.key} className="rounded-lg border bg-slate-50 p-2.5">
                        <div className="mb-1.5 flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5 text-violet-600" />
                          <p className="text-[11px] font-semibold text-slate-700">{field.label}</p>
                        </div>
                        <p className="mb-2 text-[10px] text-slate-500">{field.hint}</p>
                        <input
                          type="url"
                          placeholder="https://.../foto.jpg"
                          value={current?.src ?? ''}
                          onChange={(event) => patchImage(field.key, { src: event.target.value })}
                          className="mb-2 w-full rounded-md border bg-white px-2.5 py-2 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Texto alternativo (alt)"
                          value={current?.alt ?? ''}
                          onChange={(event) =>
                            patchImage(field.key, {
                              src: current?.src ?? '',
                              alt: event.target.value,
                            })
                          }
                          className="w-full rounded-md border bg-white px-2.5 py-2 text-sm"
                        />
                        {current?.src ? (
                          <div className="mt-2 overflow-hidden rounded-md border">
                            <img
                              src={current.src}
                              alt={current.alt || field.label}
                              className="h-24 w-full object-cover"
                              onError={(event) => {
                                ;(event.currentTarget as HTMLImageElement).style.opacity = '0.3'
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => updateActiveLive((slot) => ({ ...slot, images: {} }))}
                  >
                    Limpar imagens
                  </Button>
                </div>
              ) : null}

              {panelTab === 'conteudo' ? (
                <TemplateContentPanel
                  fields={contentFields}
                  texts={activeSlot.texts}
                  onChange={patchText}
                  onClear={() => updateActiveLive((slot) => ({ ...slot, texts: {} }))}
                />
              ) : null}
            </div>

            <div className="border-t bg-slate-50 px-3 py-2">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                <Wand2 className="h-3.5 w-3.5" />
                Exporte o resultado final pela barra superior
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={exportStatus === 'loading'}
                  onClick={() => copyExport('code')}
                >
                  <FileCode2 className="mr-1 h-3.5 w-3.5" />
                  Código
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-violet-600 hover:bg-violet-500"
                  disabled={exportStatus === 'loading'}
                  onClick={() => copyExport('prompt')}
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  Prompt IA
                </Button>
              </div>
            </div>
          </aside>
        ) : (
          <div className="pointer-events-none absolute bottom-6 right-4 z-20 hidden rounded-full bg-slate-950/80 px-3 py-1.5 text-xs text-white/80 shadow-lg sm:block">
            Clique numa seção · Conteúdo · Visual · Imagens
          </div>
        )}
      </div>
    </div>
  )
}
