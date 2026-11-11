import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CTABannerProps = {
  title: string
  description?: string
  primaryAction: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  backgroundImage?: { src: string; alt?: string }
  className?: string
}

export function CTABanner({
  title,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  className,
}: CTABannerProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-primary py-16 text-primary-foreground md:py-20',
        className,
      )}
      aria-labelledby="cta-banner-title"
    >
      {backgroundImage ? (
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt ?? ''}
          fill
          className="-z-20 object-cover opacity-25"
          sizes="100vw"
        />
      ) : null}
      {backgroundImage ? <div className="absolute inset-0 -z-10 bg-primary/80" /> : null}
      <div className="container text-center">
        <h2
          id="cta-banner-title"
          className="mx-auto max-w-3xl text-3xl font-bold tracking-tight md:text-5xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mx-auto mt-5 max-w-2xl text-lg opacity-85">{description}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link href={primaryAction.href}>{primaryAction.label}</Link>
          </Button>
          {secondaryAction ? (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-current bg-transparent text-current hover:bg-white/10 hover:text-current"
            >
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
