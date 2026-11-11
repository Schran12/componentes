import {
  AnnouncementBar,
  TopBarContacts,
  BreadcrumbsChevron,
  BreadcrumbsContained,
  BreadcrumbsInverted,
  BreadcrumbsMobileBack,
  BreadcrumbsMobileScroll,
  BreadcrumbsPills,
  BreadcrumbsSlash,
  BreadcrumbsSteps,
  BreadcrumbsUnderline,
  ContactInfoBar,
  FloatingFacebookButton,
  FloatingInstagramButton,
  FloatingLinkedInButton,
  FloatingSocialStack,
  FloatingTikTokButton,
  FloatingWhatsAppButton,
  FloatingXButton,
  FloatingYouTubeButton,
  FooterAccent,
  FooterColumns,
  FooterCompact,
  FooterContactColumns,
  MobileDrawer,
  NavbarAccent,
  NavbarCentered,
  NavbarFloating,
  NavbarMega,
  NavbarMinimal,
  NavbarPill,
  NavbarSimple,
  NavbarSplitLogo,
  NavigationDropdown,
  PillNav,
  ScrollToTopButton,
  HuelineNavbar,
  VeloriaNavbar,
  NimbusNavbar,
  NimbusFooter,
  HuelineFooter,
  KresnaFooter,
} from '@/components/library'
import { Button } from '@/components/ui/button'
import {
  Boxes,
  Clock,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Rocket,
} from 'lucide-react'
import { useState } from 'react'
import { brand, logo, lorem, navigationItems, navItems, socials } from './shared'
import type { PreviewMap } from './types'

function ScrollToTopPreview() {
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null)

  return (
    <div className="relative h-56 overflow-hidden rounded-xl border">
      <div ref={setScrollEl} className="h-full overflow-auto p-4">
        <p className="text-sm font-medium">Role para ver o anel acompanhar o progresso.</p>
        <div className="mt-4 space-y-3 text-sm text-muted-foreground">
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index}>
              Bloco de conteúdo {index + 1} — o anel de rolagem preenche conforme você desce.
            </p>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute bottom-3 right-3">
          <ScrollToTopButton position="static" scrollContainer={scrollEl} threshold={24} />
        </div>
      </div>
    </div>
  )
}

export const navigationPreviews: PreviewMap = {
  'announcement-bar': () => (
    <AnnouncementBar
      message="A biblioteca ganhou 12 novos componentes."
      action={{ label: 'Ver novidades', href: '#catalogo' }}
      variant="accent"
      dismissible
      onDismiss={() => undefined}
      className="rounded-xl"
    />
  ),
  'top-bar': () => (
    <TopBarContacts
      phone="(11) 4000-0000"
      email="contato@norte.com"
      hours="Seg a sex, 8h às 18h"
      className="rounded-xl"
    />
  ),
  'breadcrumbs-chevron': () => (
    <BreadcrumbsChevron
      items={[
        { label: 'Início', href: '#inicio' },
        { label: 'Produtos', href: '#produtos' },
        { label: 'Linha Essencial', href: '#linha' },
        { label: 'Modelo Compacto' },
      ]}
    />
  ),
  'breadcrumbs-slash': () => (
    <BreadcrumbsSlash
      items={[
        { label: 'Início', href: '#inicio' },
        { label: 'Produtos', href: '#produtos' },
        { label: 'Linha Essencial', href: '#linha' },
        { label: 'Modelo Compacto' },
      ]}
    />
  ),
  'breadcrumbs-contained': () => (
    <BreadcrumbsContained
      items={[
        { label: 'Início', href: '#inicio' },
        { label: 'Produtos', href: '#produtos' },
        { label: 'Linha Essencial', href: '#linha' },
        { label: 'Modelo Compacto' },
      ]}
    />
  ),
  'breadcrumbs-pills': () => (
    <BreadcrumbsPills
      items={[
        { label: 'Início', href: '#inicio' },
        { label: 'Produtos', href: '#produtos' },
        { label: 'Linha Essencial', href: '#linha' },
        { label: 'Modelo Compacto' },
      ]}
    />
  ),
  'breadcrumbs-steps': () => (
    <BreadcrumbsSteps
      items={[
        { label: 'Início', href: '#inicio' },
        { label: 'Produtos', href: '#produtos' },
        { label: 'Linha Essencial', href: '#linha' },
        { label: 'Modelo Compacto' },
      ]}
    />
  ),
  'breadcrumbs-underline': () => (
    <BreadcrumbsUnderline
      items={[
        { label: 'Início', href: '#inicio' },
        { label: 'Produtos', href: '#produtos' },
        { label: 'Linha Essencial', href: '#linha' },
        { label: 'Modelo Compacto' },
      ]}
    />
  ),
  'breadcrumbs-mobile-back': () => (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Reduza a largura da tela para ver o modo “← voltar”.
      </p>
      <BreadcrumbsMobileBack
        items={[
          { label: 'Início', href: '#inicio' },
          { label: 'Produtos', href: '#produtos' },
          { label: 'Linha Essencial', href: '#linha' },
          { label: 'Modelo Compacto' },
        ]}
      />
    </div>
  ),
  'breadcrumbs-mobile-scroll': () => (
    <div className="max-w-xs">
      <BreadcrumbsMobileScroll
        items={[
          { label: 'Início', href: '#inicio' },
          { label: 'Produtos', href: '#produtos' },
          { label: 'Linha Essencial', href: '#linha' },
          { label: 'Acessórios', href: '#acessorios' },
          { label: 'Modelo Compacto' },
        ]}
      />
    </div>
  ),
  'breadcrumbs-inverted': () => (
    <div className="rounded-2xl bg-primary p-5">
      <BreadcrumbsInverted
        items={[
          { label: 'Início', href: '#inicio' },
          { label: 'Produtos', href: '#produtos' },
          { label: 'Linha Essencial', href: '#linha' },
          { label: 'Modelo Compacto' },
        ]}
      />
    </div>
  ),
  'mobile-drawer': () => (
    <div className="flex min-h-28 items-center justify-center">
      <MobileDrawer
        brand={brand}
        items={navigationItems}
        actions={[{ label: 'Contato', href: '#catalogo' }]}
        trigger={
          <Button type="button" variant="outline">
            <Menu className="mr-2 h-4 w-4" />
            Abrir menu móvel
          </Button>
        }
      />
    </div>
  ),
  'navbar-simple': () => (
    <NavbarSimple
      brand={brand}
      items={navigationItems}
      actions={[{ label: 'Contato', href: '#catalogo' }]}
      className="rounded-xl border"
    />
  ),
  'navbar-centered': () => (
    <NavbarCentered
      brand={brand}
      items={[...navigationItems, { label: 'Conteúdos', href: '#conteudos' }]}
      actions={[{ label: 'Começar', href: '#catalogo' }]}
      className="rounded-xl border"
    />
  ),
  'navbar-pill': () => (
    <NavbarPill
      brand={brand}
      items={navigationItems}
      action={{ label: 'Fale conosco', href: '#contato' }}
      theme="dark"
    />
  ),
  'navbar-minimal': () => (
    <NavbarMinimal
      brand={brand}
      items={navigationItems}
      action={{ label: 'Começar', href: '#catalogo' }}
      theme="light"
      hideBrandLabel={false}
    />
  ),
  'navbar-mega': () => (
    <NavbarMega
      brand={brand}
      items={[
        {
          label: 'Soluções',
          href: '#solucoes',
          children: [
            {
              label: 'Estratégia',
              href: '#estrategia',
              description: 'Direção clara para crescer.',
              icon: <Rocket className="h-4 w-4" />,
            },
            {
              label: 'Tecnologia',
              href: '#tecnologia',
              description: 'Produtos digitais consistentes.',
              icon: <Boxes className="h-4 w-4" />,
            },
          ],
        },
        { label: 'Empresa', href: '#empresa' },
      ]}
      actions={[{ label: 'Contato', href: '#catalogo' }]}
      className="rounded-xl border"
    />
  ),
  'footer-columns': () => (
    <FooterColumns
      brand={brand}
      description="Produtos digitais claros, acessíveis e preparados para evoluir."
      columns={[
        {
          title: 'Produto',
          links: [
            { label: 'Recursos', href: '#recursos' },
            { label: 'Preços', href: '#precos' },
          ],
        },
        {
          title: 'Empresa',
          links: [
            { label: 'Sobre', href: '#empresa' },
            { label: 'Contato', href: '#catalogo' },
          ],
        },
        {
          title: 'Conteúdo',
          links: [
            { label: 'Blog', href: '#blog' },
            { label: 'Guias', href: '#guias' },
          ],
        },
      ]}
      legalLinks={[{ label: 'Privacidade', href: '#privacidade' }]}
      className="rounded-xl"
    />
  ),
  'footer-compact': () => (
    <FooterCompact
      brand={brand}
      links={[
        { label: 'Componentes', href: '#catalogo' },
        { label: 'Documentação', href: '#documentacao' },
      ]}
      socialLinks={[
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com',
          icon: <Linkedin className="h-4 w-4" />,
        },
      ]}
      className="rounded-xl"
    />
  ),
  'navbar-floating': () => (
    <div className="rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 p-2">
      <NavbarFloating
        brand={brand}
        items={navigationItems.slice(0, 2)}
        actions={[{ label: 'Começar', href: '#contato' }]}
      />
    </div>
  ),
  'navigation-dropdown': () => (
    <div className="flex min-h-40 items-start justify-center pt-8">
      <NavigationDropdown
        label="Soluções"
        heading="Explore a biblioteca"
        variant="rich"
        items={[
          {
            label: 'Componentes',
            href: '#catalogo',
            description: 'Elementos pequenos e reutilizáveis.',
            icon: <Boxes className="h-4 w-4" />,
          },
          {
            label: 'Seções',
            href: '/como-utilizar',
            description: 'Composições completas prontas para páginas.',
            icon: <Layers3 className="h-4 w-4" />,
          },
        ]}
      />
    </div>
  ),
  'contact-info-bar': () => (
    <ContactInfoBar
      items={[
        { label: 'Local', value: 'São Paulo' },
        { label: 'E-mail', value: 'contato@empresa.com' },
        { label: 'Horário', value: '8:30 — 17:30' },
      ]}
      className="rounded-xl"
    />
  ),
  'navbar-accent': () => (
    <NavbarAccent
      logo={logo}
      items={[
        { label: 'Home', href: '#' },
        { label: 'Empresa', href: '#empresa' },
        {
          label: 'Tratamentos',
          href: '#tratamentos',
          children: [
            { label: 'Galvanização Eletrolítica', href: '#galvanizacao' },
            { label: 'Decapagem de Latão', href: '#decapagem' },
            { label: 'Fosfatização a Seco', href: '#fosfatizacao-seco' },
            { label: 'Fosfatização Oleada', href: '#fosfatizacao-oleada' },
          ],
        },
        { label: 'Contato', href: '#contato' },
      ]}
      position="static"
      cta={{ label: 'Solicitar orçamento', href: '#contato' }}
      topbar={{
        phone: '(11) 4000-0000',
        email: 'comercial@exemplo.com',
        hours: 'Segunda a quinta, 07h às 17h · Sexta, 07h às 16h',
      }}
      socialLinks={socials}
    />
  ),
  'footer-accent': () => (
    <FooterAccent
      logo={<span className="text-lg font-bold text-white">Norte</span>}
      description={lorem}
      socialLinks={socials}
      columns={[
        { title: 'Navegação', links: navItems.map(({ label, href }) => ({ label, href })) },
        {
          title: 'Recursos',
          links: [
            { label: 'Blog', href: '#' },
            { label: 'Mapa do site', href: '#' },
          ],
        },
      ]}
      legalLinks={[{ label: 'Política de privacidade', href: '#' }]}
    />
  ),
  'scroll-to-top-button': () => <ScrollToTopPreview />,
  'floating-whatsapp-button': () => (
    <div className="flex items-center justify-center gap-4 py-6">
      <FloatingWhatsAppButton
        phone="5511999999999"
        message="Olá! Vim pelo site."
        className="!static"
      />
      <span className="text-sm text-muted-foreground">Fixo no canto inferior direito.</span>
    </div>
  ),
  'floating-instagram-button': () => (
    <div className="flex items-center justify-center gap-4 py-6">
      <FloatingInstagramButton href="https://instagram.com" position="static" />
      <span className="text-sm text-muted-foreground">Fixo no canto inferior direito.</span>
    </div>
  ),
  'floating-facebook-button': () => (
    <div className="flex items-center justify-center gap-4 py-6">
      <FloatingFacebookButton href="https://facebook.com" position="static" />
      <span className="text-sm text-muted-foreground">Fixo no canto inferior direito.</span>
    </div>
  ),
  'floating-linkedin-button': () => (
    <div className="flex items-center justify-center gap-4 py-6">
      <FloatingLinkedInButton href="https://linkedin.com" position="static" />
      <span className="text-sm text-muted-foreground">Fixo no canto inferior direito.</span>
    </div>
  ),
  'floating-youtube-button': () => (
    <div className="flex items-center justify-center gap-4 py-6">
      <FloatingYouTubeButton href="https://youtube.com" position="static" />
      <span className="text-sm text-muted-foreground">Fixo no canto inferior direito.</span>
    </div>
  ),
  'floating-tiktok-button': () => (
    <div className="flex items-center justify-center gap-4 py-6">
      <FloatingTikTokButton href="https://tiktok.com" position="static" />
      <span className="text-sm text-muted-foreground">Fixo no canto inferior direito.</span>
    </div>
  ),
  'floating-x-button': () => (
    <div className="flex items-center justify-center gap-4 py-6">
      <FloatingXButton href="https://x.com" position="static" />
      <span className="text-sm text-muted-foreground">Fixo no canto inferior direito.</span>
    </div>
  ),
  'floating-social-stack': () => (
    <div className="flex flex-col items-center gap-3 py-6">
      <FloatingSocialStack
        position="static"
        items={[
          { network: 'instagram', href: 'https://instagram.com' },
          { network: 'facebook', href: 'https://facebook.com' },
          { network: 'linkedin', href: 'https://linkedin.com' },
          { network: 'youtube', href: 'https://youtube.com' },
        ]}
      />
      <span className="text-sm text-muted-foreground">
        Pilha vertical no canto inferior direito.
      </span>
    </div>
  ),
  'navbar-split-logo': () => (
    <NavbarSplitLogo
      position="static"
      logo={<span className="text-lg font-semibold tracking-[0.35em]">NORTE</span>}
      items={navItems}
      socialLinks={socials}
      cta={{ label: 'Orçamento', href: '#contato' }}
    />
  ),
  'footer-contact-columns': () => (
    <FooterContactColumns
      logo={<span className="text-2xl font-bold tracking-tight">Norte</span>}
      brandName="Norte"
      description="Especializada em galvanização, zincagem eletrolítica, fosfatização e tratamentos de superfície para peças metálicas — proteção contra corrosão e maior durabilidade."
      columns={[
        {
          title: 'Serviços',
          links: [
            { label: 'Galvanização Eletrolítica', href: '#galvanizacao' },
            { label: 'Decapagem de Latão', href: '#decapagem' },
            { label: 'Fosfatização a Seco', href: '#fosfatizacao-seco' },
            { label: 'Fosfatização Oleada', href: '#fosfatizacao-oleada' },
          ],
        },
        {
          title: 'Institucional',
          links: [
            { label: 'Empresa', href: '#empresa' },
            { label: 'Contato', href: '#contato' },
            { label: 'Política de Privacidade', href: '#' },
            { label: 'Mapa do Site', href: '#' },
          ],
        },
      ]}
      contact={{
        items: [
          { icon: <Phone />, label: '(11) 4000-0000', href: 'tel:+551140000000' },
          {
            icon: <MessageCircle />,
            label: '(11) 99999-9999',
            href: 'https://wa.me/5511999999999',
          },
          { icon: <Mail />, label: 'contato@norte.com', href: 'mailto:contato@norte.com' },
          { icon: <MapPin />, label: 'Av. Paulista, 1000\nBela Vista, São Paulo - SP' },
          { icon: <Clock />, label: 'Segunda a sexta: 8h30 às 17h30\nSábado: 8h às 12h' },
        ],
      }}
    />
  ),
  'hueline-navbar': () => (
    <div className="relative min-h-24 bg-[#16141a]">
      <HuelineNavbar scrolled={false} overDark savedCount={1} bagCount={2} fixed={false} />
    </div>
  ),
  'veloria-navbar': () => (
    <div className="relative min-h-28">
      <VeloriaNavbar fixed={false} />
    </div>
  ),
  'nimbus-navbar': () => (
    <div className="relative min-h-28 overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusNavbar />
    </div>
  ),
  'nimbus-footer': () => (
    <div className="overflow-hidden rounded-xl bg-[#05060f]">
      <NimbusFooter />
    </div>
  ),
  'hueline-footer': () => <HuelineFooter />,
  'kresna-footer': () => <KresnaFooter height={560} className="rounded-xl" />,
  'pill-nav': () => (
    <div className="flex min-h-32 items-center justify-center">
      <PillNav
        activeHref="#inicio"
        logo={<span className="text-sm font-black">B</span>}
        items={[
          { label: 'Início', href: '#inicio' },
          { label: 'Sobre', href: '#sobre' },
          { label: 'Serviços', href: '#servicos' },
          { label: 'Contato', href: '#contato' },
        ]}
      />
    </div>
  ),
}
