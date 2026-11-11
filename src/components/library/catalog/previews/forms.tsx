import {
  ContactCard,
  ContactChannelsSection,
  ContactForm,
  ContactSplitSection,
  MultiStepQuoteForm,
  NewsletterForm,
  SearchField,
  WhatsAppQuoteForm,
  VeloriaReserve,
} from '@/components/library'
import { Button } from '@/components/ui/button'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { lorem } from './shared'
import type { PreviewMap } from './types'

export const formsPreviews: PreviewMap = {
  'contact-card': () => (
    <div className="mx-auto max-w-md">
      <ContactCard
        title="Fale com nossa equipe"
        value="contato@exemplo.com"
        description="Resposta em até um dia útil"
        href="mailto:contato@exemplo.com"
        icon={Mail}
      />
    </div>
  ),
  'contact-form': () => (
    <ContactForm
      title="Conte sobre seu projeto"
      description="Este preview usa um callback local e não envia dados."
      submitLabel="Enviar demonstração"
      onSubmit={() => undefined}
      className="mx-auto max-w-2xl"
    />
  ),
  'contact-split-section': () => (
    <ContactSplitSection
      title="Vamos construir algo relevante."
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      methods={[
        {
          label: 'E-mail',
          value: 'contato@exemplo.com',
          href: 'mailto:contato@exemplo.com',
          icon: Mail,
        },
        {
          label: 'Telefone',
          value: '+55 11 99999-0000',
          href: 'tel:+5511999990000',
          icon: Phone,
        },
        {
          label: 'Endereço',
          value: 'São Paulo, SP',
          href: '#endereco',
          icon: MapPin,
        },
      ]}
      socialLinks={[
        { label: 'Instagram', href: '#instagram' },
        { label: 'LinkedIn', href: '#linkedin' },
      ]}
      form={
        <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <label className="grid gap-2 text-sm font-medium">
            Nome
            <input className="h-11 rounded-xl border bg-background px-3" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            E-mail
            <input type="email" className="h-11 rounded-xl border bg-background px-3" />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Mensagem
            <textarea className="min-h-28 rounded-xl border bg-background p-3" />
          </label>
          <Button type="submit" className="mt-2 w-fit">
            Enviar mensagem
          </Button>
        </form>
      }
      className="!py-8 [&_.container]:!px-0"
    />
  ),
  'newsletter-form': () => (
    <NewsletterForm
      title="Ideias úteis, uma vez por mês"
      description="Conteúdo sobre produto, design e tecnologia."
      consentLabel="Concordo em receber comunicações e posso cancelar quando quiser."
      onSubmit={() => undefined}
      className="mx-auto max-w-xl"
    />
  ),
  'search-field': () => (
    <div className="mx-auto max-w-xl">
      <SearchField
        defaultValue="design system"
        size="lg"
        showSubmitButton
        submitLabel="Pesquisar"
        onSubmit={() => undefined}
        onClear={() => undefined}
      />
    </div>
  ),
  'contact-channels-section': () => (
    <ContactChannelsSection
      eyebrow="Contato"
      title="Solicite um orçamento técnico"
      description={lorem}
      layout="joined"
      tone="industrial"
      channels={[
        {
          label: 'E-mail',
          value: 'contato@norte.com',
          href: 'mailto:contato@norte.com',
          icon: <Mail />,
        },
        { label: 'Telefone', value: '(11) 4000-0000', href: 'tel:1140000000', icon: <Phone /> },
        { label: 'Endereço', value: 'Av. Paulista, 1000 - São Paulo', icon: <MapPin /> },
        { label: 'Horário', value: 'Seg a sex, 8h às 18h', icon: <Clock /> },
      ]}
      whatsapp={{ href: 'https://wa.me/5511999999999' }}
      onSubmit={() => new Promise((resolve) => setTimeout(resolve, 800))}
    />
  ),
  'multi-step-quote-form': () => (
    <MultiStepQuoteForm
      title="Solicite um orçamento"
      className="mx-auto max-w-2xl"
      onSubmit={() => new Promise((resolve) => setTimeout(resolve, 800))}
      steps={[
        {
          title: 'Serviço e projeto',
          fields: [
            {
              name: 'servico',
              label: 'Serviço',
              type: 'select',
              required: true,
              fullWidth: true,
              options: ['Reforma', 'Ampliação', 'Outro'],
            },
            { name: 'projeto', label: 'Conte sobre o projeto', type: 'textarea', required: true },
          ],
        },
        {
          title: 'Dados pessoais',
          fields: [
            { name: 'nome', label: 'Nome', required: true },
            { name: 'email', label: 'E-mail', type: 'email', required: true },
            { name: 'telefone', label: 'Telefone', type: 'tel', fullWidth: true },
          ],
        },
        {
          title: 'Localização',
          fields: [
            { name: 'cidade', label: 'Cidade', required: true },
            { name: 'estado', label: 'Estado', required: true },
          ],
        },
      ]}
    />
  ),
  'whatsapp-quote-form': () => (
    <WhatsAppQuoteForm
      eyebrow="Orçamento comercial"
      title="Envie sua lista de peças e receba o retorno da equipe comercial"
      description="Informe materiais, quantidades, dimensões, desenhos e o tratamento desejado. A equipe avalia a demanda e entra em contato com as condições de atendimento."
      phone="5511999999999"
      contacts={[
        { label: '(11) 4000-0000', href: 'tel:1140000000', icon: <Phone /> },
        { label: 'comercial@exemplo.com', href: 'mailto:comercial@exemplo.com', icon: <Mail /> },
        { label: 'Mauá/SP — atendimento em todo o estado', icon: <MapPin /> },
      ]}
    />
  ),
  'veloria-reserve': () => <VeloriaReserve />,
}
