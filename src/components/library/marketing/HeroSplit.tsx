import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type HeroSplitProps = {
  title: string
  description?: string
  image: { src: string; alt: string }
  eyebrow?: string
  action?: { label: string; href: string }
  imagePosition?: 'left' | 'right'
  className?: string
}

export function HeroSplit({
  title,
  description,
  image,
  eyebrow,
  action,
  imagePosition = 'right',
  className,
}: HeroSplitProps) {
  return (
    <section
      className={cn('overflow-hidden border-b bg-background', className)}
      aria-labelledby="hero-split-title"
    >
      <div className="container grid min-h-[520px] items-center gap-10 py-12 lg:grid-cols-2 lg:py-20">
        <div className={cn('max-w-xl', imagePosition === 'left' && 'lg:order-2')}>
          {eyebrow ? (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 id="hero-split-title" className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
          {action ? (
            <Button asChild className="mt-8" size="lg">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : null}
        </div>
        <div
          className={cn(
            'relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted shadow-xl',
            imagePosition === 'left' && 'lg:order-1',
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}
