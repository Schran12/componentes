import {
  BlogPostPage,
  CookieBanner,
  FloatingFacebookButton,
  FloatingInstagramButton,
  FloatingLinkedInButton,
  FloatingSocialStack,
  FloatingTikTokButton,
  FloatingWhatsAppButton,
  FloatingXButton,
  FloatingYouTubeButton,
  NavbarFloating,
  ScrollProgress,
  ScrollToTopButton,
  TeamSection,
} from '@/components/library'
import {
  blogPost,
  blogPostAside,
  blogPostBreadcrumbs,
  blogRelatedPosts,
  brand,
  navigationItems,
  teamMembers,
} from './shared'
import type { PreviewMap } from './types'

/**
 * Versões "de página" dos previews que no catálogo funcionam como vitrine de variantes.
 * O construtor de páginas usa estas no lugar do preview quando existem.
 */
export const pageExamples: PreviewMap = {
  'navbar-floating': () => (
    <NavbarFloating
      brand={brand}
      items={navigationItems}
      actions={[{ label: 'Começar', href: '#contato' }]}
    />
  ),
  'floating-whatsapp-button': () => (
    <FloatingWhatsAppButton phone="5511999999999" message="Olá! Vim pelo site." />
  ),
  'floating-instagram-button': () => <FloatingInstagramButton href="https://instagram.com" />,
  'floating-facebook-button': () => <FloatingFacebookButton href="https://facebook.com" />,
  'floating-linkedin-button': () => <FloatingLinkedInButton href="https://linkedin.com" />,
  'floating-youtube-button': () => <FloatingYouTubeButton href="https://youtube.com" />,
  'floating-tiktok-button': () => <FloatingTikTokButton href="https://tiktok.com" />,
  'floating-x-button': () => <FloatingXButton href="https://x.com" />,
  'floating-social-stack': () => (
    <FloatingSocialStack
      items={[
        { network: 'instagram', href: 'https://instagram.com' },
        { network: 'facebook', href: 'https://facebook.com' },
        { network: 'linkedin', href: 'https://linkedin.com' },
      ]}
    />
  ),
  'scroll-to-top-button': () => <ScrollToTopButton position="static" />,
  'scroll-progress': () => <ScrollProgress />,
  'cookie-banner': () => (
    <CookieBanner
      title="Preferências de privacidade"
      description="Usamos cookies para melhorar sua experiência."
      privacyLink={{ label: 'Ler política', href: '/privacidade' }}
      onConsent={(consent) => localStorage.setItem('cookie-consent', consent)}
      dismissible
    />
  ),
  'team-section': () => (
    <TeamSection
      variant="overlay"
      eyebrow="Equipe"
      title="Pessoas por trás de cada entrega"
      description="Especialistas que acompanham o seu projeto do diagnóstico ao suporte."
      members={teamMembers.slice(0, 4)}
      action={{ label: 'Trabalhe conosco', href: '#carreiras' }}
    />
  ),
  'blog-post-page': () => (
    <BlogPostPage
      layout="classic"
      breadcrumbs={blogPostBreadcrumbs}
      aside={blogPostAside}
      post={blogPost}
      related={blogRelatedPosts}
    />
  ),
}
