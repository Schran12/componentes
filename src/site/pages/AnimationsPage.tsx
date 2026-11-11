import { RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CodeDialog } from '@/components/library/catalog/CodeDialog'
import { ComponentIdChip } from '@/components/library/catalog/ComponentIdChip'
import { ComponentPreview } from '@/components/library/catalog/ComponentPreview'
import { CopyButton } from '@/components/library/catalog/CopyButton'
import { PreviewDialog } from '@/components/library/catalog/PreviewDialog'
import { PropsDialog } from '@/components/library/catalog/PropsDialog'
import { componentManifest, type CatalogComponent } from '@/components/library/catalog/manifest'
import { cn } from '@/lib/utils'
import { usePageTitle } from '../usePageTitle'

type Engine = 'gsap' | 'framer' | 'libraries' | 'css'

const engines: { id: Engine | 'all'; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'gsap', label: 'GSAP' },
  { id: 'framer', label: 'Framer Motion' },
  { id: 'libraries', label: 'Swiper, Lenis e AutoAnimate' },
  { id: 'css', label: 'CSS e React' },
]

function engineOf({ dependencies }: CatalogComponent): Engine {
  if (
    dependencies.some((dependency) => dependency.includes('gsap') || dependency.includes('useGSAP'))
  )
    return 'gsap'
  if (dependencies.includes('framer-motion')) return 'framer'
  if (dependencies.some((dependency) => /swiper|lenis|auto-animate/.test(dependency)))
    return 'libraries'
  return 'css'
}

const animations = componentManifest
  .filter((component) => component.category === 'motion')
  .map((component) => ({ component, engine: engineOf(component) }))

function AnimationCard({ component, engine }: { component: CatalogComponent; engine: Engine }) {
  const [run, setRun] = useState(0)
  const importSnippet = `import { ${component.name} } from '${component.importPath}'`

  return (
    <article
      id={component.id}
      className="flex min-w-0 scroll-mt-24 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      <div className="relative h-80 overflow-hidden border-b bg-white">
        <div className="preview-light flex h-full items-center overflow-y-auto overflow-x-hidden p-6 [scrollbar-width:thin]">
          <div className="w-full" key={run}>
            <ComponentPreview id={component.id} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border bg-background/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Repetir
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight">{component.name}</h2>
            <ComponentIdChip id={component.id} />
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
            {engines.find(({ id }) => id === engine)?.label}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{component.description}</p>

        <div className="mt-auto grid grid-cols-[repeat(3,minmax(0,1fr))_auto] items-center gap-1 pt-4 [&>button:not(:last-child)_svg]:mr-1 [&>button]:px-1.5">
          <PreviewDialog title={`Preview de ${component.name}`} triggerLabel="Abrir">
            <div className="p-4 md:p-8">
              <ComponentPreview id={component.id} />
            </div>
          </PreviewDialog>
          <CodeDialog
            title={`Código de ${component.name}`}
            code={`// Instalação: componentes-bloomin add ${component.id}\n\n${importSnippet}\n\n${component.example}`}
            triggerLabel="Código"
          />
          <PropsDialog
            title={`Props e variantes de ${component.name}`}
            props={component.props}
            variants={component.variants}
          />
          <CopyButton value={`componentes-bloomin add ${component.id}`} iconOnly />
        </div>
      </div>
    </article>
  )
}

export function AnimationsPage() {
  usePageTitle('Animações')
  const [engine, setEngine] = useState<Engine | 'all'>('all')

  const counts = useMemo(
    () =>
      Object.fromEntries(
        engines.map(({ id }) => [
          id,
          id === 'all' ? animations.length : animations.filter((item) => item.engine === id).length,
        ]),
      ),
    [],
  )
  const visible =
    engine === 'all' ? animations : animations.filter((item) => item.engine === engine)

  return (
    <main>
      <section className="relative overflow-hidden border-b bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,hsl(var(--primary)/.4),transparent_35%),radial-gradient(circle_at_10%_90%,hsl(var(--primary)/.22),transparent_30%)]" />
        <div className="container relative py-20 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Animações
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Movimento pronto para usar.
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/70">
            {animations.length} animações com preview ao vivo. Todas respeitam a preferência de
            movimento reduzido do sistema.
          </p>
        </div>
      </section>

      <div className="container py-10 md:py-14">
        <div className="mb-8 flex flex-wrap gap-2" role="toolbar" aria-label="Filtrar por motor">
          {engines.map(({ id, label }) => (
            <button
              type="button"
              key={id}
              onClick={() => setEngine(id)}
              aria-pressed={engine === id}
              disabled={!counts[id]}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40',
                engine === id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              {label}
              <span className="text-xs tabular-nums opacity-70">{counts[id]}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {visible.map(({ component, engine: itemEngine }) => (
            <AnimationCard component={component} engine={itemEngine} key={component.id} />
          ))}
        </div>
      </div>
    </main>
  )
}
