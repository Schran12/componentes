import {
  AccentButton,
  CookieBanner,
  CTABanner,
  CTACenteredCard,
  CTAInline,
  CTASplitPanel,
  DialogShowcase,
  DropdownActions,
  EmptyState,
  ExpandableCards,
  ExpandableTextBox,
  FAQAccordion,
  FAQBordered,
  FAQCards,
  FAQCentered,
  FAQHelpCard,
  FAQSearch,
  FAQSplitCTA,
  InteractiveSteps,
  LoadingSkeleton,
  NotFoundSection,
  NumberedAccordion,
  ProgressSteps,
  SuccessStateCard,
  TabsShowcase,
  TestimonialsAvatarSwitcher,
  TestimonialsCarousel,
  TestimonialsColumns,
  TestimonialsGrid,
  TestimonialsMarquee,
  TestimonialsQuoteSlider,
  TestimonialsSpotlight,
  ToastProvider,
} from '@/components/library'
import { BookOpen, Clipboard, Copy, Home, Inbox, Mail, Package } from 'lucide-react'
import {
  imageOne,
  imageThree,
  imageTwo,
  lorem,
  SheetPreview,
  teamMembers,
  testimonials,
  ToastTrigger,
} from './shared'
import type { PreviewMap } from './types'

export const feedbackPreviews: PreviewMap = {
  'cta-banner': () => (
    <CTABanner
      title="Transforme sua próxima ideia em produto"
      description="Uma base consistente reduz retrabalho e acelera decisões."
      primaryAction={{ label: 'Começar projeto', href: '#catalogo' }}
      secondaryAction={{ label: 'Ver soluções', href: '#solucoes' }}
      className="rounded-xl !py-12"
    />
  ),
  'cookie-banner': () => (
    <div className="relative min-h-64">
      <CookieBanner
        title="Preferências de privacidade"
        description="Usamos cookies para melhorar sua experiência."
        privacyLink={{ label: 'Ler política', href: '#privacidade' }}
        customizeAction={{ label: 'Personalizar', onClick: () => undefined }}
        onConsent={() => undefined}
        dismissible
        className="!absolute !inset-x-0 !bottom-0"
      />
    </div>
  ),
  'cta-inline': () => (
    <CTAInline
      title="Quer acelerar seu próximo projeto?"
      description="Converse com um especialista."
      action={{ label: 'Entrar em contato', href: '#catalogo' }}
    />
  ),
  'dialog-showcase': () => (
    <DialogShowcase
      triggerLabel="Abrir demonstração"
      title="Dialog acessível"
      description="Foco, teclado e leitura por tecnologias assistivas já considerados."
    >
      <p className="text-sm text-muted-foreground">Conteúdo livre dentro do componente.</p>
    </DialogShowcase>
  ),
  'dropdown-actions': () => (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <span className="text-sm font-medium">Relatório de desempenho</span>
      <DropdownActions
        actions={[
          { label: 'Copiar link', icon: Copy, onSelect: () => undefined },
          { label: 'Arquivar', icon: Clipboard, onSelect: () => undefined },
          { label: 'Excluir', destructive: true, onSelect: () => undefined },
        ]}
      />
    </div>
  ),
  'empty-state': () => (
    <EmptyState
      title="Nenhum resultado por aqui"
      description="Tente ajustar os filtros ou crie um novo item."
      icon={<Inbox className="h-6 w-6" />}
      primaryAction={{ label: 'Criar item', onClick: () => undefined }}
      secondaryAction={{ label: 'Limpar filtros', onClick: () => undefined }}
      variant="bordered"
    />
  ),
  'faq-accordion': () => (
    <FAQAccordion
      title="Perguntas frequentes"
      items={[
        { question: 'Os componentes são responsivos?', answer: 'Sim, todos partem de mobile.' },
        { question: 'Posso personalizar?', answer: 'Sim, use props e className.' },
        {
          question: 'Há suporte a teclado?',
          answer: 'Os controles interativos são acessíveis.',
        },
      ]}
      className="!py-8"
    />
  ),
  'faq-cards': () => (
    <FAQCards
      title="Respostas rápidas"
      description="Tudo o que você precisa saber antes de começar."
      columns={3}
      items={[
        {
          question: 'A instalação é individual?',
          answer: 'Sim. Escolha somente os componentes necessários para o seu projeto.',
        },
        {
          question: 'Posso alterar os estilos?',
          answer: 'Sim. O código é adicionado ao projeto e continua totalmente editável.',
        },
        {
          question: 'Funciona com TypeScript?',
          answer: 'Todos os componentes possuem props tipadas e exemplos de uso.',
        },
      ]}
      className="!py-8"
    />
  ),
  'faq-centered': () => (
    <FAQCentered
      eyebrow="Central de ajuda"
      title="Perguntas antes de começar"
      description="Informações objetivas em uma composição centralizada."
      items={[
        {
          question: 'Como instalo um componente?',
          answer: 'Copie o comando exibido no catálogo e execute no projeto de destino.',
        },
        {
          question: 'Os componentes são acessíveis?',
          answer: 'Sim. Teclado, foco visível e semântica são preservados.',
        },
        {
          question: 'É possível usar apenas uma seção?',
          answer: 'Sim. Cada item possui seu próprio arquivo no registry.',
        },
      ]}
      className="!py-8"
    />
  ),
  'faq-search': () => (
    <FAQSearch
      title="Como podemos ajudar?"
      description="Pesquise por instalação, estilos ou acessibilidade."
      items={[
        {
          category: 'Instalação',
          question: 'Como adicionar pelo terminal?',
          answer: 'Use o comando do Componentes Bloomin disponível em cada componente.',
          searchText: 'cli terminal registry',
        },
        {
          category: 'Personalização',
          question: 'Como trocar cores e espaçamentos?',
          answer: 'Edite as classes Tailwind ou passe uma className adicional.',
          searchText: 'tema estilos tailwind',
        },
        {
          category: 'Acessibilidade',
          question: 'O accordion funciona com teclado?',
          answer: 'Sim. Os controles usam os comportamentos acessíveis do Radix.',
          searchText: 'teclado foco radix',
        },
      ]}
      className="!py-8"
    />
  ),
  'loading-skeleton': () => (
    <LoadingSkeleton variant="list" count={3} label="Carregando projetos" />
  ),
  'progress-steps': () => (
    <ProgressSteps
      currentStep={2}
      steps={[
        { label: 'Dados', description: 'Informações principais' },
        { label: 'Revisão', description: 'Confira os detalhes' },
        { label: 'Concluído', description: 'Tudo pronto' },
      ]}
    />
  ),
  'sheet-panel': () => <SheetPreview />,
  'tabs-showcase': () => (
    <TabsShowcase
      tabs={[
        {
          id: 'visao',
          label: 'Visão geral',
          content: <p className="text-sm text-muted-foreground">Uma API simples e previsível.</p>,
        },
        {
          id: 'acessibilidade',
          label: 'Acessibilidade',
          content: <p className="text-sm text-muted-foreground">Semântica e teclado por padrão.</p>,
        },
        {
          id: 'codigo',
          label: 'Código',
          content: <p className="text-sm text-muted-foreground">TypeScript e composição direta.</p>,
        },
      ]}
    />
  ),
  'testimonials-carousel': () => (
    <TestimonialsCarousel
      title="Histórias de parceria"
      testimonials={[
        {
          quote: 'O novo sistema trouxe clareza e velocidade para todo o time.',
          name: 'Ana Martins',
          role: 'Diretora de Produto',
          company: 'Atlas',
        },
        {
          quote: 'Conseguimos evoluir sem perder consistência.',
          name: 'João Alves',
          role: 'CEO',
          company: 'Vértice',
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'testimonials-grid': () => (
    <TestimonialsGrid
      title="O que nossos clientes dizem"
      testimonials={[
        {
          quote: 'Uma parceria objetiva, cuidadosa e orientada a resultado.',
          name: 'Carla Souza',
          role: 'COO',
          company: 'Prisma',
        },
        {
          quote: 'A qualidade da entrega elevou todo o nosso produto.',
          name: 'Pedro Melo',
          role: 'Head de Produto',
          company: 'Nexo',
        },
      ]}
      className="rounded-xl !py-8 [&_.container]:!px-0"
    />
  ),
  'testimonials-spotlight': () => (
    <TestimonialsSpotlight
      featured={{
        quote: 'A experiência ficou mais simples, consistente e muito mais fácil de evoluir.',
        name: 'Marina Costa',
        role: 'Diretora de Produto',
        company: 'Norte',
        rating: 5,
      }}
      items={[
        {
          quote: 'O processo foi claro do início ao fim.',
          name: 'Rafael Lima',
          role: 'CEO',
          company: 'Atlas',
        },
        {
          quote: 'Conseguimos entregar melhor e com menos retrabalho.',
          name: 'Carla Nunes',
          role: 'COO',
          company: 'Prisma',
        },
      ]}
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'toast-provider': () => (
    <ToastProvider>
      <div className="flex min-h-28 items-center justify-center">
        <ToastTrigger />
      </div>
    </ToastProvider>
  ),
  'interactive-steps': () => (
    <InteractiveSteps
      className="!py-0"
      steps={[
        { title: 'Descoberta', description: 'Objetivos, público e contexto.' },
        { title: 'Construção', description: 'Design e tecnologia em conjunto.' },
        { title: 'Evolução', description: 'Medição e melhoria contínua.' },
      ]}
    />
  ),
  'expandable-cards': () => (
    <ExpandableCards
      className="!py-0"
      items={[
        {
          id: 'design',
          title: 'Design',
          description: 'Experiências claras e memoráveis.',
          image: { src: imageOne, alt: 'Projeto de design' },
        },
        {
          id: 'estrategia',
          title: 'Estratégia',
          description: 'Decisões conectadas ao negócio.',
          image: { src: imageTwo, alt: 'Equipe de estratégia' },
        },
        {
          id: 'tecnologia',
          title: 'Tecnologia',
          description: 'Produtos rápidos e escaláveis.',
          image: { src: imageThree, alt: 'Projeto de tecnologia' },
        },
      ]}
    />
  ),
  'expandable-text-box': () => (
    <div className="bg-[#121212] p-6">
      <ExpandableTextBox paragraphs={[lorem, lorem]} />
    </div>
  ),
  'numbered-accordion': () => (
    <div className="bg-[#121212] p-6">
      <NumberedAccordion
        items={['Instalação', 'Configuração', 'Treinamento'].map((title) => ({
          title,
          description: lorem,
        }))}
      />
    </div>
  ),
  'faq-bordered': () => (
    <FAQBordered
      title="Dúvidas frequentes"
      description={lorem}
      items={[
        'Qual o prazo de entrega?',
        'Vocês oferecem suporte?',
        'Como solicitar orçamento?',
      ].map((question) => ({ question, answer: lorem }))}
    />
  ),
  'testimonials-marquee': () => (
    <TestimonialsMarquee
      eyebrow="Depoimentos"
      title="O que dizem nossos clientes"
      testimonials={testimonials}
    />
  ),
  'testimonials-quote-slider': () => (
    <TestimonialsQuoteSlider
      eyebrow="Depoimentos"
      title="Clientes satisfeitos"
      testimonials={testimonials}
    />
  ),
  'testimonials-columns': () => (
    <TestimonialsColumns
      eyebrow="Depoimentos"
      title="Quem confia na Norte"
      testimonials={testimonials}
    />
  ),
  'cta-centered-card': () => (
    <CTACenteredCard
      title="Pronto para impulsionar seu projeto?"
      description={lorem}
      actions={
        <>
          <AccentButton href="#">Ver produtos</AccentButton>
          <AccentButton href="#">Solicitar contato</AccentButton>
        </>
      }
    />
  ),
  'cta-split-panel': () => (
    <CTASplitPanel
      eyebrow="Orçamento"
      title="Precisa de uma solução sob medida?"
      description={lorem}
      actions={
        <AccentButton href="#" tone="industrial">
          Solicitar orçamento
        </AccentButton>
      }
    />
  ),
  'success-state-card': () => (
    <SuccessStateCard
      title="Mensagem enviada!"
      description="Recebemos seu contato e retornaremos em breve."
      steps={[
        { title: 'Analisamos sua solicitação', description: 'Em até 1 dia útil.' },
        { title: 'Entramos em contato', description: 'Por telefone ou e-mail.' },
      ]}
      helper="Precisa de agilidade? Fale pelo WhatsApp."
      actions={<AccentButton href="#">Voltar ao início</AccentButton>}
    />
  ),
  'faq-split-cta': () => (
    <FAQSplitCTA
      eyebrow="FAQ"
      title="Perguntas frequentes"
      description="Não achou sua dúvida? Nossa equipe responde no mesmo dia útil."
      action={{ label: 'Falar com a equipe', href: '#contato' }}
      items={[
        'Quais serviços vocês oferecem?',
        'Qual é o prazo médio?',
        'Atendem fora da capital?',
        'Como solicitar um orçamento?',
      ].map((question) => ({ question, answer: lorem }))}
    />
  ),
  'not-found-section': () => (
    <NotFoundSection
      eyebrow="Erro 404"
      title="Página não encontrada"
      description="O endereço pode ter mudado ou a página foi removida."
      primaryAction={{ label: 'Voltar ao início', href: '#inicio' }}
      secondaryAction={{ label: 'Fale conosco', href: '#contato' }}
      suggestionsTitle="Talvez você esteja procurando"
      suggestions={[
        { label: 'Início', description: 'Página principal.', href: '#inicio', icon: <Home /> },
        {
          label: 'Produtos',
          description: 'Catálogo completo.',
          href: '#produtos',
          icon: <Package />,
        },
        { label: 'Blog', description: 'Artigos e guias.', href: '#blog', icon: <BookOpen /> },
        { label: 'Contato', description: 'Fale com a equipe.', href: '#contato', icon: <Mail /> },
      ]}
    />
  ),
  'faq-help-card': () => (
    <FAQHelpCard
      eyebrow="FAQ"
      title="Perguntas frequentes"
      description="Não achou sua dúvida? O time comercial responde no mesmo dia útil."
      help={{
        title: 'Falar com o comercial',
        description: 'Tire dúvidas sobre tratamentos, prazos e orçamento.',
        action: { label: 'Falar com o comercial', href: 'https://wa.me/5511999999999' },
      }}
      items={[
        {
          question: 'Quais tratamentos de superfície vocês oferecem?',
          answer:
            'Galvanização eletrolítica, decapagem de latão, fosfatização a seco, fosfatização oleada e outros acabamentos sob consulta.',
        },
        {
          question: 'Qual é a diferença entre galvanização e zincagem?',
          answer:
            'Na prática industrial, ambos se referem a revestimentos de zinco; o processo eletrolítico aplica uma camada controlada com acabamentos específicos.',
        },
        {
          question: 'A galvanização altera as dimensões da peça?',
          answer:
            'A camada adiciona espessura milimétrica. Informamos a faixa esperada conforme o tratamento e a especificação do projeto.',
        },
        {
          question: 'Como escolher o tratamento correto para uma peça metálica?',
          answer:
            'Consideramos material, geometria, ambiente de uso e acabamento desejado. A equipe técnica indica o processo mais adequado.',
        },
        {
          question: 'Como solicitar orçamento de galvanização industrial?',
          answer:
            'Envie lista de peças, desenhos, volumes e o tratamento desejado pelo formulário ou WhatsApp.',
        },
      ]}
    />
  ),
  'testimonials-avatar-switcher': () => (
    <TestimonialsAvatarSwitcher
      eyebrow="Avaliações Google"
      title="O que dizem nossos clientes"
      description="Lojas, projetistas e clientes que acompanham a qualidade e o acabamento das nossas entregas."
      items={[
        {
          quote:
            'Atendimento rápido, acabamento impecável e entrega no prazo combinado. Já é nosso fornecedor oficial.',
          name: 'Ricardo Almeida',
          role: 'Compras · Indústria',
          avatar: teamMembers[1].image,
          rating: 5,
        },
        {
          quote:
            'Projeto sob medida que resolveu exatamente o que precisávamos. Equipe muito atenciosa do início ao fim.',
          name: 'Juliana Prado',
          role: 'Arquiteta',
          avatar: teamMembers[2].image,
          rating: 5,
        },
        {
          quote:
            'Qualidade excelente e suporte depois da instalação. Recomendo para quem busca durabilidade.',
          name: 'Bruno Alves',
          role: 'Lojista',
          avatar: teamMembers[3].image,
          rating: 4,
        },
      ]}
    />
  ),
}
