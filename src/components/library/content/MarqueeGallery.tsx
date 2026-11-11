import Image from 'next/image'

import { Marquee } from '@/components/library/motion/Marquee'
import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type MarqueeGalleryItem = {
  src: string
  alt: string
  caption?: string
}

export type MarqueeGalleryProps = {
  items: readonly MarqueeGalleryItem[]
  title?: string
  eyebrow?: string
  description?: string
  rows?: 1 | 2
  speed?: number
  tone?: AccentTone
  className?: string
}

/** Galeria em faixas horizontais infinitas, com a segunda linha em sentido oposto. */
export function MarqueeGallery({
  items,
  title,
  eyebrow,
  description,
  rows = 2,
  speed = 40,
  tone = 'glow',
  className,
}: MarqueeGalleryProps) {
  const t = getAccentTone(tone)
  const half = Math.ceil(items.length / 2)
  const lines = rows === 2 && items.length > 3 ? [items.slice(0, half), items.slice(half)] : [items]

  return (
    <section className={cn('overflow-hidden py-14 lg:py-16', t.section, className)}>
      {title ? (
        <div className="container">
          <EyebrowHeading
            tone={tone}
            eyebrow={eyebrow}
            title={title}
            description={description}
            layout="split"
            className="mb-10"
          />
        </div>
      ) : null}

      <div className="space-y-4">
        {lines.map((line, lineIndex) => (
          <Marquee
            key={lineIndex}
            speed={speed}
            gap={16}
            direction={lineIndex % 2 === 0 ? 'left' : 'right'}
            ariaLabel={lineIndex === 0 ? 'Galeria de imagens' : undefined}
          >
            {line.map((item) => (
              <figure
                key={item.src + item.alt}
                className={cn(
                  'group relative h-56 w-72 shrink-0 overflow-hidden sm:h-64 sm:w-96',
                  tone === 'glow' ? 'rounded-2xl' : 'rounded-none',
                  t.panel,
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="384px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.caption ? (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-sm font-semibold text-white">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  )
}
