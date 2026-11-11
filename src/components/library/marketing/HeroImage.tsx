import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type HeroImageProps = {
  title: string
  description?: string
  image: { src: string; alt: string }
  eyebrow?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  align?: 'left' | 'center'
  className?: string
}

export function HeroImage({
  title,
  description,
  image,
  eyebrow,
  primaryAction,
  secondaryAction,
  align = 'left',
  className,
}: HeroImageProps) {
  return (
    <section
      className={cn(
        'relative isolate min-h-[560px] overflow-hidden bg-slate-950 text-white',
        className,
      )}
      aria-labelledby="hero-image-title"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
      <div
        className={cn(
          'container relative z-10 flex min-h-[560px] flex-col justify-center py-20',
          align === 'center' && 'items-center text-center',
        )}
      >
        {eyebrow ? (
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">{eyebrow}</p>
        ) : null}
        <h1
          id="hero-image-title"
          className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl"
        >
          {title}
        </h1>
        {description ? <p className="mt-6 max-w-2xl text-lg text-white/80">{description}</p> : null}
        {(primaryAction || secondaryAction) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryAction ? (
              <Button asChild size="lg">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button asChild size="lg" variant="secondary">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
