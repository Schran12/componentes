import type * as React from 'react'

export interface NavigationLink {
  label: React.ReactNode
  href: string
  description?: string
  icon?: React.ReactNode
  external?: boolean
  current?: boolean
}

export interface NavigationItem extends NavigationLink {
  children?: readonly NavigationLink[]
}

export interface NavigationAction extends NavigationLink {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
}

export interface NavigationBrand {
  label: string
  href?: string
  logo?: React.ReactNode
}

export interface FooterColumn {
  title: string
  links: readonly NavigationLink[]
}

export interface SocialLink {
  label: string
  href: string
  icon: React.ReactNode
}
