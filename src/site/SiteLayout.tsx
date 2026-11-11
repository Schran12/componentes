import type { ReactNode } from 'react'
import { FooterCompact } from '@/components/library/navigation/FooterCompact'
import { NavbarSimple } from '@/components/library/navigation/NavbarSimple'

const siteName = 'Componentes Bloomin'
const brand = {
  label: siteName,
  href: '/',
  logo: (
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
      B
    </span>
  ),
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarSimple
        brand={brand}
        items={[
          { label: 'Componentes', href: '/componentes' },
          { label: 'Templates', href: '/templates' },
          { label: 'Animações', href: '/animacoes' },
          { label: 'Montar página', href: '/montar-pagina' },
          { label: 'Assistente', href: '/assistente' },
          { label: 'API / Instalar', href: '/como-utilizar' },
        ]}
        sticky
      />
      <main className="w-full min-w-0 flex-1">{children}</main>
      <FooterCompact
        brand={brand}
        links={[
          { label: 'Catálogo', href: '/componentes' },
          { label: 'Templates', href: '/templates' },
          { label: 'Assistente', href: '/assistente' },
          { label: 'API / Instalar', href: '/como-utilizar' },
        ]}
        copyright={`© ${new Date().getFullYear()} ${siteName}. Componentes instaláveis por código.`}
      />
    </>
  )
}
