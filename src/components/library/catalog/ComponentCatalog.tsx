'use client'

import { Building2, ChevronLeft, ChevronRight, Factory, Search, Sparkles } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { catalogSearch, useCatalogSearch } from './catalogSearchStore'
import { ComponentCard } from './ComponentCard'
import { matchesSectionFilter, topicFilters, type SectionFilter } from './catalogFilters'
import { componentSearchScore, normalizeSearch } from './catalogSearch'
import { featuredRecipeIds, layoutRecipes } from './layoutRecipes'
import { componentManifest } from './manifest'
import { RecipePreviewDialog, RecipePreviewThumbnail } from './RecipePreview'

const catalogComponents = componentManifest
const componentsPerPage = 12
const mobileTopicLimit = 7

export function ComponentCatalog() {
  const query = useCatalogSearch()
  const deferredQuery = useDeferredValue(query)
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>('all')
  const [showAllTopics, setShowAllTopics] = useState(false)
  const [page, setPage] = useState(1)
  const hadQuery = useRef(Boolean(query))

  useEffect(() => {
    setPage(1)
    if (query && !hadQuery.current) {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    hadQuery.current = Boolean(query)
  }, [query])

  const searchMatches = useMemo(() => {
    const tokens = normalizeSearch(deferredQuery).split(/\s+/).filter(Boolean)
    return catalogComponents
      .map((component, index) => ({
        component,
        index,
        score: componentSearchScore(component, tokens),
      }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map(({ component }) => component)
  }, [deferredQuery])

  const filtered = useMemo(
    () => searchMatches.filter((component) => matchesSectionFilter(component, sectionFilter)),
    [searchMatches, sectionFilter],
  )

  const topicCounts = useMemo(
    () =>
      Object.fromEntries(
        topicFilters.map((topic) => [
          topic.id,
          searchMatches.filter((component) => matchesSectionFilter(component, topic.id)).length,
        ]),
      ),
    [searchMatches],
  )

  function selectTopic(id: SectionFilter) {
    setSectionFilter(id)
    setPage(1)
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / componentsPerPage))
  const currentPage = Math.min(page, pageCount)
  const visibleComponents = filtered.slice(
    (currentPage - 1) * componentsPerPage,
    currentPage * componentsPerPage,
  )

  function changePage(nextPage: number) {
    setPage(Math.min(Math.max(nextPage, 1), pageCount))
    document.getElementById('catalogo')?.scrollIntoView({ block: 'start' })
  }

  return (
    <main id="conteudo">
      <section className="relative overflow-hidden border-b bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,hsl(var(--primary)/.38),transparent_35%),radial-gradient(circle_at_90%_80%,hsl(var(--primary)/.2),transparent_30%)]" />
        <div className="container relative py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Catálogo vivo
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            Componentes para construir com consistência.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-7 text-white/70">
            {catalogComponents.length} componentes e templates prontos para preview e montagem de
            páginas. Para espelhar via API key (sem login), veja{' '}
            <Link to="/como-utilizar" className="text-white underline underline-offset-4">
              Como instalar
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="container grid gap-8 py-10 md:py-14 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav
            aria-label="Tópicos do catálogo"
            className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 [scrollbar-width:thin]"
          >
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tópicos
            </p>
            <ul className="mt-2 space-y-0.5">
              {topicFilters.map((item) => {
                const active = sectionFilter === item.id
                const count = topicCounts[item.id] ?? 0
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => selectTopic(item.id)}
                      aria-pressed={active}
                      disabled={!count && !active}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40',
                        active
                          ? 'bg-primary font-medium text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <span className="truncate">{item.label}</span>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-1.5 text-[11px] tabular-nums',
                          active ? 'bg-primary-foreground/20' : 'bg-muted',
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        <section id="catalogo" className="min-w-0 scroll-mt-24" aria-label="Componentes">
          <div className="mb-4 flex flex-wrap items-center gap-1.5 lg:hidden">
            <span className="mr-1 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tópicos:
            </span>
            {topicFilters.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => selectTopic(item.id)}
                aria-pressed={sectionFilter === item.id}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition',
                  sectionFilter === item.id
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                  !showAllTopics &&
                    index >= mobileTopicLimit &&
                    sectionFilter !== item.id &&
                    'max-sm:hidden',
                )}
              >
                {item.label}
              </button>
            ))}
            {topicFilters.length > mobileTopicLimit ? (
              <button
                type="button"
                onClick={() => setShowAllTopics((value) => !value)}
                aria-expanded={showAllTopics}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10 sm:hidden"
              >
                {showAllTopics
                  ? 'Menos tópicos'
                  : `+${topicFilters.length - mobileTopicLimit} tópicos`}
              </button>
            ) : null}
          </div>
          <p aria-live="polite" className="mb-4 text-sm text-muted-foreground">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'componente encontrado' : 'componentes encontrados'}
            {query ? ` para “${query}”` : ''}
            {filtered.length > componentsPerPage ? ` · página ${currentPage} de ${pageCount}` : ''}
          </p>
          {filtered.length ? (
            <>
              <div className="grid min-w-0 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleComponents.map((component) => (
                  <ComponentCard component={component} key={component.id} />
                ))}
              </div>

              {pageCount > 1 ? (
                <nav
                  className="mt-10 flex flex-wrap items-center justify-center gap-2"
                  aria-label="Paginação do catálogo"
                >
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                    <Button
                      type="button"
                      size="sm"
                      variant={currentPage === pageNumber ? 'default' : 'outline'}
                      onClick={() => changePage(pageNumber)}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                      aria-label={`Página ${pageNumber}`}
                      key={pageNumber}
                      className="min-w-9"
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                    aria-label="Próxima página"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              ) : null}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed py-24 text-center">
              <Search className="mx-auto h-8 w-8 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Nenhum componente encontrado</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajuste a busca ou remova um filtro.
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={() => {
                  catalogSearch.set('')
                  setSectionFilter('all')
                  setPage(1)
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </section>
      </div>

      <section id="templates" className="border-b border-t" aria-labelledby="titulo-templates">
        <div className="container py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Comece rápido
              </span>
              <h2 id="titulo-templates" className="mt-3 text-3xl font-bold tracking-tight">
                Templates prontos
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Abra no montador de páginas ou baixe o ZIP do template.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link to="/templates">Ver todos</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {layoutRecipes
              .filter((recipe) =>
                featuredRecipeIds.includes(recipe.id as (typeof featuredRecipeIds)[number]),
              )
              .slice(0, 4)
              .map((recipe) => {
                const Icon = recipe.id.startsWith('industrial') ? Factory : Building2
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
                        <h3 className="font-semibold">{recipe.name}</h3>
                      </div>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">
                        {recipe.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button asChild size="sm">
                          <Link to={`/montar-pagina?recipe=${recipe.id}`}>Usar no montador</Link>
                        </Button>
                        <RecipePreviewDialog recipe={recipe} />
                      </div>
                    </div>
                  </article>
                )
              })}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/templates">Ver todos os {layoutRecipes.length} templates</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="container flex justify-end py-8 text-sm text-muted-foreground">
          <a className="font-medium text-foreground hover:text-primary" href="#conteudo">
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
    </main>
  )
}
