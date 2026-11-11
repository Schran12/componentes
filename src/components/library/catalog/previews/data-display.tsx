import {
  BeforeAfterSlider,
  BlogFeaturedListing,
  BlogGrid,
  BlogSidebarLayout,
  CircularCarousel,
  ExtensionDirectorySection,
  FeatureGrid,
  FilterableCardGrid,
  HoloCard,
  HoverRevealServices,
  InteractiveCard,
  PackageTabsOffer,
  PaginatedProjectGallery,
  PricingCards,
  ProductCard,
  ProductCarousel,
  ProductCatalogGrid,
  ProductFeatureTabs,
  ProductGrid,
  ProductInfoTabs,
  ProductOverlayCarousel,
  ProductShowcase,
  ProductSpotlightPicker,
  ProductSuiteSection,
  RelatedProducts,
  ServicesCarouselSection,
  StrategyPortfolioSection,
  TeamGrid,
  TicketPricingCards,
  HuelineProductRails,
  HuelineShopGrid,
  NimbusPricing,
} from '@/components/library'
import { Boxes, Gauge, Newspaper, Package, Rocket, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import {
  image,
  imageOne,
  imageThree,
  imageTwo,
  lorem,
  photos,
  products,
  TeamSectionPreview,
} from './shared'
import type { PreviewMap } from './types'

export const dataDisplayPreviews: PreviewMap = {
  'blog-grid': () => (
    <BlogGrid
      title="Conteúdos recentes"
      posts={[
        {
          slug: 'design-em-escala',
          title: 'Como manter consistência em escala',
          excerpt: 'Princípios práticos para produtos que evoluem.',
          image: { src: imageOne, alt: 'Mesa de design' },
          date: '5 out. 2026',
          category: 'Design',
          href: '#blog',
        },
        {
          slug: 'metricas-produto',
          title: 'Métricas que orientam produto',
          excerpt: 'Transforme sinais em decisões melhores.',
          image: { src: imageThree, alt: 'Painel de métricas' },
          date: '28 set. 2026',
          category: 'Produto',
          href: '#blog',
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'feature-grid': () => (
    <FeatureGrid
      title="Feito para performar"
      features={[
        { title: 'Velocidade', description: 'Experiências leves e objetivas.', icon: Zap },
        { title: 'Segurança', description: 'Padrões sólidos desde a base.', icon: ShieldCheck },
        { title: 'Resultados', description: 'Decisões orientadas por impacto.', icon: Gauge },
      ]}
      className="!py-8"
    />
  ),
  'pricing-cards': () => (
    <PricingCards
      title="Planos transparentes"
      plans={[
        {
          name: 'Essencial',
          price: 'R$ 89',
          period: 'mês',
          features: ['1 projeto', 'Suporte'],
          action: { label: 'Escolher', href: '#catalogo' },
        },
        {
          name: 'Pro',
          price: 'R$ 189',
          period: 'mês',
          features: ['Projetos ilimitados', 'Prioridade'],
          action: { label: 'Escolher Pro', href: '#catalogo' },
          highlighted: true,
        },
        {
          name: 'Empresa',
          price: 'Sob consulta',
          features: ['SLA dedicado', 'Implantação'],
          action: { label: 'Conversar', href: '#catalogo' },
        },
      ]}
      className="!py-8"
    />
  ),
  'nimbus-pricing': () => (
    <div className="overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusPricing />
    </div>
  ),
  'product-grid': () => (
    <ProductGrid
      title="Soluções em destaque"
      products={[
        {
          id: 'atlas',
          name: 'Atlas',
          description: 'Gestão centralizada para operações complexas.',
          image: { src: imageThree, alt: 'Dashboard do produto Atlas' },
          href: '#produtos',
          badge: 'Novo',
        },
        {
          id: 'nexus',
          name: 'Nexus',
          description: 'Colaboração simples para times modernos.',
          image: { src: imageTwo, alt: 'Equipe usando o produto Nexus' },
          href: '#produtos',
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'product-showcase': () => (
    <ProductShowcase
      eyebrow="Plataforma"
      name="Norte One"
      description="Visibilidade e controle para transformar operações."
      image={{ src: imageThree, alt: 'Visão da plataforma Norte One' }}
      features={['Indicadores em tempo real', 'Fluxos configuráveis', 'Suporte dedicado']}
      action={{ label: 'Conhecer produto', href: '#produtos' }}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'team-grid': () => (
    <TeamGrid
      title="Liderança"
      members={[
        {
          name: 'Marina Costa',
          role: 'Produto',
          image: { src: imageTwo, alt: 'Marina Costa' },
          bio: 'Estratégia e experiência.',
          email: 'marina@exemplo.com',
        },
        {
          name: 'Rafael Lima',
          role: 'Tecnologia',
          image: { src: imageOne, alt: 'Rafael Lima' },
          bio: 'Arquitetura e escala.',
          linkedin: 'https://www.linkedin.com',
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'before-after-slider': () => (
    <BeforeAfterSlider
      before={{ src: imageTwo, alt: 'Ambiente antes', label: 'Antes' }}
      after={{ src: imageOne, alt: 'Ambiente depois', label: 'Depois' }}
    />
  ),
  'filterable-card-grid': () => (
    <FilterableCardGrid
      className="!py-0"
      columns={3}
      items={[
        {
          id: 'marca',
          title: 'Identidade',
          category: 'Marca',
          image: { src: imageOne, alt: 'Projeto de marca' },
        },
        {
          id: 'digital',
          title: 'Plataforma',
          category: 'Digital',
          image: { src: imageThree, alt: 'Projeto digital' },
        },
        {
          id: 'espaco',
          title: 'Ambiente',
          category: 'Espaços',
          image: { src: imageTwo, alt: 'Projeto de espaço' },
        },
      ]}
    />
  ),
  'interactive-card': () => (
    <div className="grid gap-4 py-4 md:grid-cols-2">
      <InteractiveCard
        variant="elevated"
        eyebrow="Estratégia"
        title="Card com elevação"
        description="Movimento, hierarquia e ação em um bloco reutilizável."
        href="#catalogo"
        icon={<Sparkles className="h-5 w-5" />}
      />
      <InteractiveCard
        variant="editorial"
        eyebrow="Editorial"
        title="Card sobre imagem"
        description="Uma opção visual para portfólios e narrativas."
        image={{ src: imageOne, alt: 'Projeto digital' }}
        href="#catalogo"
      />
    </div>
  ),
  'product-card': () => (
    <div className="mx-auto max-w-xs">
      <ProductCard
        variant="classic"
        showFavorite
        product={{
          id: 'produto-preview',
          name: 'Produto lorem',
          description: 'Descrição curta e objetiva para apresentar o produto.',
          image: { src: imageOne, alt: 'Produto em destaque' },
          href: '#produtos',
          price: 'R$ 189',
          previousPrice: 'R$ 229',
          badge: 'Novo',
          rating: 4.9,
        }}
      />
    </div>
  ),
  'product-carousel': () => (
    <ProductCarousel
      title="Peças em destaque"
      description="Seleção do catálogo para atacado e confecção."
      cardVariant="minimal"
      slidesPerView={3}
      products={[
        {
          id: 'carousel-aplique',
          name: 'Aplique orgânico dourado',
          image: { src: imageThree, alt: 'Aplique orgânico dourado' },
          href: '#produtos',
          price: 'Sob consulta',
        },
        {
          id: 'carousel-passante',
          name: 'Passante redondo em acetato',
          image: { src: imageTwo, alt: 'Passante redondo em acetato' },
          href: '#produtos',
          price: 'Sob consulta',
        },
        {
          id: 'carousel-fivela',
          name: 'Fivela retangular em acetato',
          image: { src: imageOne, alt: 'Fivela retangular em acetato' },
          href: '#produtos',
          price: 'Sob consulta',
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'product-feature-tabs': () => (
    <ProductFeatureTabs
      title="Uma solução para cada momento."
      items={[
        {
          id: 'essencial',
          label: 'Essencial',
          title: 'Tudo para começar com clareza.',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          features: ['Configuração simples', 'Experiência responsiva', 'Suporte contínuo'],
          image: { src: imageOne, alt: 'Produto Essencial' },
          action: { label: 'Conhecer produto', href: '#produtos' },
        },
        {
          id: 'pro',
          label: 'Profissional',
          title: 'Mais recursos para crescer.',
          description: 'Proin gravida dolor sit amet lacus accumsan et viverra justo.',
          features: ['Automação avançada', 'Relatórios completos', 'Integrações'],
          image: { src: imageThree, alt: 'Produto Profissional' },
          action: { label: 'Explorar recursos', href: '#produtos' },
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'services-carousel-section': () => (
    <ServicesCarouselSection
      eyebrow="Serviços"
      title="Tudo em um só lugar."
      items={[
        {
          id: 'service-design',
          title: 'Design estratégico',
          description: 'Experiências claras e consistentes.',
          href: '#catalogo',
          icon: <Sparkles className="h-5 w-5" />,
        },
        {
          id: 'service-tech',
          title: 'Tecnologia',
          description: 'Soluções preparadas para evoluir.',
          href: '#catalogo',
          icon: <Boxes className="h-5 w-5" />,
        },
        {
          id: 'service-growth',
          title: 'Crescimento',
          description: 'Decisões orientadas por impacto.',
          href: '#catalogo',
          icon: <Rocket className="h-5 w-5" />,
        },
      ]}
      className="!py-10 [&_.container]:!px-0"
    />
  ),
  'product-suite-section': () => (
    <ProductSuiteSection
      eyebrow="Produtos"
      title="Uma suíte conectada."
      description="Abas acessíveis para organizar soluções complexas."
      items={[
        {
          id: 'payments',
          label: 'Pagamentos',
          title: 'Venda em qualquer canal.',
          description: 'Experiência unificada com gestão centralizada.',
          icon: <Package className="h-4 w-4" />,
          features: ['Integração rápida', 'Operação segura'],
        },
        {
          id: 'platform',
          label: 'Plataformas',
          title: 'Amplie seu ecossistema.',
          description: 'Produtos modulares para novos modelos de receita.',
          icon: <Boxes className="h-4 w-4" />,
          features: ['Contas conectadas', 'Fluxos automatizados'],
        },
      ]}
      className="rounded-xl !py-10 [&_.container]:!px-5"
    />
  ),
  'strategy-portfolio-section': () => (
    <StrategyPortfolioSection
      eyebrow="Estratégias"
      title="Abordagens distintas."
      strategies={[
        {
          id: 'growth',
          name: 'Growth Capital',
          region: 'Global',
          category: 'Crescimento',
          description: 'Capital e suporte para empresas em expansão.',
          href: '#catalogo',
        },
        {
          id: 'impact',
          name: 'Climate Impact',
          region: 'Europa',
          category: 'Impacto',
          description: 'Soluções orientadas a clima e natureza.',
          href: '#catalogo',
        },
        {
          id: 'middle',
          name: 'Middle Market',
          region: 'Américas',
          category: 'Private equity',
          description: 'Parcerias para criação de valor sustentável.',
          href: '#catalogo',
        },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'extension-directory-section': () => (
    <ExtensionDirectorySection
      eyebrow="Extensões"
      title="Existe uma extensão para isso."
      items={[
        {
          id: 'tasks',
          name: 'Tarefas',
          description: 'Organize seu trabalho.',
          category: 'Produtividade',
          href: '#catalogo',
        },
        {
          id: 'translate',
          name: 'Tradução',
          description: 'Traduza textos rapidamente.',
          category: 'Escrita',
          href: '#catalogo',
        },
        {
          id: 'music',
          name: 'Música',
          description: 'Controle sua biblioteca.',
          category: 'Mídia',
          href: '#catalogo',
        },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'hover-reveal-services': () => (
    <HoverRevealServices
      items={[
        {
          title: 'Galvanização Eletrolítica',
          description:
            'Revestimento metálico que protege peças contra a corrosão e aumenta a durabilidade.',
        },
        {
          title: 'Decapagem de Latão',
          description:
            'Limpeza química que remove oxidações e prepara a superfície para o acabamento.',
        },
        {
          title: 'Fosfatização a Seco',
          description:
            'Prepara e protege superfícies metálicas, favorecendo a aderência de revestimentos.',
        },
        {
          title: 'Fosfatização Oleada',
          description:
            'Camada fosfatizada com óleo protetivo para ampliar a resistência contra oxidação.',
        },
      ].map((item, index) => ({
        ...item,
        label: `0${index + 1}`,
        href: '#tratamentos',
        image: image(index, item.title),
      }))}
    />
  ),
  'product-spotlight-picker': () => (
    <ProductSpotlightPicker
      eyebrow="Produtos"
      title="Linha em destaque"
      products={products}
      allAction={{ label: 'Ver todos', href: '#' }}
    />
  ),
  'product-catalog-grid': () => (
    <ProductCatalogGrid
      eyebrow="Catálogo"
      title="Todos os produtos"
      products={products.slice(0, 3)}
      tone="industrial"
    />
  ),
  'related-products': () => (
    <RelatedProducts title="Produtos relacionados" products={products.slice(1)} />
  ),
  'product-info-tabs': () => (
    <div className="bg-slate-50 p-6">
      <ProductInfoTabs
        paragraphs={[lorem, lorem]}
        details={[
          { title: 'Potência', description: '5 kW' },
          { title: 'Tensão', description: '220/380 V' },
          { title: 'Garantia', description: '24 meses' },
        ]}
        action={{ label: 'Solicitar orçamento', href: '#' }}
      />
    </div>
  ),
  'ticket-pricing-cards': () => (
    <TicketPricingCards
      title="Preços"
      cards={[
        {
          id: 'hora',
          title: 'Ingresso 1 hora',
          subtitle: 'Todas as idades',
          prices: [
            { label: 'Segunda a quinta', value: 'R$ 80,00' },
            { label: 'Sexta a domingo', value: 'R$ 90,00' },
          ],
          actions: [{ label: 'Comprar agora', href: '#comprar' }],
          featured: true,
        },
        {
          id: 'acessorio',
          title: 'Acessório obrigatório',
          subtitle: 'Todos os tamanhos',
          prices: [{ label: 'Valor único', value: 'R$ 35,00' }],
          description: lorem,
          actions: [{ label: 'Comprar agora', href: '#comprar' }],
        },
        {
          id: 'pcd',
          title: 'PCD',
          highlight: '50%',
          description: lorem,
          note: '*Necessário documento comprobatório.',
          actions: [
            { label: 'Saiba mais', href: '#regras', variant: 'outline' },
            { label: 'Comprar', href: '#comprar' },
          ],
        },
        {
          id: 'infantil',
          title: 'Crianças de 2 a 4 anos',
          description: lorem,
          actions: [{ label: 'Saiba mais', href: '#regras', variant: 'outline' }],
        },
      ]}
    />
  ),
  'package-tabs-offer': () => (
    <PackageTabsOffer
      title="Pacotes"
      packages={['Essencial', 'Escolar', 'Corporativo'].map((label, index) => ({
        id: label,
        label,
        headline: 'Pacote a partir de 10x',
        price: `R$ ${165 + index * 40},00`,
        priceNote: 'sem juros*',
        description: lorem,
        image: { src: index % 2 ? imageTwo : imageOne, alt: label },
        actions: [
          { label: 'Solicite agora', href: '#solicitar' },
          { label: 'Saiba mais', href: '#detalhes', variant: 'outline' as const },
        ],
      }))}
    />
  ),
  'paginated-project-gallery': () => (
    <PaginatedProjectGallery
      title="Projetos"
      description={lorem}
      perPage={6}
      projects={Array.from({ length: 12 }, (_, index) => {
        const category = ['Cozinha', 'Banheiro', 'Área externa'][index % 3]
        return {
          id: `p${index}`,
          title: `${category} ${index + 1}`,
          category,
          href: '#projeto',
          image: image(index, category),
        }
      })}
    />
  ),
  'blog-sidebar-layout': () => (
    <BlogSidebarLayout
      className="!py-0"
      cta={{
        title: 'Ficou com dúvidas?',
        description: lorem,
        action: { label: 'Fale conosco', href: '#contato' },
      }}
      posts={[
        'Guia de manutenção',
        'Tendências do setor',
        'Como escolher o fornecedor',
        'Checklist de projeto',
      ].map((title, index) => ({
        slug: `post-${index}`,
        title,
        excerpt: lorem,
        image: image(index, title),
        date: `${10 + index} de março de 2026`,
        category: index % 2 ? 'Mercado' : 'Guias',
        href: '#post',
      }))}
    />
  ),
  'team-section': () => <TeamSectionPreview />,
  'blog-featured-listing': () => (
    <BlogFeaturedListing
      hero={{
        title: 'Blog',
        icon: <Newspaper />,
        description: 'Explore nossos artigos mais recentes sobre o setor.',
        image: { src: imageThree, alt: '' },
        breadcrumbs: [{ label: 'Home', href: '#inicio' }, { label: 'Blog' }],
      }}
      perPage={3}
      posts={[
        'Como escolher o fornecedor certo',
        '7 critérios para avaliar uma proposta',
        'Quando vale investir em automação?',
        'Onde contratar com segurança',
        'Prazos curtos sem perder qualidade',
        'Erros comuns na hora de orçar',
        'Checklist antes de iniciar um projeto',
        'Tendências do setor para o ano',
      ].map((title, index) => ({
        slug: `post-${index}`,
        title,
        excerpt: lorem,
        image: image(index, title),
        date: `${String(28 - index * 3).padStart(2, '0')} de setembro de 2026`,
        category: ['Guias', 'Produção', 'Gestão'][index % 3],
        href: '#post',
      }))}
    />
  ),
  'product-overlay-carousel': () => (
    <ProductOverlayCarousel
      eyebrow="Produtos"
      title="Nossos principais"
      highlight="produtos"
      description="Linhas completas para residências, comércio e indústria, com acabamento sob medida."
      viewAll={{ label: 'Ver todos', href: '#produtos' }}
      items={[
        {
          title: 'Linha Essencial',
          href: '#essencial',
          image: { src: photos[0], alt: 'Linha Essencial' },
        },
        { title: 'Linha Pro', href: '#pro', image: { src: photos[2], alt: 'Linha Pro' } },
        { title: 'Linha Studio', href: '#studio', image: { src: photos[4], alt: 'Linha Studio' } },
        {
          title: 'Linha Industrial',
          href: '#industrial',
          image: { src: photos[5], alt: 'Linha Industrial' },
        },
        {
          title: 'Linha Compacta',
          href: '#compacta',
          image: { src: photos[3], alt: 'Linha Compacta' },
        },
      ]}
    />
  ),
  'holo-card': () => (
    <HoloCard
      image={image(1, 'Retrato da profissional')}
      name="Ana Souza"
      role="Diretora de criação"
      handle="@anasouza"
      status="Disponível"
      action={{ label: 'Contato', href: '#contato' }}
    />
  ),
  'circular-carousel': () => (
    <CircularCarousel
      items={['Residencial', 'Comercial', 'Industrial', 'Hospitalar', 'Educacional', 'Varejo'].map(
        (title, index) => ({
          image: image(index, title),
          title,
          description: 'Projeto entregue com acabamento sob medida.',
        }),
      )}
    />
  ),
  'hueline-product-rails': () => <HuelineProductRails />,
  'hueline-shop-grid': () => <HuelineShopGrid />,
}
