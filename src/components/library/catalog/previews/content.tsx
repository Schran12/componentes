import {
  AboutGallery,
  AboutMetricsSection,
  AboutStatsSplit,
  AboutValuesSection,
  AIAgentWorkspaceSection,
  ArticleLayout,
  AudienceSpotlightSection,
  AutomationToolkitSection,
  BentoGrid,
  CategoryMosaic,
  ComparisonTable,
  ConversationalWorkflowSection,
  CoverageCallout,
  CredibilitySection,
  DifferentialsSection,
  FeatureImageList,
  FloatingMediaArticle,
  GalleryGrid,
  GlobalMetricsSection,
  IconFeatureCards,
  IntegrationStackSection,
  InteractiveFeatureShowcase,
  InvestmentPlatformSection,
  KeyboardPerformanceSection,
  LightboxGallery,
  LocationShowcase,
  LogoCarouselBand,
  MapEmbedSection,
  MarqueeGallery,
  MediaSplit,
  MetricsBand,
  NumberedCardGrid,
  OfficeNetworkSection,
  PolaroidLineCarousel,
  ProblemSolutionCards,
  ProcessSteps,
  ResponsibilityFeatureSection,
  ServiceAreaCards,
  StatsGrid,
  Timeline,
  TransparencyMetricsSection,
  WorkspaceFeatureShowcase,
  HuelineColourStory,
  HuelineAtelier,
  HuelineStyleArches,
  HuelineLookbook,
  VeloriaOnboard,
  VeloriaVoyage,
  VeloriaDestinations,
  NimbusDemo,
  NimbusCapabilities,
  NimbusDeveloper,
  NimbusUseCases,
  FlickCards,
  LiquidGlassCarousel,
  RadialCards,
} from '@/components/library'
import {
  Armchair,
  BarChart3,
  CheckCircle2,
  Gauge,
  Headset,
  LayoutGrid,
  Package,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trees,
  Zap,
} from 'lucide-react'
import {
  BlogPostPreview,
  features,
  image,
  imageOne,
  imageThree,
  imageTwo,
  lorem,
  photos,
} from './shared'
import type { PreviewMap } from './types'

export const contentPreviews: PreviewMap = {
  'bento-grid': () => (
    <BentoGrid
      title="Capacidades integradas"
      description="Uma composição editorial para apresentar diferenciais."
      items={[
        {
          title: 'Estratégia',
          description: 'Prioridades orientadas por impacto.',
          icon: <Rocket className="h-7 w-7" />,
          size: 'wide',
        },
        {
          title: 'Dados',
          description: 'Decisões com contexto.',
          icon: <BarChart3 className="h-7 w-7" />,
        },
        {
          title: 'Produto',
          description: 'Experiências que evoluem.',
          icon: <Package className="h-7 w-7" />,
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'comparison-table': () => (
    <ComparisonTable
      caption="Compare os planos"
      description="Escolha a estrutura adequada para sua operação."
      columns={[
        { key: 'base', label: 'Base' },
        { key: 'pro', label: 'Pro', highlighted: true },
      ]}
      rows={[
        { label: 'Projetos', values: { base: '3', pro: 'Ilimitados' } },
        { label: 'Analytics', values: { base: false, pro: true } },
        { label: 'Suporte prioritário', values: { base: false, pro: true } },
      ]}
    />
  ),
  'gallery-grid': () => (
    <GalleryGrid
      columns={3}
      aspect="video"
      items={[
        { src: imageOne, alt: 'Estação de trabalho', title: 'Produto' },
        { src: imageTwo, alt: 'Equipe colaborando', title: 'Pessoas' },
        { src: imageThree, alt: 'Dashboard de dados', title: 'Resultados' },
      ]}
    />
  ),
  'media-split': () => (
    <MediaSplit
      eyebrow="Nossa abordagem"
      title="Tecnologia com propósito"
      description="Cada escolha equilibra experiência, operação e resultado."
      image={{ src: imageTwo, alt: 'Equipe reunida em uma mesa' }}
      action={{ label: 'Conhecer método', href: '#catalogo' }}
      className="!py-8 [&_.container]:!px-0"
    >
      <p className="text-sm text-muted-foreground">Descoberta, execução e melhoria contínua.</p>
    </MediaSplit>
  ),
  'metrics-band': () => (
    <MetricsBand
      variant="primary"
      metrics={[
        { value: '98%', label: 'Satisfação', icon: <CheckCircle2 className="h-5 w-5" /> },
        { value: '42+', label: 'Entregas' },
        { value: '4,9', label: 'Avaliação' },
      ]}
      className="rounded-xl !border-0 [&_.container]:!px-6"
    />
  ),
  'process-steps': () => (
    <ProcessSteps
      title="Do primeiro contato à peça tratada: 4 passos"
      description="Fluxo claro do orçamento à entrega, com análise técnica antes de subir para produção."
      steps={[
        {
          title: 'Você envia a demanda',
          description: 'Lista de peças, desenhos, volumes e requisitos técnicos.',
        },
        {
          title: 'Análise técnica',
          description: 'Material, aplicação, acabamento e condições de uso.',
        },
        {
          title: 'Produção com controle',
          description: 'Tratamento com acompanhamento e uniformidade do revestimento.',
        },
        {
          title: 'Entrega no prazo',
          description: 'Peças prontas para montagem, estoque ou linha de produção.',
        },
      ]}
      className="rounded-2xl !py-8"
    />
  ),
  'stats-grid': () => (
    <StatsGrid
      title="Impacto mensurável"
      columns={3}
      stats={[
        { value: '98%', label: 'Satisfação' },
        { value: '25+', label: 'Anos de mercado' },
        { value: '4,9', label: 'Avaliação média' },
      ]}
      className="!py-8"
    />
  ),
  timeline: () => (
    <Timeline
      title="Evolução"
      items={[
        { date: '2018', title: 'Fundação', description: 'O início da operação.' },
        { date: '2022', title: 'Expansão', description: 'Atuação nacional.' },
        { date: 'Hoje', title: 'Nova fase', description: 'Tecnologia e escala.' },
      ]}
      className="!py-8"
    />
  ),
  'interactive-feature-showcase': () => (
    <InteractiveFeatureShowcase
      className="!py-0"
      features={[
        {
          id: 'design',
          title: 'Design intuitivo',
          description: 'Interfaces claras para decisões mais rápidas.',
          image: { src: imageOne, alt: 'Interface de produto' },
        },
        {
          id: 'tecnologia',
          title: 'Tecnologia escalável',
          description: 'Uma base preparada para evoluir.',
          image: { src: imageThree, alt: 'Painel de tecnologia' },
        },
      ]}
    />
  ),
  'about-gallery': () => (
    <AboutGallery
      eyebrow="Sobre nós"
      title="Pessoas e ideias em movimento."
      description="Uma composição visual flexível para histórias institucionais."
      variant="mosaic"
      images={[
        { src: imageTwo, alt: 'Equipe reunida' },
        { src: imageOne, alt: 'Projeto em desenvolvimento' },
        { src: imageThree, alt: 'Painel digital' },
      ]}
      stats={[
        { value: '12+', label: 'Anos' },
        { value: '180', label: 'Projetos' },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'about-values-section': () => (
    <AboutValuesSection
      title="Ideias claras, relações duradouras."
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet."
      statement="Criamos soluções úteis sem perder de vista as pessoas."
      values={[
        {
          title: 'Clareza',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          icon: Sparkles,
        },
        {
          title: 'Confiança',
          description: 'Proin gravida dolor sit amet lacus accumsan et viverra justo.',
          icon: ShieldCheck,
        },
        {
          title: 'Evolução',
          description: 'Nam fermentum, nulla luctus pharetra vulputate, felis tellus.',
          icon: Zap,
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'category-mosaic': () => (
    <CategoryMosaic
      labelStyle="card"
      items={[
        {
          id: 'categoria-1',
          label: 'Coleção',
          href: '#catalogo',
          image: { src: imageOne, alt: 'Coleção em destaque' },
          size: 'tall',
        },
        {
          id: 'categoria-2',
          label: 'Experiências',
          href: '#catalogo',
          image: { src: imageTwo, alt: 'Experiências' },
          size: 'tall',
        },
        {
          id: 'categoria-3',
          label: 'Novidades',
          href: '#catalogo',
          image: { src: imageThree, alt: 'Novidades' },
          size: 'wide',
        },
      ]}
      className="!py-4 [&_.container]:!px-0"
    />
  ),
  'differentials-section': () => (
    <DifferentialsSection
      eyebrow="Diferenciais"
      title="O que torna a experiência melhor."
      description="Uma seção flexível para destacar benefícios e argumentos de valor."
      variant="cards"
      items={[
        {
          title: 'Agilidade',
          description: 'Processos claros e decisões rápidas.',
          icon: <Zap className="h-5 w-5" />,
        },
        {
          title: 'Segurança',
          description: 'Padrões sólidos em cada entrega.',
          icon: <ShieldCheck className="h-5 w-5" />,
        },
        {
          title: 'Precisão',
          description: 'Detalhes orientados por objetivos reais.',
          icon: <Gauge className="h-5 w-5" />,
        },
      ]}
      className="!py-10 [&_.container]:!px-0"
    />
  ),
  'about-metrics-section': () => (
    <AboutMetricsSection
      eyebrow="Empresa"
      title="Uma engenharia inteira dedicada a fazer sua peça durar mais."
      paragraphs={[
        'Nascemos com a missão de entregar tratamento de superfície consistente para quem produz em série. Décadas depois, seguimos com o mesmo rigor — processo mais controlado, equipe técnica maior e clientes que atravessam gerações.',
      ]}
      metrics={[
        { value: '30+', label: 'Anos' },
        { value: 'Mauá', label: 'Planta própria' },
        { value: 'SP', label: 'Cobertura' },
      ]}
      image={{ src: imageTwo, alt: 'Planta industrial de tratamento de superfície' }}
      action={{ label: 'Conheça a nossa empresa', href: '#empresa' }}
      className="!py-10 [&_.container]:!px-0"
    />
  ),
  'global-metrics-section': () => (
    <GlobalMetricsSection
      eyebrow="Escala"
      title="Uma base global."
      metrics={[
        { value: '135+', label: 'Mercados' },
        { value: '500 mi', label: 'Eventos/dia' },
        { value: '99,99%', label: 'Disponibilidade' },
        { value: '24/7', label: 'Monitoramento' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'audience-spotlight-section': () => (
    <AudienceSpotlightSection
      title="Soluções para cada estágio."
      items={[
        {
          id: 'startups',
          label: 'Startups',
          title: 'Pronta para crescer.',
          description: 'Uma base modular para testar, lançar e expandir.',
          benefits: [
            { title: 'Integração', description: 'Comece com rapidez.' },
            { title: 'Escala', description: 'Evolua sem retrabalho.' },
          ],
        },
        {
          id: 'enterprise',
          label: 'Empresas',
          title: 'Operação unificada.',
          description: 'Controles e observabilidade para estruturas complexas.',
          benefits: [
            { title: 'Governança', description: 'Controles avançados.' },
            { title: 'Cobertura', description: 'Atuação em múltiplos mercados.' },
          ],
        },
      ]}
      className="rounded-xl !py-10 [&_.container]:!px-5"
    />
  ),
  'integration-stack-section': () => (
    <IntegrationStackSection
      eyebrow="Desenvolvedores"
      title="Integração flexível."
      description="Combine ferramentas prontas e APIs em uma mesma infraestrutura."
      metrics={[
        { value: '500 mi', label: 'Eventos/dia' },
        { value: '10 mil', label: 'Requisições/s' },
        { value: '24/7', label: 'Observabilidade' },
      ]}
      options={[
        { title: 'Sem código', description: 'Configure fluxos visualmente.' },
        { title: 'Pré-integrada', description: 'Conecte ferramentas existentes.' },
        { title: 'APIs', description: 'Crie uma experiência personalizada.' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'investment-platform-section': () => (
    <InvestmentPlatformSection
      eyebrow="A força da plataforma"
      title="Capital paciente e visão compartilhada."
      description="Uma seção institucional para comunicar escala e experiência."
      metrics={[
        { value: '€24+', label: 'Bilhões em ativos' },
        { value: '7', label: 'Estratégias' },
        { value: '70+', label: 'Empresas' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'responsibility-feature-section': () => (
    <ResponsibilityFeatureSection
      eyebrow="Responsabilidade"
      title="Valor duradouro."
      description="Uma composição imersiva para compromissos e impacto."
      image={{ src: imageOne, alt: 'Projeto profissional' }}
      pillars={['Clima e natureza', 'Pessoas', 'Governança', 'Tecnologia responsável']}
      className="rounded-xl [&>div]:!min-h-[520px]"
    />
  ),
  'office-network-section': () => (
    <OfficeNetworkSection
      eyebrow="Onde estamos"
      title="Presença global."
      offices={[
        {
          city: 'São Paulo',
          country: 'Brasil',
          address: 'Avenida Lorem, 100',
          phone: '+55 11 0000-0000',
        },
        {
          city: 'New York',
          country: 'Estados Unidos',
          address: '200 Lorem Avenue',
          email: 'contact@company.com',
        },
        {
          city: 'London',
          country: 'Reino Unido',
          address: '20 Lorem Street',
          phone: '+44 20 0000 0000',
        },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'workspace-feature-showcase': () => (
    <WorkspaceFeatureShowcase
      eyebrow="Recursos"
      title="Todo o fluxo em um lugar."
      features={[
        {
          id: 'publish',
          label: 'Publicar',
          title: 'Organize seu calendário.',
          description: 'Planeje e distribua conteúdo em todos os canais.',
          accent: 'blue',
        },
        {
          id: 'insights',
          label: 'Insights',
          title: 'Entenda seus resultados.',
          description: 'Transforme métricas em próximos passos.',
          accent: 'yellow',
        },
      ]}
      className="rounded-xl !py-10 [&_.container]:!px-5"
    />
  ),
  'conversational-workflow-section': () => (
    <ConversationalWorkflowSection
      eyebrow="IA e agentes"
      title="Planeje por conversa."
      description="Consulte dados, gere ideias e envie conteúdo para a fila."
      steps={[
        { label: 'Pergunte', description: 'Consulte desempenho.' },
        { label: 'Planeje', description: 'Transforme dados em ideias.' },
        { label: 'Publique', description: 'Envie para a fila.' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'transparency-metrics-section': () => (
    <TransparencyMetricsSection
      eyebrow="Empresa aberta"
      title="Transparência gera confiança."
      metrics={[
        { value: '280 mil', label: 'Pessoas ativas', trend: '+8%' },
        { value: '82 mil', label: 'Clientes', trend: '+12%' },
        { value: '73', label: 'Pessoas', detail: 'Em 15 países' },
        { value: '$27 mi', label: 'Receita anual' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'keyboard-performance-section': () => (
    <KeyboardPerformanceSection
      eyebrow="Keyboard-first"
      title="Nenhum movimento desperdiçado."
      principles={[
        { title: 'Rápido', description: 'Resposta em milissegundos.', key: '⌘ K' },
        { title: 'Ergonômico', description: 'Fluxo guiado pelo teclado.', key: '⌥ ↵' },
        { title: 'Pessoal', description: 'Atalhos do seu jeito.', key: '⌘ ,' },
        { title: 'Confiável', description: 'Pronto sempre que precisar.', key: '99,9%' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'ai-agent-workspace-section': () => (
    <AIAgentWorkspaceSection
      eyebrow="Agente de IA"
      title="Um assistente que usa suas ferramentas."
      description="Conecte tarefas, agenda e conhecimento em uma conversa."
      tools={['Buscar tarefas', 'Consultar detalhes', 'Atualizar agenda']}
      capabilities={[
        { title: 'Chat', description: 'Conversa integrada.' },
        { title: 'Ações', description: 'Ferramentas conectadas.' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'automation-toolkit-section': () => (
    <AutomationToolkitSection
      eyebrow="Automações"
      title="Não se repita."
      tools={[
        { title: 'Snippets', description: 'Textos por palavras-chave.', shortcut: ';email' },
        { title: 'Links rápidos', description: 'Acesse qualquer destino.', shortcut: '⌥ ⌘ L' },
        { title: 'Atalhos', description: 'Comandos personalizados.', shortcut: '⌘ ⇧ K' },
        { title: 'Fluxos', description: 'Ações em sequência.', shortcut: '⌘ ↵' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'about-stats-split': () => (
    <AboutStatsSplit
      eyebrow="Sobre nós"
      title="Referência em soluções de infraestrutura"
      image={image(3)}
      paragraphs={[lorem, lorem]}
      stats={[
        { value: 15, suffix: '+', label: 'Anos de mercado' },
        { value: 500, suffix: '+', label: 'Clientes' },
        { value: 98, suffix: '%', label: 'Satisfação' },
      ]}
      pillars={[
        { title: 'Missão', description: lorem },
        { title: 'Visão', description: lorem },
      ]}
      action={{ label: 'Conheça a empresa', href: '#' }}
    />
  ),
  'numbered-card-grid': () => (
    <NumberedCardGrid
      eyebrow="Diferenciais"
      title="Por que escolher a Norte"
      items={features}
      columns={4}
      tone="industrial"
      hoverFill
    />
  ),
  'icon-feature-cards': () => (
    <IconFeatureCards
      eyebrow="Recursos"
      title="Tudo o que sua operação precisa"
      items={features
        .slice(0, 3)
        .map((item) => ({ ...item, action: { label: 'Saiba mais', href: '#' } }))}
    />
  ),
  'lightbox-gallery': () => (
    <LightboxGallery
      eyebrow="Galeria"
      title="Projetos realizados"
      items={photos.map((src, index) => ({
        id: String(index),
        title: `Projeto ${index + 1}`,
        category: 'Instalação',
        image: { src, alt: `Projeto ${index + 1}` },
        size: index === 0 ? 'large' : index === 3 ? 'wide' : 'default',
      }))}
    />
  ),
  'floating-media-article': () => (
    <FloatingMediaArticle
      eyebrow="Produto"
      title="Sobre o Servidor Pro"
      image={image(0)}
      caption="Linha Pro 2026"
      paragraphs={[lorem, lorem, lorem]}
      more={{ paragraphs: [lorem, lorem] }}
    />
  ),
  'logo-carousel-band': () => (
    <LogoCarouselBand
      eyebrow="Clientes"
      title="Empresas que confiam"
      monochrome
      logos={[1, 2, 3, 4, 5, 6].map((index) => ({
        name: `Cliente ${index}`,
        src: `/images/brand/logo${index}.png`,
      }))}
    />
  ),
  'marquee-gallery': () => (
    <MarqueeGallery
      eyebrow="Portfólio"
      title="Nossos projetos"
      items={photos.map((src, index) => ({
        src,
        alt: `Projeto ${index + 1}`,
        caption: `Projeto ${index + 1}`,
      }))}
    />
  ),
  'location-showcase': () => (
    <LocationShowcase
      title="Unidades e atrações"
      description={lorem}
      action={{ label: 'Ver todas as unidades', href: '#unidades' }}
      locations={['Centro', 'Zona Norte', 'Zona Sul', 'Zona Leste', 'Zona Oeste', 'Litoral'].map(
        (name, index) => ({
          id: name,
          name,
          description: lorem,
          href: '#unidade',
          image: image(index, name),
        }),
      )}
    />
  ),
  'service-area-cards': () => (
    <ServiceAreaCards
      title="Onde atendemos"
      description={lorem}
      areas={['Capital', 'Interior', 'Litoral'].map((name, index) => ({
        id: name,
        name,
        region: 'Região',
        description: lorem,
        href: '#regiao',
        image: image(index, name),
      }))}
    />
  ),
  'problem-solution-cards': () => (
    <ProblemSolutionCards
      eyebrow="Problema → Solução"
      title="Peça sem tratamento vira custo escondido na sua linha"
      description="Componentes metálicos sem proteção adequada comprometem produtividade, aumentam despesas e reduzem a confiabilidade do produto final."
      items={[
        {
          label: 'Problema',
          title: 'Oxidação e falha da pintura',
          description:
            'Sem preparação e proteção, a peça sofre corrosão, perda de aderência, manchas e desgaste precoce.',
        },
        {
          label: 'Impacto',
          title: 'Custo escondido no chão de fábrica',
          description:
            'Retrabalho, interrupções e substituições que nem sempre aparecem no orçamento inicial.',
        },
        {
          label: 'Resposta',
          title: 'Processo controlado conforme a aplicação',
          description:
            'Analisamos a peça e as condições de uso para indicar o tratamento superficial mais adequado.',
        },
      ]}
    />
  ),
  'credibility-section': () => (
    <CredibilitySection
      title="Por que indústrias de São Paulo escolhem tratamento controlado há mais de 30 anos"
      description="Experiência, conhecimento técnico e compromisso com cada lote — segurança, agilidade e padrão de acabamento."
      stats={[
        { value: 30, suffix: '+', label: 'Anos de operação' },
        { value: 4, label: 'Tratamentos de superfície' },
        { value: 100, suffix: '%', label: 'Cobertura em SP' },
      ]}
      image={{ src: imageOne, alt: 'Peça metálica com zincagem' }}
      caption="Peças reais tratadas na planta — não fotos de banco de imagens."
      reasons={[
        {
          title: 'Mais de 30 anos de experiência',
          description:
            'Atendimento a diferentes peças, materiais, geometrias e necessidades industriais.',
        },
        {
          title: 'Variedade de tratamentos',
          description:
            'Zincagem, galvanização, fosfatização, bicromatização e preparação de superfícies.',
        },
        {
          title: 'Atendimento próximo',
          description: 'Equipe preparada para compreender especificações e orientar a contratação.',
        },
        {
          title: 'Equipe qualificada',
          description: 'Profissionais capacitados para acompanhar processos e manter o padrão.',
        },
        {
          title: 'Processos organizados',
          description: 'Fluxos produtivos com consistência, previsibilidade e controle.',
        },
        {
          title: 'Suporte após o atendimento',
          description: 'Acompanhamento comercial para novas necessidades de tratamento.',
        },
      ]}
    />
  ),
  'coverage-callout': () => (
    <CoverageCallout
      eyebrow="Área de atendimento"
      title="Galvanização em Mauá com cobertura em todo o Estado de São Paulo"
      description="Planta no ABC Paulista com atendimento a empresas da Grande São Paulo e demais regiões do estado."
      cardTitle="Atendimento em São Paulo"
      cardDescription="Solicite uma avaliação comercial para galvanização e tratamento de superfície de peças industriais."
      action={{ label: 'Fale com a equipe comercial', href: '#contato' }}
      badge={{ value: 'SP', label: 'Todo o estado', caption: 'Cobertura' }}
    />
  ),
  'map-embed-section': () => (
    <MapEmbedSection
      eyebrow="Localização"
      title="Onde estamos"
      description={lorem}
      query="Av. Paulista, 1000 - São Paulo"
      address="Av. Paulista, 1000 - Bela Vista, São Paulo/SP"
      directionsHref="https://maps.google.com/?q=Av.+Paulista,+1000"
      height={320}
      className="!py-0"
    />
  ),
  'article-layout': () => (
    <ArticleLayout
      variant="sidebar"
      className="!py-0"
      author="Equipe"
      category="Guias"
      date={{ label: '10 de março de 2026', dateTime: '2026-03-10' }}
      image={{ src: imageOne, alt: 'Capa do artigo' }}
      aside={{
        title: 'Precisa de ajuda?',
        description: lorem,
        action: { label: 'Fale conosco', href: '#contato' },
      }}
      body={[
        { heading: 'Introdução', paragraphs: [lorem, lorem] },
        { heading: 'Como funciona', paragraphs: [lorem] },
        { heading: 'Conclusão', paragraphs: [lorem] },
      ]}
    />
  ),
  'blog-post-page': () => <BlogPostPreview />,
  'feature-image-list': () => (
    <FeatureImageList
      title="Qualidade, variedade e cuidado em cada detalhe"
      description="Materiais resistentes e acabamentos cuidadosos para produtos duráveis e preparados para o dia a dia."
      action={{ label: 'Saiba mais', href: '#empresa' }}
      image={{ src: photos[4], alt: 'Ambiente com produtos da marca' }}
      items={[
        {
          icon: <Armchair />,
          title: 'Qualidade em cada produto',
          description: 'Materiais resistentes e acabamentos cuidadosos para durar.',
        },
        {
          icon: <LayoutGrid />,
          title: 'Variedade para diferentes projetos',
          description: 'Linhas completas para estilos e necessidades diferentes.',
        },
        {
          icon: <Trees />,
          title: 'Soluções para áreas externas',
          description: 'Opções para ambientes residenciais, comerciais e corporativos.',
        },
        {
          icon: <Headset />,
          title: 'Atendimento próximo e especializado',
          description: 'Suporte em cada etapa, com soluções adequadas a cada projeto.',
        },
      ]}
    />
  ),
  'polaroid-line-carousel': () => (
    <PolaroidLineCarousel
      height={480}
      cardWidth={220}
      slides={[
        {
          image: '/polaroid-line-carousel/acima-das-nuvens.webp',
          title: 'Acima das nuvens',
          caption: 'Valais, Suíça: o nascer do sol a 3.100 m.',
        },
        {
          image: '/polaroid-line-carousel/lago-de-vidro.webp',
          title: 'Lago de vidro',
          caption: 'Lago di Braies, um barco a remo ao meio-dia.',
        },
        {
          image: '/polaroid-line-carousel/vale-dourado.webp',
          title: 'Vale dourado',
          caption: 'A luz do fim da tarde descendo pela serra.',
        },
        {
          image: '/polaroid-line-carousel/linha-da-neve.webp',
          title: 'Linha da neve',
          caption: 'Pinheiros, o leito do rio e a serra alta.',
        },
        {
          image: '/polaroid-line-carousel/serras-azuis.webp',
          title: 'Serras azuis',
          caption: 'Sete camadas de névoa antes do anoitecer.',
        },
        {
          image: '/polaroid-line-carousel/ponte-da-cascata.webp',
          title: 'Ponte da cascata',
          caption: 'Multnomah Falls depois da chuva.',
        },
      ]}
    />
  ),
  'flick-cards': () => <FlickCards height={480} className="rounded-xl" />,
  'liquid-glass-carousel': () => <LiquidGlassCarousel height={480} className="rounded-xl" />,
  'radial-cards': () => <RadialCards height={480} className="rounded-xl" />,
  'hueline-colour-story': () => <HuelineColourStory />,
  'hueline-atelier': () => <HuelineAtelier />,
  'hueline-style-arches': () => <HuelineStyleArches />,
  'hueline-lookbook': () => <HuelineLookbook />,
  'veloria-onboard': () => (
    <div className="max-h-[520px] overflow-hidden">
      <VeloriaOnboard />
    </div>
  ),
  'veloria-voyage': () => (
    <div className="max-h-[480px] overflow-hidden">
      <VeloriaVoyage />
    </div>
  ),
  'veloria-destinations': () => (
    <div className="max-h-[520px] overflow-hidden">
      <VeloriaDestinations />
    </div>
  ),
  'nimbus-demo': () => (
    <div className="overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusDemo />
    </div>
  ),
  'nimbus-capabilities': () => (
    <div className="overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusCapabilities />
    </div>
  ),
  'nimbus-developer': () => (
    <div className="overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusDeveloper />
    </div>
  ),
  'nimbus-use-cases': () => (
    <div className="overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusUseCases />
    </div>
  ),
}
