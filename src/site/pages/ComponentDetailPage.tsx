import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { buildComponentAiPrompt } from '@/components/library/catalog/buildComponentPrompt'
import { CodeDialog } from '@/components/library/catalog/CodeDialog'
import { ComponentIdChip } from '@/components/library/catalog/ComponentIdChip'
import { ComponentPreview } from '@/components/library/catalog/ComponentPreview'
import { CopyButton } from '@/components/library/catalog/CopyButton'
import { categoryLabels, componentManifest } from '@/components/library/catalog/manifest'
import { getInstallCommand } from '@/lib/siteConfig'
import { usePageTitle } from '../usePageTitle'

export function ComponentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const component = componentManifest.find((item) => item.id === id)

  usePageTitle(component ? component.name : 'Componente')

  if (!component) {
    return <Navigate to="/componentes" replace />
  }

  const importSnippet = `import { ${component.name} } from '${component.importPath}'`
  const installCommand = getInstallCommand(component.id)
  const aiPrompt = buildComponentAiPrompt(component)

  return (
    <main id="conteudo">
      <section className="border-b bg-slate-950 text-white">
        <div className="container py-10 md:py-14">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 mb-4 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Link to="/componentes">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar ao catálogo
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80">
              {categoryLabels[component.category]}
            </span>
            {component.client ? (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                client
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{component.name}</h1>
          <div className="mt-3">
            <ComponentIdChip id={component.id} />
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            {component.description}
          </p>
        </div>
      </section>

      <section className="border-b py-8 md:py-10">
        <div className="container grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b px-4 py-2.5 text-sm font-medium">Preview</div>
            <div className="preview-light bg-white p-4 md:p-8">
              <ComponentPreview id={component.id} />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-medium">Prompt para IA</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Cole no ChatGPT, Cursor ou outra IA para instalar e usar o componente.
              </p>
              <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">
                <code>{aiPrompt}</code>
              </pre>
              <div className="mt-3 flex flex-wrap gap-2">
                <CopyButton value={aiPrompt} label="Prompt IA" icon="sparkles" />
                <CodeDialog
                  title={`Código de ${component.name}`}
                  code={`${installCommand}\n\n${importSnippet}\n\n${component.example}`}
                  triggerLabel="Ver código"
                />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-medium">Import</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs leading-5">
                <code>{importSnippet}</code>
              </pre>
              <div className="mt-3">
                <CopyButton value={`${importSnippet}\n\n${component.example}`} />
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-medium">Tags</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {component.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to="/montar-pagina"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                Usar no montador de páginas
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
