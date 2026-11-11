import {
  AccentButton,
  ActionGroup,
  BadgeSectionHeader,
  EyebrowHeading,
  HoverButton,
  MediaFrame,
  PillButton,
  SectionHeading,
  SectionShell,
} from '@/components/library'
import { Sparkles } from 'lucide-react'
import { lorem } from './shared'
import type { PreviewMap } from './types'

export const primitivesPreviews: PreviewMap = {
  'action-group': () => (
    <ActionGroup
      align="center"
      actions={[
        { label: 'Começar agora', href: '#catalogo' },
        { label: 'Saiba mais', href: '#catalogo', variant: 'outline' },
      ]}
    />
  ),
  'media-frame': () => (
    <MediaFrame ratio="wide" radius="lg" elevation="md" caption="Superfície visual responsiva">
      <div className="flex h-full min-h-32 items-center justify-center bg-gradient-to-br from-primary/90 via-primary to-slate-950 text-primary-foreground">
        <Sparkles className="h-10 w-10" aria-hidden="true" />
      </div>
    </MediaFrame>
  ),
  'section-heading': () => (
    <SectionHeading
      eyebrow="Design system"
      title="Seções com hierarquia consistente"
      description="Tipografia, ritmo e alinhamento prontos para composição."
      size="sm"
    />
  ),
  'section-shell': () => (
    <SectionShell spacing="sm" tone="muted" containerSize="sm" className="rounded-2xl">
      <p className="text-center text-sm font-medium">Conteúdo dentro de um SectionShell</p>
    </SectionShell>
  ),
  'hover-button': () => (
    <div className="flex flex-wrap items-center justify-center gap-3 py-8">
      <HoverButton effect="lift">Elevar</HoverButton>
      <HoverButton effect="shine">Brilho</HoverButton>
      <HoverButton effect="slide" variant="outline">
        Deslizar
      </HoverButton>
      <HoverButton effect="expand-icon" variant="secondary">
        Explorar
      </HoverButton>
    </div>
  ),
  'accent-button': () => (
    <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-100 p-6">
      <div className="rounded-lg bg-[#121212] p-4">
        <AccentButton href="#">Glow</AccentButton>
      </div>
      <AccentButton href="#" tone="industrial">
        Industrial
      </AccentButton>
      <div className="bg-slate-950 p-4">
        <AccentButton href="#" tone="industrial-dark">
          Industrial dark
        </AccentButton>
      </div>
    </div>
  ),
  'eyebrow-heading': () => (
    <div className="space-y-6">
      <div className="bg-[#121212] p-6">
        <EyebrowHeading eyebrow="Sobre" title="Tecnologia que move negócios" description={lorem} />
      </div>
      <div className="bg-slate-50 p-6">
        <EyebrowHeading
          tone="industrial"
          layout="split"
          eyebrow="Serviços"
          title="Soluções industriais"
          description={lorem}
        />
      </div>
    </div>
  ),
  'pill-button': () => (
    <div className="flex flex-wrap items-center justify-center gap-4 bg-slate-900 p-6">
      <PillButton href="#">Sólido</PillButton>
      <PillButton href="#" variant="outline">
        Contorno
      </PillButton>
      <PillButton href="#" variant="glass">
        Glass
      </PillButton>
    </div>
  ),
  'badge-section-header': () => (
    <div className="grid gap-4 md:grid-cols-2">
      <BadgeSectionHeader badge="Serviços" title="O que fazemos" subtitle={lorem} />
      <div className="bg-slate-900 p-6">
        <BadgeSectionHeader badge="Clientes" title="Quem confia" subtitle={lorem} tone="dark" />
      </div>
    </div>
  ),
}
