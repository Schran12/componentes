import { Link } from 'react-router-dom'
import { getInstallCommand } from '@/lib/siteConfig'
import { buildComponentAiPrompt } from './buildComponentPrompt'
import { CodeDialog } from './CodeDialog'
import { ComponentIdChip } from './ComponentIdChip'
import { ComponentPreview } from './ComponentPreview'
import { CopyButton } from './CopyButton'
import { PreviewDialog } from './PreviewDialog'
import { categoryLabels, type CatalogComponent } from './manifest'

export function ComponentCard({ component }: { component: CatalogComponent }) {
  const importSnippet = `import { ${component.name} } from '${component.importPath}'`
  const installCommand = getInstallCommand(component.id)
  const aiPrompt = buildComponentAiPrompt(component)

  return (
    <article
      id={component.id}
      className="group flex h-full min-w-0 scroll-mt-40 flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
    >
      <div className="relative h-52 min-w-0 overflow-hidden border-b bg-white">
        <div
          className="preview-light pointer-events-none absolute left-0 top-0 flex h-[624px] w-[300%] origin-top-left scale-[0.333333] flex-col overflow-hidden p-8"
          aria-hidden="true"
        >
          <div className="my-auto w-full">
            <ComponentPreview id={component.id} />
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3.5">
        <div className="min-w-0">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <h2 className="break-words text-base font-semibold tracking-tight">
                  <Link
                    to={`/componentes/${component.id}`}
                    className="transition hover:text-primary"
                  >
                    {component.name}
                  </Link>
                </h2>
                {component.client ? (
                  <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                    client
                  </span>
                ) : null}
              </div>
              <ComponentIdChip id={component.id} />
            </div>
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
              {categoryLabels[component.category]}
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 break-words text-sm leading-5 text-muted-foreground">
            {component.description}
          </p>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1">
          {component.tags.slice(0, 3).map((tag) => (
            <span
              className="max-w-full truncate rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          <CopyButton value={aiPrompt} label="Prompt IA" icon="sparkles" />
        </div>

        <div className="mt-auto grid grid-cols-[repeat(2,minmax(0,1fr))_auto] items-center gap-1 pt-2 [&>button:not(:last-child)_svg]:mr-1 [&>button]:px-1.5">
          <PreviewDialog title={`Preview de ${component.name}`} triggerLabel="Abrir">
            <div className="p-4 md:p-8">
              <ComponentPreview id={component.id} />
            </div>
          </PreviewDialog>
          <CodeDialog
            title={`Código de ${component.name}`}
            code={`// ${installCommand}\n\n${importSnippet}\n\n${component.example}`}
            triggerLabel="Código"
          />
          <CopyButton value={`${importSnippet}\n\n${component.example}`} iconOnly />
        </div>
      </div>
    </article>
  )
}
