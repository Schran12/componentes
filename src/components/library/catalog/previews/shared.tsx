'use client'

import { BlogPostPage, SheetPanel, TeamSection, useToast } from '@/components/library'
import { Button } from '@/components/ui/button'
import { Cpu, ShieldCheck, Wrench, Zap } from 'lucide-react'
import { useState } from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

export const navigationItems = [
  { label: 'Início', href: '#inicio', current: true },
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Empresa', href: '#empresa' },
]

export const brand = {
  label: 'Norte',
  href: '#catalogo',
  logo: (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
      N
    </span>
  ),
}

export const imageOne =
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80'

export const imageTwo =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80'

export const imageThree =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'

export function SheetPreview() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex min-h-28 items-center justify-center">
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Abrir painel
      </Button>
      <SheetPanel open={open} onOpenChange={setOpen} title="Filtros do catálogo">
        <p className="text-sm text-muted-foreground">
          Um painel com foco controlado, fechamento por Escape e backdrop.
        </p>
      </SheetPanel>
    </div>
  )
}

const blogLayouts = ['classic', 'cover', 'sidebar', 'magazine'] as const

export function BlogPostPreview() {
  const [layout, setLayout] = useState<(typeof blogLayouts)[number]>('classic')
  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {blogLayouts.map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={item === layout ? 'default' : 'outline'}
            onClick={() => setLayout(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <BlogPostPage
        layout={layout}
        breadcrumbs={blogPostBreadcrumbs}
        aside={blogPostAside}
        post={blogPost}
        related={blogRelatedPosts}
      />
    </div>
  )
}

const teamVariants = ['overlay', 'cards', 'minimal', 'featured'] as const

const teamPortrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&h=1000&q=80`

export const teamMembers = [
  {
    name: 'Marina Costa',
    role: 'CEO e fundadora',
    image: { src: teamPortrait('1573496359142-b8d87734a5a2'), alt: 'Retrato de Marina Costa' },
    bio: 'Lidera a estratégia da empresa e acompanha de perto cada cliente desde o primeiro projeto.',
    socials: [
      { type: 'linkedin' as const, href: 'https://www.linkedin.com' },
      { type: 'email' as const, href: 'marina@exemplo.com' },
    ],
  },
  {
    name: 'Rafael Lima',
    role: 'Diretor de tecnologia',
    image: { src: teamPortrait('1507003211169-0a1dd7228f2d'), alt: 'Retrato de Rafael Lima' },
    bio: 'Arquitetura, escala e qualidade técnica em todas as entregas.',
    socials: [
      { type: 'linkedin' as const, href: 'https://www.linkedin.com' },
      { type: 'website' as const, href: 'https://exemplo.com' },
    ],
  },
  {
    name: 'Juliana Prado',
    role: 'Gerente de projetos',
    image: { src: teamPortrait('1494790108377-be9c29b29330'), alt: 'Retrato de Juliana Prado' },
    bio: 'Garante prazos, comunicação clara e entregas previsíveis.',
    socials: [
      { type: 'instagram' as const, href: 'https://www.instagram.com' },
      { type: 'whatsapp' as const, href: 'https://wa.me/5511999999999' },
    ],
  },
  {
    name: 'Bruno Alves',
    role: 'Especialista em suporte',
    image: { src: teamPortrait('1500648767791-00dcc994a43e'), alt: 'Retrato de Bruno Alves' },
    bio: 'Atendimento próximo para resolver dúvidas com agilidade.',
    socials: [{ type: 'email' as const, href: 'bruno@exemplo.com' }],
  },
  {
    name: 'Carla Mendes',
    role: 'Designer',
    image: { src: teamPortrait('1438761681033-6461ffad8d80'), alt: 'Retrato de Carla Mendes' },
    bio: 'Interfaces claras e experiências consistentes.',
    socials: [{ type: 'linkedin' as const, href: 'https://www.linkedin.com' }],
  },
]

export function TeamSectionPreview() {
  const [variant, setVariant] = useState<(typeof teamVariants)[number]>('overlay')
  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {teamVariants.map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={item === variant ? 'default' : 'outline'}
            onClick={() => setVariant(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <TeamSection
        variant={variant}
        eyebrow="Equipe"
        title="Pessoas por trás de cada entrega"
        description="Especialistas que acompanham o seu projeto do diagnóstico ao suporte."
        members={variant === 'featured' ? teamMembers : teamMembers.slice(0, 4)}
        action={{ label: 'Trabalhe conosco', href: '#carreiras' }}
        className="!py-8"
      />
    </div>
  )
}

export function ToastTrigger() {
  const { toast } = useToast()
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() =>
        toast({
          title: 'Alterações salvas',
          description: 'Sua configuração foi atualizada.',
          variant: 'success',
        })
      }
    >
      Exibir notificação
    </Button>
  )
}

export const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.'

export const photos = [
  imageOne,
  imageTwo,
  imageThree,
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
]

export const image = (index: number, alt = 'Imagem ilustrativa') => ({
  src: photos[index % photos.length],
  alt,
})

export const products = ['Servidor Pro', 'Storage X', 'Firewall One', 'Edge Node'].map(
  (title, index) => ({
    id: `p${index}`,
    title,
    category: index % 2 ? 'Armazenamento' : 'Infraestrutura',
    description: lorem,
    href: '#produtos',
    image: image(index, title),
    features: ['Alta disponibilidade', 'Suporte 24/7', 'Monitoramento'],
  }),
)

export const testimonials = [
  'Ana Souza',
  'Bruno Lima',
  'Carla Mendes',
  'Diego Rocha',
  'Elisa Prado',
  'Fábio Nunes',
].map((name, index) => ({
  name,
  role: ['CEO', 'CTO', 'Gerente de TI', 'Diretora', 'Engenheiro', 'Compras'][index],
  content: lorem,
  rating: 5,
  avatar: index % 2 ? '/images/logo/avatar-male.jpg' : '/images/logo/avatar-female.jpg',
}))

export const socials = [
  { label: 'Facebook', href: '#', icon: <FaFacebookF className="h-3.5 w-3.5" /> },
  { label: 'Instagram', href: '#', icon: <FaInstagram className="h-3.5 w-3.5" /> },
  { label: 'LinkedIn', href: '#', icon: <FaLinkedinIn className="h-3.5 w-3.5" /> },
]

export const navItems = [
  { label: 'Início', href: '/' },
  { label: 'Sobre', href: '#sobre' },
  {
    label: 'Produtos',
    href: '#produtos',
    children: [
      { label: 'Servidores', href: '#servidores' },
      { label: 'Storage', href: '#storage' },
    ],
  },
  { label: 'Contato', href: '#contato' },
]

export const logo = <span className="text-lg font-bold tracking-tight">Norte</span>

export const features = [
  { title: 'Segurança', description: lorem, icon: <ShieldCheck className="h-6 w-6" /> },
  { title: 'Performance', description: lorem, icon: <Zap className="h-6 w-6" /> },
  { title: 'Hardware', description: lorem, icon: <Cpu className="h-6 w-6" /> },
  { title: 'Manutenção', description: lorem, icon: <Wrench className="h-6 w-6" /> },
]

export const blogPostBreadcrumbs = [
  { label: 'Blog', href: '#blog' },
  { label: 'Guia de manutenção' },
]

export const blogPostAside = {
  title: 'Precisa de ajuda com isso?',
  description: 'Nossa equipe avalia o seu cenário sem compromisso.',
  action: { label: 'Falar com a equipe', href: '#contato' },
}

export const blogPost = {
  title: 'Guia completo de manutenção preventiva',
  excerpt: lorem,
  category: 'Guias',
  author: 'Equipe',
  image: { src: imageOne, alt: 'Capa do artigo' },
  date: { label: '10 de março de 2026', dateTime: '2026-03-10' },
  quote: 'Prevenir custa menos do que corrigir.',
  body: [
    { paragraphs: [lorem, lorem] },
    { heading: 'Por que fazer', paragraphs: [lorem, lorem] },
    { heading: 'Como planejar', paragraphs: [lorem] },
    { heading: 'Conclusão', paragraphs: [lorem] },
  ],
}

export const blogRelatedPosts = [
  'Tendências do setor',
  'Como escolher o fornecedor',
  'Checklist de projeto',
].map((title, index) => ({
  slug: `rel-${index}`,
  title,
  excerpt: lorem,
  image: image(index + 1, title),
  date: `${12 + index} de março de 2026`,
  category: 'Guias',
  href: '#post',
}))
