'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { Globe, Instagram, Linkedin, Mail, MessageCircle, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type TeamSocialType = 'linkedin' | 'instagram' | 'email' | 'whatsapp' | 'website'

export type TeamSectionMember = {
  name: string
  role: string
  image: { src: string; alt?: string }
  bio?: string
  socials?: Array<{ type: TeamSocialType; href: string }>
}

export type TeamSectionProps = {
  title: string
  eyebrow?: string
  description?: string
  members: TeamSectionMember[]
  variant?: 'overlay' | 'cards' | 'minimal' | 'featured'
  columns?: 3 | 4
  action?: { label: string; href: string }
  className?: string
}

const socialMeta: Record<TeamSocialType, { icon: LucideIcon; label: string }> = {
  linkedin: { icon: Linkedin, label: 'LinkedIn' },
  instagram: { icon: Instagram, label: 'Instagram' },
  email: { icon: Mail, label: 'E-mail' },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp' },
  website: { icon: Globe, label: 'Site' },
}

const columnClasses = {
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

function socialHref(type: TeamSocialType, href: string) {
  if (type === 'email' && !href.startsWith('mailto:')) return `mailto:${href}`
  return href
}

function Socials({
  member,
  tone = 'default',
  className,
}: {
  member: TeamSectionMember
  tone?: 'default' | 'inverted'
  className?: string
}) {
  if (!member.socials?.length) return null

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {member.socials.map((social) => {
        const { icon: Icon, label } = socialMeta[social.type]
        const external = social.type !== 'email'

        return (
          <li key={`${social.type}-${social.href}`}>
            <a
              href={socialHref(social.type, social.href)}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              aria-label={`${label} de ${member.name}`}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                tone === 'inverted'
                  ? 'bg-white/15 text-white backdrop-blur hover:bg-primary'
                  : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground',
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function OverlayCard({ member }: { member: TeamSectionMember }) {
  return (
    <article className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted">
      <Image
        src={member.image.src}
        alt={member.image.alt ?? member.name}
        fill
        className="object-cover transition duration-700 group-hover:scale-105"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-colors duration-500 md:group-focus-within:from-primary/90 md:group-hover:from-primary/90" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-sm font-medium text-white/80">{member.role}</p>
        <div className="grid transition-all duration-500 md:grid-rows-[0fr] md:opacity-0 md:group-focus-within:grid-rows-[1fr] md:group-focus-within:opacity-100 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100">
          <div className="min-h-0 overflow-hidden">
            {member.bio ? (
              <p className="mt-3 text-sm leading-6 text-white/85">{member.bio}</p>
            ) : null}
            <Socials member={member} tone="inverted" className="mt-4" />
          </div>
        </div>
      </div>
    </article>
  )
}

function CardsCard({ member }: { member: TeamSectionMember }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Image
          src={member.image.src}
          alt={member.image.alt ?? member.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{member.name}</h3>
        <p className="text-sm font-medium text-primary">{member.role}</p>
        {member.bio ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{member.bio}</p>
        ) : null}
        <Socials member={member} className="mt-auto pt-5" />
      </div>
    </article>
  )
}

function MinimalCard({ member }: { member: TeamSectionMember }) {
  return (
    <article className="group flex flex-col items-center text-center">
      <div className="relative aspect-square w-full max-w-44 overflow-hidden rounded-full bg-muted ring-4 ring-transparent ring-offset-4 ring-offset-background transition duration-300 group-hover:ring-primary">
        <Image
          src={member.image.src}
          alt={member.image.alt ?? member.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="176px"
        />
      </div>
      <h3 className="mt-5 text-base font-semibold sm:text-lg">{member.name}</h3>
      <p className="text-sm text-muted-foreground">{member.role}</p>
      <Socials member={member} className="mt-3 justify-center" />
    </article>
  )
}

function FeaturedMember({ member }: { member: TeamSectionMember }) {
  return (
    <article className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-2">
      <div className="relative aspect-[4/3] bg-muted md:aspect-auto md:min-h-[26rem]">
        <Image
          src={member.image.src}
          alt={member.image.alt ?? member.name}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          {member.role}
        </p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{member.name}</h3>
        {member.bio ? <p className="mt-4 leading-7 text-muted-foreground">{member.bio}</p> : null}
        <Socials member={member} className="mt-6" />
      </div>
    </article>
  )
}

const cardByVariant = {
  overlay: OverlayCard,
  cards: CardsCard,
  minimal: MinimalCard,
  featured: CardsCard,
}

export function TeamSection({
  title,
  eyebrow,
  description,
  members,
  variant = 'overlay',
  columns = 4,
  action,
  className,
}: TeamSectionProps) {
  const reduceMotion = useReducedMotion()
  const [leader, ...rest] = members
  const list = variant === 'featured' ? rest : members
  const Card = cardByVariant[variant]

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {variant === 'featured' && leader ? (
          <motion.div
            className="mt-12"
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <FeaturedMember member={leader} />
          </motion.div>
        ) : null}

        {list.length ? (
          <ul
            className={cn(
              'mt-12 grid gap-6',
              variant === 'minimal' ? 'grid-cols-2 gap-y-10' : '',
              columnClasses[columns],
            )}
          >
            {list.map((member, index) => (
              <motion.li
                key={member.name}
                initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (index % columns) * 0.08 }}
              >
                <Card member={member} />
              </motion.li>
            ))}
          </ul>
        ) : null}

        {action ? (
          <div className="mt-12 flex justify-center">
            <Button asChild size="lg">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}
