import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type HeroVideoProps = {
  title: string
  description?: string
  videoSrc: string
  poster?: string
  action?: { label: string; href: string }
  eyebrow?: string
  className?: string
}

export function HeroVideo({
  title,
  description,
  videoSrc,
  poster,
  action,
  eyebrow,
  className,
}: HeroVideoProps) {
  return (
    <section
      className={cn(
        'relative isolate min-h-[600px] overflow-hidden bg-slate-950 text-white',
        className,
      )}
      aria-labelledby="hero-video-title"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={videoSrc}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="container relative z-10 flex min-h-[600px] flex-col justify-center py-20">
        {eyebrow ? (
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">{eyebrow}</p>
        ) : null}
        <h1
          id="hero-video-title"
          className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl"
        >
          {title}
        </h1>
        {description ? <p className="mt-6 max-w-2xl text-lg text-white/80">{description}</p> : null}
        {action ? (
          <Button asChild size="lg" className="mt-8 w-fit">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  )
}
