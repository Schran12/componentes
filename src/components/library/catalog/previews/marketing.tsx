import {
  AgencyHeroSection,
  BannerCarousel,
  BannerEditorial,
  BannerImage,
  BannerImmersive,
  BannerSplit,
  BannerVideo,
  CommandLauncherHero,
  FintechHeroSection,
  FloatingIllustrationHero,
  ImageOverlayHero,
  InvestmentHeroCarousel,
  PageHeader,
  PillarsHero,
  ProgressBannerCarousel,
  PromoCouponCarousel,
  SocialWorkspaceHero,
  HuelineHero,
  HuelinePageDemo,
  VeloriaHero,
  VeloriaPageDemo,
  NimbusHero,
  NimbusPageDemo,
  NimbusCta,
} from '@/components/library'
import { Award, ShieldCheck, Sparkles } from 'lucide-react'
import { imageOne, imageThree, imageTwo, lorem, photos, socials } from './shared'
import type { PreviewMap } from './types'

export const marketingPreviews: PreviewMap = {
  'banner-image': () => (
    <BannerImage
      eyebrow="Still 3D"
      title="Personagem no sofá, parede cobalto"
      description="Render estilizado Pixar / Illumination — superfícies matte, iluminação suave, sem grão fotográfico."
      image={{
        src: imageOne,
        alt: 'Personagem 3D sentado no sofá creme em frente a parede azul cobalto',
      }}
      primaryAction={{ label: 'Ver banner', href: '#catalogo' }}
      secondaryAction={{ label: 'Ver navbar', href: '#navbar' }}
      className="!min-h-[420px] rounded-xl [&>div:last-child]:!min-h-[420px]"
    />
  ),
  'banner-split': () => (
    <BannerSplit
      eyebrow="Design system"
      title="Uma base sólida para criar mais rápido"
      description="Blocos tipados e responsivos para páginas institucionais consistentes."
      image={{ src: imageThree, alt: 'Painel de produto digital' }}
      action={{ label: 'Explorar biblioteca', href: '#catalogo' }}
      className="rounded-xl [&>div]:!min-h-0 [&>div]:!py-10"
    />
  ),
  'banner-video': () => (
    <BannerVideo
      eyebrow="Em movimento"
      title="Comunicação com presença"
      description="Um hero cinematográfico com fallback visual e chamada objetiva."
      videoSrc="/catalog-preview.mp4"
      poster={imageTwo}
      action={{ label: 'Ver possibilidades', href: '#catalogo' }}
      className="!min-h-[420px] rounded-xl [&>div:last-child]:!min-h-[420px]"
    />
  ),
  'banner-carousel': () => (
    <BannerCarousel
      autoplayDelay={false}
      slides={[
        {
          id: 'clareza',
          title: 'Clareza em cada interação',
          description: 'Componentes preparados para conteúdo real.',
          image: { src: imageOne, alt: 'Mesa de trabalho criativa' },
          action: { label: 'Explorar', href: '#catalogo' },
        },
        {
          id: 'escala',
          title: 'Consistência em escala',
          image: { src: imageThree, alt: 'Dashboard de indicadores' },
        },
      ]}
      className="overflow-hidden rounded-xl [&_.swiper]:!min-h-[420px] [&_article]:!min-h-[420px]"
    />
  ),
  'page-header': () => (
    <PageHeader
      eyebrow="Biblioteca"
      title="Componentes institucionais"
      description="Uma base pronta para páginas claras e confiáveis."
      breadcrumbs={[{ label: 'Início', href: '#inicio' }, { label: 'Componentes' }]}
      className="rounded-2xl !border"
    />
  ),
  'banner-immersive': () => (
    <BannerImmersive
      image={{
        src: imageOne,
        alt: 'Ambiente de escritório com equipe em reunião',
      }}
      eyebrow="Experiências memoráveis"
      title="Experiências memoráveis"
      description="Banner fotográfico de alto impacto — combine com um componente de Navbars."
      symbol={<Sparkles className="h-14 w-14" strokeWidth={1.2} />}
      actions={[
        { label: 'Começar', href: '#catalogo', variant: 'light' },
        { label: 'Saiba mais', href: '#sobre', variant: 'outline' },
      ]}
      className="!min-h-[520px] rounded-xl [&>div:last-child]:!min-h-[440px]"
    />
  ),
  'banner-editorial': () => (
    <BannerEditorial
      eyebrow="Explore"
      title={
        <>
          Descubra novos
          <br />
          caminhos
        </>
      }
      description="Tipografia expressiva e mídia assimétrica para campanhas com personalidade."
      images={[
        { src: imageThree, alt: 'Produto editorial' },
        { src: imageOne, alt: 'Experiência visual' },
      ]}
      primaryAction={{ label: 'Começar', href: '#catalogo' }}
      secondaryAction={{ label: 'Saiba mais', href: '#catalogo' }}
      className="rounded-xl [&>div]:!min-h-[560px] [&>div]:!py-12"
    />
  ),
  'agency-hero-section': () => (
    <AgencyHeroSection
      eyebrow="Biblioteca"
      title="Componentes mais claros,"
      highlightedText="marcantes e reutilizáveis."
      description="Uma abertura editorial com identidade forte e configuração por props."
      image={{ src: imageOne, alt: 'Projeto digital' }}
      primaryAction={{ label: 'Explorar', href: '#catalogo' }}
      secondaryAction={{ label: 'Como instalar', href: '/como-utilizar' }}
      highlights={['TypeScript', 'Tailwind', 'Motion']}
      className="rounded-xl !py-12 [&_.container]:!px-0"
    />
  ),
  'fintech-hero-section': () => (
    <FintechHeroSection
      eyebrow="Infraestrutura digital"
      title="Tecnologia para"
      highlightedText="crescer com clareza."
      description="Uma abertura densa com argumentos, métricas e visual de produto."
      primaryAction={{ label: 'Começar', href: '#catalogo' }}
      secondaryAction={{ label: 'Ver recursos', href: '#recursos' }}
      metrics={[
        { value: '135+', label: 'Mercados' },
        { value: '99,99%', label: 'Disponibilidade' },
        { value: '24/7', label: 'Operação' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'investment-hero-carousel': () => (
    <InvestmentHeroCarousel
      autoplayDelay={false}
      slides={[
        {
          id: 'value',
          eyebrow: 'Investimentos',
          title: 'Valor sustentável para o longo prazo.',
          description: 'Capital paciente, visão compartilhada e crescimento responsável.',
          image: { src: imageTwo, alt: 'Equipe em ambiente profissional' },
          action: { label: 'Conhecer abordagem', href: '#catalogo' },
        },
      ]}
      className="!min-h-[520px] rounded-xl [&_article>div:last-child]:!min-h-[520px] [&_article]:!min-h-[520px]"
    />
  ),
  'social-workspace-hero': () => (
    <SocialWorkspaceHero
      eyebrow="Workspace social"
      title="Planeje e publique melhor."
      description="Um hero de SaaS com formulário e visual de calendário."
      channels={['Instagram', 'LinkedIn', 'YouTube']}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'command-launcher-hero': () => (
    <CommandLauncherHero
      eyebrow="Produtividade"
      title="Seu atalho para tudo."
      description="Um hero com launcher pesquisável e comandos acionáveis."
      commands={[
        { id: 'agenda', label: 'Abrir agenda', category: 'Calendário', shortcut: '⌘ A' },
        { id: 'notes', label: 'Criar nota', category: 'Notas', shortcut: '⌘ N' },
        { id: 'focus', label: 'Iniciar foco', category: 'Produtividade', shortcut: '⌘ P' },
      ]}
      className="rounded-xl !py-12 [&_.container]:!px-5"
    />
  ),
  'progress-banner-carousel': () => (
    <ProgressBannerCarousel
      socialLinks={socials}
      slides={[1, 2, 3].map((index) => ({
        id: String(index),
        eyebrow: 'Infraestrutura',
        title: `Banner de destaque ${index}`,
        description: lorem,
        image: { src: photos[index + 2], alt: '' },
        mobileImage: photos[index + 2],
        action: { label: 'Saiba mais', href: '#' },
      }))}
    />
  ),
  'floating-illustration-hero': () => (
    <FloatingIllustrationHero
      title="Hospedagem rápida e segura"
      description={lorem}
      illustration={{ src: photos[3], alt: '', width: 560, height: 420 }}
      actions={[
        { label: 'Começar', href: '#' },
        { label: 'Ver planos', href: '#' },
      ]}
    />
  ),
  'image-overlay-hero': () => (
    <ImageOverlayHero
      eyebrow="Contato"
      title="Fale com nosso time técnico"
      description={lorem}
      image={{ src: photos[5], alt: '' }}
      breadcrumbs={[{ label: 'Início', href: '#' }, { label: 'Contato' }]}
      tone="industrial"
    />
  ),
  'pillars-hero': () => (
    <PillarsHero
      eyebrow="Galvanização e tratamento de superfície"
      title="Empresa de galvanização e tratamento de superfície em São Paulo"
      description="Há mais de 30 anos protegendo peças metálicas contra corrosão com galvanização, zincagem eletrolítica, fosfatização e outros tratamentos superficiais."
      primaryAction={{ label: 'Solicitar orçamento comercial', href: '#contato' }}
      secondaryAction={{ label: 'Conheça a empresa', href: '#empresa' }}
      chips={['Processo controlado', 'Normas do setor', 'Piloto ao serial']}
      image={{ src: imageTwo, alt: 'Operador inspecionando peças galvanizadas' }}
      stat={{ value: '30+', label: 'Anos protegendo peças metálicas em São Paulo.' }}
      pillars={[
        {
          title: 'Confiabilidade',
          description:
            'Processos com rigor técnico, controle de qualidade e atenção às especificações de cada peça.',
          icon: <ShieldCheck className="h-5 w-5" />,
        },
        {
          title: 'Qualidade',
          description:
            'Proteção anticorrosiva, aderência e uniformidade de acabamento para produção em série.',
          icon: <Sparkles className="h-5 w-5" />,
        },
        {
          title: 'Tradição',
          description:
            'Mais de três décadas atendendo metalúrgicas, automotivo, ferragens e componentes industriais.',
          icon: <Award className="h-5 w-5" />,
        },
      ]}
    />
  ),
  'hueline-hero': () => (
    <div className="max-h-[520px] overflow-hidden">
      <HuelineHero />
    </div>
  ),
  'hueline-page-demo': () => <HuelinePageDemo />,
  'veloria-hero': () => (
    <div className="max-h-[560px] overflow-hidden">
      <VeloriaHero />
    </div>
  ),
  'veloria-page-demo': () => <VeloriaPageDemo />,
  'nimbus-hero': () => (
    <div className="max-h-[560px] overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusHero />
    </div>
  ),
  'nimbus-page-demo': () => <NimbusPageDemo />,
  'nimbus-cta': () => (
    <div className="overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusCta />
    </div>
  ),
  'promo-coupon-carousel': () => (
    <PromoCouponCarousel
      slides={[
        {
          id: 'dobro',
          badge: 'Segunda e terça',
          title: 'Ingresso em dobro no início da semana',
          description: lorem,
          coupon: 'DOBRO10',
          action: { label: 'Comprar agora', href: '#comprar' },
          image: { src: imageOne, alt: 'Promoção' },
        },
        {
          id: 'infinito',
          badge: 'Quarta e quinta',
          title: 'Aproveite o dia inteiro',
          description: lorem,
          coupon: 'INFINITO',
          action: { label: 'Ver condições', href: '#condicoes' },
          image: { src: imageTwo, alt: 'Promoção' },
        },
        {
          id: 'aniversario',
          badge: 'Aniversário',
          title: 'Celebre com a gente',
          description: lorem,
          image: { src: imageThree, alt: 'Promoção' },
        },
      ]}
    />
  ),
}
