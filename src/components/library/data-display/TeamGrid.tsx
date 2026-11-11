import Image from 'next/image'
import { Linkedin, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TeamGridProps = {
  title?: string
  members: Array<{
    name: string
    role: string
    image: { src: string; alt?: string }
    bio?: string
    email?: string
    linkedin?: string
  }>
  className?: string
}

export function TeamGrid({ title, members, className }: TeamGridProps) {
  return (
    <section
      className={cn('py-16 md:py-24', className)}
      aria-labelledby={title ? 'team-title' : undefined}
    >
      <div className="container">
        {title ? (
          <h2 id="team-title" className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <article key={member.name} className="overflow-hidden rounded-2xl border bg-card">
              <div className="relative aspect-[4/5] bg-muted">
                <Image
                  src={member.image.src}
                  alt={member.image.alt ?? member.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                {member.bio ? (
                  <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                ) : null}
                {(member.email || member.linkedin) && (
                  <div className="mt-4 flex gap-2">
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Enviar e-mail para ${member.name}`}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    ) : null}
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
