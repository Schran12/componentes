import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type MediaSplitProps = {
  title: string
  description: string
  image: { src: string; alt: string }
  eyebrow?: string
  action?: { label: string; href: string }
  mediaPosition?: 'left' | 'right'
  children?: React.ReactNode
  className?: string
}

export function MediaSplit({
  title,
  description,
  image,
  eyebrow,
  action,
  mediaPosition = 'left',
  children,
  className,
}: MediaSplitProps) {
  return (
    <section className={cn('py-16 md:py-24', className)} aria-labelledby="media-split-title">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          className={cn(
            'relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted',
            mediaPosition === 'right' && 'lg:order-2',
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div>
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h2 id="media-split-title" className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{description}</p>
          {children ? <div className="mt-6">{children}</div> : null}
          {action ? (
            <Button asChild className="mt-8">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
