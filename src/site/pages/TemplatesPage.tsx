import { Building2, Factory, LayoutTemplate, Rocket, ShoppingBag, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DownloadSourceButton } from '@/components/library/catalog/DownloadSourceButton'
import {
  RecipePreviewDialog,
  RecipePreviewThumbnail,
} from '@/components/library/catalog/RecipePreview'
import {
  layoutRecipeCategoryLabels,
  layoutRecipes,
  type LayoutRecipeCategory,
} from '@/components/library/catalog/layoutRecipes'
import { cn } from '@/lib/utils'
import { usePageTitle } from '../usePageTitle'

const categoryIcons: Record<LayoutRecipeCategory, typeof Building2> = {
  institutional: Building2,
  industrial: Factory,
  product: Rocket,
  commerce: ShoppingBag,
  creative: Sparkles,
  niche: LayoutTemplate,
}

export function TemplatesPage() {
  usePageTitle('Templates')
  const [category, setCategory] = useState<LayoutRecipeCategory | 'all'>('all')

  const categories = useMemo(
    () =>
      (Object.keys(layoutRecipeCategoryLabels) as LayoutRecipeCategory[]).filter((id) =>
        layoutRecipes.some((recipe) => recipe.category === id),
      ),
    [],
  )

  const filtered = useMemo(
    () =>
      category === 'all'
        ? layoutRecipes
        : layoutRecipes.filter((recipe) => recipe.category === category),
    [category],
  )

  return (
    <main id="conteudo">
      <section className="border-b bg-slate-950 text-white">
        <div className="container py-14 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
            <LayoutTemplate className="h-3.5 w-3.5" />
            Templates
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Templates prontos para montar a página.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-white/70">
            {layoutRecipes.length} receitas com seções do catálogo. Abra no montador, troque blocos
            e gere o código — sem editor visual.
          </p>
        </div>
      </section>

      <section className="border-b">
        <div className="container flex flex-wrap gap-2 py-4">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm transition',
              category === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            Todos ({layoutRecipes.length})
          </button>
          {categories.map((id) => {
            const count = layoutRecipes.filter((recipe) => recipe.category === id).length
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm transition',
                  category === id
                    ? 'bg-primary text-primary-foreground'
                    : 'border text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {layoutRecipeCategoryLabels[id]} ({count})
              </button>
            )
          })}
        </div>
      </section>

      <section className="container py-10 md:py-14">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((recipe) => {
            const Icon = categoryIcons[recipe.category]
            return (
              <article
                key={recipe.id}
                className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition hover:border-primary/30 hover:shadow-md"
              >
                <Link
                  to={`/montar-pagina?recipe=${recipe.id}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  aria-label={`Usar template ${recipe.name} no montador`}
                >
                  <RecipePreviewThumbnail components={recipe.components} />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-semibold tracking-tight">{recipe.name}</h2>
                      <p className="text-[11px] text-muted-foreground">
                        {layoutRecipeCategoryLabels[recipe.category]} · {recipe.components.length}{' '}
                        seções
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{recipe.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <Link to={`/montar-pagina?recipe=${recipe.id}`}>Usar no montador</Link>
                    </Button>
                    <RecipePreviewDialog recipe={recipe} />
                    <DownloadSourceButton
                      itemId={`recipe-${recipe.id}`}
                      label="ZIP"
                      variant="ghost"
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
