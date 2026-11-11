import { CheckCircle2, KeyRound, Package, RefreshCw, Terminal, Wrench } from 'lucide-react'

import {
  FAQAccordion,
  FeatureGrid,
  PageHeader,
  ProcessSteps,
  componentManifest,
} from '@/components/library'
import { CodeDialog } from '@/components/library/catalog/CodeDialog'
import { layoutRecipes } from '@/components/library/catalog/layoutRecipes'
import { DownloadSourceButton } from '@/components/library/catalog/DownloadSourceButton'
import {
  getApiConfigJson,
  getInstallCommand,
  getMirrorCommand,
  getRecipeInstallCommand,
  getRegistryUrl,
  getSyncCommand,
  getWatchCommand,
  OFFICIAL_API_KEY,
} from '@/lib/siteConfig'
import { usePageTitle } from '../usePageTitle'

const usageCode = `import { FeatureGrid } from '@/components/library/data-display/FeatureGrid'
import { Sparkles } from 'lucide-react'

export default function Page() {
  return (
    <FeatureGrid
      title="Recursos"
      features={[
        {
          title: 'Modular',
          description: 'Código instalado diretamente no projeto.',
          icon: Sparkles,
        },
      ]}
    />
  )
}`

function CommandCard({
  title,
  description,
  command,
}: {
  title: string
  description: string
  command: string
}) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b p-5">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <CodeDialog title={title} code={command} triggerLabel="Copiar" />
      </div>
      <pre className="overflow-x-auto bg-slate-950 p-5 text-sm leading-7 text-slate-100">
        <code>{command}</code>
      </pre>
    </article>
  )
}

export function InstallationGuidePage() {
  usePageTitle('Como instalar')
  const registryUrl = getRegistryUrl()
  const configJson = getApiConfigJson()
  const mirrorCommand = getMirrorCommand()
  const watchCommand = getWatchCommand()
  const syncCommand = getSyncCommand()
  const singleCommand = getInstallCommand('feature-grid')
  const recipeCommand = getRecipeInstallCommand('industrial')

  return (
    <main>
      <PageHeader
        eyebrow="Como instalar"
        title="Cole a API key e espelhe a biblioteca no seu projeto."
        description="Sem login. Crie o arquivo com a key, rode um comando e os componentes passam a atualizar sozinhos quando o catálogo mudar."
        breadcrumbs={[{ label: 'Componentes', href: '/componentes' }, { label: 'Como instalar' }]}
      />

      <section className="border-b py-12 md:py-16">
        <div className="container grid gap-4 sm:grid-cols-3">
          {[
            [String(componentManifest.length), 'componentes', 'Disponíveis via API / CLI'],
            [String(layoutRecipes.length), 'templates', 'Receitas prontas para instalar'],
            ['API key', 'sem login', 'Só colar no JSON do projeto'],
          ].map(([value, label, detail]) => (
            <div className="rounded-2xl border bg-card p-5" key={label}>
              <p className="text-3xl font-bold tracking-tight text-primary">{value}</p>
              <p className="mt-1 font-semibold">{label}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <ProcessSteps
        title="Fluxo recomendado (API + mirror)"
        steps={[
          {
            title: 'Cole a key',
            description:
              'Crie componentes-bloomin.json na raiz do seu Next.js com registry, apiKey e syncMode.',
          },
          {
            title: 'Espelhe',
            description:
              'Rode npx componentes-bloomin mirror — baixa a biblioteca completa e aplica o tema.',
          },
          {
            title: 'Atualize sozinho',
            description:
              'Deixe o watch rodando. Componente novo no catálogo entra no seu projeto automaticamente.',
          },
          {
            title: 'Use no código',
            description: 'Importe de @/components/library/... e personalize por props.',
          },
        ]}
      />

      <section className="border-b py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">API</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              1. Arquivo com a key
            </h2>
            <p className="mt-3 text-muted-foreground">
              Na raiz do projeto (ao lado do <code>package.json</code>), crie{' '}
              <code>componentes-bloomin.json</code>:
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CommandCard
              title="componentes-bloomin.json"
              description="Cole este JSON no seu projeto. A key autentica a API."
              command={configJson}
            />
            <div className="space-y-4 rounded-2xl border bg-card p-6">
              <h3 className="font-semibold">Credenciais</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Catálogo / API</dt>
                  <dd className="mt-1 break-all font-mono text-xs">{registryUrl}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">API key</dt>
                  <dd className="mt-1 break-all font-mono text-xs">{OFFICIAL_API_KEY}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Feed autenticado</dt>
                  <dd className="mt-1 break-all font-mono text-xs">{registryUrl}/api/v1/feed</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Item</dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    {registryUrl}/api/v1/item/:name
                  </dd>
                </div>
              </dl>
              <p className="text-xs leading-5 text-muted-foreground">
                Header: <code>Authorization: Bearer &lt;apiKey&gt;</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">CLI</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              2. Espelhar e manter atualizado
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <CommandCard
              title="Mirror (recomendado)"
              description="Tema + biblioteca completa + watch contínuo. Sem login."
              command={mirrorCommand}
            />
            <CommandCard
              title="Só watch"
              description="Se já espelhou antes: continua puxando atualizações."
              command={watchCommand}
            />
            <CommandCard
              title="Sync sob demanda / CI"
              description="Atualiza agora e encerra (útil no GitHub Actions)."
              command={syncCommand}
            />
            <CommandCard
              title="Use no código"
              description="Importe o componente instalado em src/components/library."
              command={usageCode}
            />
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Alternativas
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Instalar um pedaço ou baixar ZIP
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <CommandCard
              title="Template (recipe)"
              description="Instala um conjunto de seções. Troque o ID da receita."
              command={recipeCommand}
            />
            <CommandCard
              title="Componente avulso"
              description="Troque feature-grid pelo ID do card no catálogo."
              command={singleCommand}
            />
          </div>

          <div className="mt-10 rounded-2xl border bg-background p-6">
            <h3 className="text-lg font-semibold tracking-tight">Sem CLI? Baixe o ZIP</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Use <strong>Baixar ZIP</strong> nos templates ou no montador. O pacote traz os
              caminhos prontos para colar em <code>src/</code>.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <DownloadSourceButton
                itemId="recipe-industrial-services"
                label="Exemplo: template tratamento.zip"
              />
            </div>
          </div>
        </div>
      </section>

      <FeatureGrid
        title="Por que esse fluxo"
        features={[
          {
            title: 'API com key',
            description: 'O projeto autentica em /api/v1/* sem comando de login.',
            icon: KeyRound,
          },
          {
            title: 'Mirror contínuo',
            description: 'Componente novo no catálogo atualiza o outro projeto sozinho.',
            icon: RefreshCw,
          },
          {
            title: 'Código no seu repo',
            description: 'Arquivos em src/components/library — editáveis e versionados.',
            icon: Wrench,
          },
          {
            title: 'CLI ou ZIP',
            description: 'Espelhe tudo, instale um ID, ou baixe o ZIP no navegador.',
            icon: Package,
          },
          {
            title: 'Um comando',
            description: 'npx componentes-bloomin mirror depois de colar o JSON.',
            icon: Terminal,
          },
          {
            title: 'Templates',
            description: 'Receitas institucionais, industriais, SaaS e landing.',
            icon: CheckCircle2,
          },
        ]}
      />

      <FAQAccordion
        title="Perguntas sobre instalação"
        items={[
          {
            question: 'Preciso fazer login?',
            answer:
              'Não. Basta colar a apiKey em componentes-bloomin.json e rodar o mirror. A key autentica a API.',
          },
          {
            question: 'Onde fica a API?',
            answer: `Em ${registryUrl}/api/v1 — feed, theme, item/:name e me. Use Authorization: Bearer <key>.`,
          },
          {
            question: 'Quando um componente novo aparece no meu projeto?',
            answer:
              'Com mirror/watch rodando (ou sync no CI), assim que o catálogo for publicado com o componente novo.',
          },
          {
            question: 'Posso instalar só um componente?',
            answer:
              'Sim: npx componentes-bloomin add <id> ou Baixar ZIP no card. Para espelhar tudo e atualizar sempre, use mirror.',
          },
          {
            question: 'O catálogo é Vite ou Next?',
            answer:
              'O site do catálogo roda em Vite. Os componentes instalados no seu projeto são para Next.js App Router + Tailwind 3.',
          },
        ]}
      />
    </main>
  )
}
