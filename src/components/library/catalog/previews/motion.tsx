import {
  AnimatedList,
  AutoAnimateGallerySection,
  Counter,
  DepthText,
  FluxLines,
  GSAPStorySection,
  HoverTiltCard,
  MagneticHover,
  Marquee,
  MorphingTabs,
  MotionReveal,
  NumberTicker,
  PageReveal,
  ParallaxMedia,
  ParallaxStorySection,
  Reveal,
  ScrollProgress,
  SocialChannelMarquee,
  SpecularButton,
  SpotlightCard,
  Stagger,
  SwiperShowcaseSection,
  TextLoop,
  LiquidButtons,
  IridescentRingPill,
} from '@/components/library'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, Sparkles, Zap } from 'lucide-react'
import { imageOne, imageThree, imageTwo } from './shared'
import type { PreviewMap } from './types'

export const motionPreviews: PreviewMap = {
  counter: () => (
    <div className="grid grid-cols-3 gap-3 text-center">
      {[
        [98, '%'],
        [42, '+'],
        [7, ' dias'],
      ].map(([value, suffix]) => (
        <div className="rounded-xl border bg-background p-4" key={String(suffix)}>
          <Counter
            value={Number(value)}
            suffix={String(suffix)}
            trigger="mount"
            className="text-3xl font-bold text-primary"
          />
        </div>
      ))}
    </div>
  ),
  'magnetic-hover': () => (
    <div className="flex min-h-28 items-center justify-center">
      <MagneticHover>
        <Button className="rounded-full">Mova o ponteiro</Button>
      </MagneticHover>
    </div>
  ),
  marquee: () => (
    <Marquee ariaLabel="Recursos da biblioteca" className="py-4">
      {['Responsiva', 'Acessível', 'Tipada', 'Componível'].map((label) => (
        <span
          className="rounded-full border bg-background px-5 py-2 text-sm font-medium"
          key={label}
        >
          {label}
        </span>
      ))}
    </Marquee>
  ),
  'parallax-media': () => (
    <ParallaxMedia className="h-56 rounded-2xl" mediaClassName="h-[120%]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageThree}
        alt="Painel analítico em uma tela"
        className="h-full w-full object-cover"
      />
    </ParallaxMedia>
  ),
  reveal: () => (
    <Reveal trigger="mount" direction="up">
      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-8 text-primary-foreground">
        <Sparkles className="mb-3 h-6 w-6" />
        <p className="font-semibold">Entrada suave com preferência de movimento respeitada.</p>
      </div>
    </Reveal>
  ),
  stagger: () => (
    <Stagger trigger="mount" className="grid grid-cols-3 gap-3">
      {['Estratégia', 'Design', 'Tecnologia'].map((item) => (
        <div
          className="rounded-xl border bg-background p-4 text-center text-sm font-medium"
          key={item}
        >
          {item}
        </div>
      ))}
    </Stagger>
  ),
  'animated-list': () => (
    <AnimatedList
      initialItems={[
        { id: 'estrategia', title: 'Estratégia', description: 'Objetivos e arquitetura.' },
        { id: 'design', title: 'Design', description: 'Interface e experiência.' },
      ]}
    />
  ),
  'hover-tilt-card': () => (
    <div className="p-3">
      <HoverTiltCard className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl">
        <Sparkles className="h-6 w-6 text-violet-400" />
        <p className="mt-8 text-xl font-semibold">Mova o cursor</p>
        <p className="mt-1 text-sm text-white/60">Inclinação e reflexo em tempo real.</p>
      </HoverTiltCard>
    </div>
  ),
  'morphing-tabs': () => (
    <MorphingTabs
      items={[
        { id: 'design', label: 'Design', content: <p>Interfaces claras e consistentes.</p> },
        { id: 'motion', label: 'Motion', content: <p>Movimento com intenção e contexto.</p> },
      ]}
    />
  ),
  'motion-reveal': () => (
    <MotionReveal direction="up" once={false}>
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 p-7 text-white">
        <p className="font-semibold">Revelação pela viewport.</p>
      </div>
    </MotionReveal>
  ),
  'number-ticker': () => (
    <div className="py-8 text-center">
      <NumberTicker
        value={98.7}
        decimals={1}
        suffix="%"
        className="text-5xl font-bold text-primary"
      />
      <p className="mt-2 text-xs text-muted-foreground">Resultado animado</p>
    </div>
  ),
  'scroll-progress': () => (
    <div className="relative overflow-hidden rounded-2xl border bg-background p-8 text-center">
      <ScrollProgress className="!absolute" />
      <ArrowUpRight className="mx-auto h-7 w-7 rotate-45 text-primary" />
      <p className="mt-3 font-semibold">Indicador de leitura</p>
      <p className="mt-1 text-xs text-muted-foreground">Vinculado ao scroll da página.</p>
    </div>
  ),
  'spotlight-card': () => (
    <SpotlightCard className="bg-slate-950 p-7 text-white">
      <Zap className="h-6 w-6 text-blue-400" />
      <p className="mt-8 text-xl font-semibold">Spotlight interativo</p>
      <p className="mt-1 text-sm text-white/60">A luz acompanha o cursor.</p>
    </SpotlightCard>
  ),
  'text-loop': () => (
    <div className="flex min-h-32 items-center justify-center">
      <TextLoop
        prefix="Experiências"
        words={['modernas', 'rápidas', 'memoráveis']}
        className="text-2xl font-bold"
      />
    </div>
  ),
  'parallax-story-section': () => (
    <ParallaxStorySection
      eyebrow="Parallax"
      title="Camadas que acompanham a narrativa."
      description="Imagens se movem em profundidades diferentes conforme o scroll."
      primaryImage={{ src: imageTwo, alt: 'Equipe em colaboração' }}
      secondaryImage={{ src: imageThree, alt: 'Interface digital' }}
      action={{ label: 'Explorar história', href: '#catalogo' }}
      depth="subtle"
      className="!py-12 [&_.container]:!px-0"
    />
  ),
  'gsap-story-section': () => (
    <GSAPStorySection
      eyebrow="GSAP ScrollTrigger"
      title="Uma jornada em capítulos."
      description="Cards revelados progressivamente pelo movimento da página."
      pinHeading={false}
      items={[
        {
          id: 'descoberta',
          title: 'Descoberta',
          description: 'Contexto, objetivos e oportunidades.',
          image: { src: imageOne, alt: 'Descoberta do projeto' },
        },
        {
          id: 'evolucao',
          title: 'Evolução',
          description: 'Aprendizado contínuo orientado por resultados.',
          image: { src: imageThree, alt: 'Evolução do produto' },
        },
      ]}
      className="!py-12 [&_.container]:!px-0"
    />
  ),
  'swiper-showcase-section': () => (
    <SwiperShowcaseSection
      title="Projetos em destaque"
      theme="dark"
      items={[
        {
          id: 'produto',
          eyebrow: 'Produto',
          title: 'Experiência integrada',
          description: 'Uma narrativa visual com transições creative.',
          image: { src: imageThree, alt: 'Produto digital' },
        },
        {
          id: 'pessoas',
          eyebrow: 'Pessoas',
          title: 'Colaboração real',
          description: 'Navegação lateral sincronizada com os slides.',
          image: { src: imageTwo, alt: 'Equipe colaborando' },
        },
      ]}
      className="!py-12 [&_.container]:!px-0"
    />
  ),
  'auto-animate-gallery-section': () => (
    <AutoAnimateGallerySection
      title="Galeria inteligente"
      columns={2}
      items={[
        {
          id: 'auto-1',
          title: 'Projeto Atlas',
          category: 'Produto',
          image: { src: imageThree, alt: 'Projeto Atlas' },
        },
        {
          id: 'auto-2',
          title: 'Projeto Norte',
          category: 'Marca',
          image: { src: imageOne, alt: 'Projeto Norte' },
        },
        {
          id: 'auto-3',
          title: 'Projeto Lumen',
          category: 'Produto',
          image: { src: imageTwo, alt: 'Projeto Lumen' },
        },
      ]}
      className="!py-12 [&_.container]:!px-0"
    />
  ),
  'social-channel-marquee': () => (
    <SocialChannelMarquee
      title="Conecte seus canais favoritos."
      channels={[
        { name: 'Instagram', color: '#d62976' },
        { name: 'LinkedIn', color: '#0a66c2' },
        { name: 'YouTube', color: '#ff0033' },
        { name: 'TikTok', color: '#111111' },
      ]}
      className="rounded-xl !py-12"
    />
  ),
  'page-reveal': () => (
    <PageReveal className="space-y-4 bg-slate-50 p-6">
      <h3 data-reveal="up" className="text-xl font-semibold">
        Elementos com data-reveal
      </h3>
      <ul data-reveal-stagger="up" className="grid gap-3 sm:grid-cols-3">
        {['Primeiro', 'Segundo', 'Terceiro'].map((label) => (
          <li key={label} className="rounded-lg border bg-white p-4 text-sm">
            {label}
          </li>
        ))}
      </ul>
    </PageReveal>
  ),
  'smooth-scroll': () => (
    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
      Renderize <code>&lt;SmoothScroll /&gt;</code> uma única vez no layout raiz para ativar a
      rolagem suave global (Lenis + GSAP).
    </div>
  ),
  'flux-lines': () => (
    <FluxLines className="flex min-h-[340px] items-center rounded-2xl">
      <div className="px-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
          Fluxo contínuo
        </p>
        <h3 className="mt-3 max-w-sm text-3xl font-bold tracking-tight">
          Passe o cursor sobre as linhas.
        </h3>
      </div>
    </FluxLines>
  ),
  'depth-text': () => (
    <div className="flex min-h-48 items-center justify-center">
      <DepthText text="BLOOMIN" as="h3" className="text-6xl sm:text-7xl" />
    </div>
  ),
  'specular-button': () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex min-h-40 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)),#020617_70%)] p-6">
        <SpecularButton size="lg">Começar agora</SpecularButton>
      </div>
      <div className="flex min-h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-secondary p-6">
        <SpecularButton tone="light" size="lg">
          Ver projetos
        </SpecularButton>
      </div>
    </div>
  ),
  'liquid-buttons': () => <LiquidButtons height={420} className="rounded-xl border-0" />,
  'iridescent-ring-pill': () => (
    <IridescentRingPill label="Explore the drop" href="#explore" className="rounded-xl" />
  ),
}
