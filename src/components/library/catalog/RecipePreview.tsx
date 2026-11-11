import { cn } from '@/lib/utils'
import { ComponentPreview } from './ComponentPreview'
import { PreviewDialog } from './PreviewDialog'
import { normalizeRecipeComponents, type LayoutRecipe } from './layoutRecipes'

/** Quantos blocos entram no thumbnail (navbar → hero → conteúdo). */
const THUMBNAIL_SECTIONS = 4

/** Flutuantes escapam do layout do dialog se renderizados “ao vivo”. */
const FLOATING_PREVIEW_IDS = new Set([
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

function RecipeSectionPreview({ id, dense = false }: { id: string; dense?: boolean }) {
  if (FLOATING_PREVIEW_IDS.has(id)) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed bg-muted/30 px-4 py-3 text-sm">
        <div>
          <p className="font-medium">Elemento flutuante</p>
          <p className="text-xs text-muted-foreground">
            Aparece fixo na página real (não no preview empilhado).
          </p>
        </div>
        <code className="rounded bg-background px-2 py-1 font-mono text-[11px]">{id}</code>
      </div>
    )
  }

  return (
    <div className={cn('relative isolate overflow-hidden', dense && 'max-h-none')}>
      <ComponentPreview id={id} />
    </div>
  )
}

export function RecipePreviewStack({
  components,
  className,
  dense = false,
}: {
  components: readonly string[]
  className?: string
  /** Menos padding entre seções (útil no dialog). */
  dense?: boolean
}) {
  const sections = normalizeRecipeComponents(components)

  return (
    <div className={cn('space-y-4', dense && 'space-y-2', className)}>
      {sections.map((id) => (
        <div key={id} className="overflow-hidden rounded-lg border bg-white">
          <p className="border-b bg-muted/40 px-3 py-1 font-mono text-[10px] text-muted-foreground">
            {id}
          </p>
          <div className={cn('preview-light p-3 md:p-5', dense && 'p-2 md:p-3')}>
            <RecipeSectionPreview id={id} dense={dense} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Miniatura escalada da página montada pelo template. */
export function RecipePreviewThumbnail({
  components,
  className,
}: {
  components: readonly string[]
  className?: string
}) {
  const normalized = normalizeRecipeComponents(components).filter(
    (id) => !FLOATING_PREVIEW_IDS.has(id),
  )
  const sections = normalized.slice(0, THUMBNAIL_SECTIONS)

  return (
    <div
      className={cn('relative h-44 min-w-0 overflow-hidden border-b bg-muted/20', className)}
      aria-hidden="true"
    >
      <div className="preview-light pointer-events-none absolute left-0 top-0 w-[280%] origin-top-left scale-[0.357] bg-white">
        <div className="space-y-3 p-4">
          {sections.map((id) => (
            <div key={id} className="overflow-hidden rounded-md border bg-white shadow-sm">
              <ComponentPreview id={id} />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card via-card/80 to-transparent" />
      {normalized.length > THUMBNAIL_SECTIONS ? (
        <span className="absolute bottom-2 right-2 rounded-full border bg-background/95 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
          +{normalized.length - THUMBNAIL_SECTIONS} seções
        </span>
      ) : null}
    </div>
  )
}

export function RecipePreviewDialog({ recipe }: { recipe: LayoutRecipe }) {
  const components = normalizeRecipeComponents(recipe.components)

  return (
    <PreviewDialog
      title={`Preview · ${recipe.name}`}
      description={`${components.length} seções na ordem do template. Interaja normalmente com cada bloco.`}
      triggerLabel="Preview"
    >
      <div className="p-4 md:p-8">
        <p className="mb-4 text-sm text-muted-foreground">{recipe.description}</p>
        <RecipePreviewStack components={components} />
      </div>
    </PreviewDialog>
  )
}
