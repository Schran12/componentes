import Image from 'next/image'

import { ExpandableTextBox } from '@/components/library/feedback/ExpandableTextBox'
import { EyebrowHeading } from '@/components/library/primitives/EyebrowHeading'
import { getAccentTone, type AccentTone } from '@/components/library/primitives/accentTones'
import { cn } from '@/lib/utils'

export type FloatingMediaArticleProps = {
  title: string
  image: { src: string; alt: string }
  paragraphs: readonly string[]
  eyebrow?: string
  caption?: string
  imagePosition?: 'left' | 'right'
  more?: { paragraphs: readonly string[]; collapsedLabel?: string; expandedLabel?: string }
  tone?: AccentTone
  className?: string
}

/** Artigo editorial com figura flutuante contornada pelo texto e bloco "leia mais" opcional. */
export function FloatingMediaArticle({
  title,
  image,
  paragraphs,
  eyebrow,
  caption,
  imagePosition = 'right',
  more,
  tone = 'glow',
  className,
}: FloatingMediaArticleProps) {
  const t = getAccentTone(tone)

  return (
    <section className={cn(t.section, className)}>
      <div className="container py-14 lg:py-16">
        <EyebrowHeading tone={tone} eyebrow={eyebrow} title={title} />

        <div className="mt-8">
          <figure
            className={cn(
              'relative mb-5 w-full overflow-hidden border sm:w-[46%] lg:w-[42%]',
              imagePosition === 'right'
                ? 'sm:float-right sm:ml-8 lg:ml-10'
                : 'sm:float-left sm:mr-8 lg:mr-10',
              t.border,
              tone === 'glow' && 'rounded-xl',
            )}
          >
            <div className={cn('relative aspect-[4/3] w-full', t.panel)}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, 46vw"
                className="object-cover"
              />
            </div>
            {caption ? (
              <figcaption
                className={cn(
                  'border-t px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em]',
                  t.border,
                  t.panel,
                  t.muted,
                )}
              >
                {caption}
              </figcaption>
            ) : null}
          </figure>

          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={cn('mb-4 text-base leading-relaxed sm:text-[1.05rem]', t.body)}
            >
              {paragraph}
            </p>
          ))}

          <div className="clear-both" />

          {more ? (
            <ExpandableTextBox
              tone={tone}
              paragraphs={more.paragraphs}
              collapsedLabel={more.collapsedLabel}
              expandedLabel={more.expandedLabel}
              className="mt-8"
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
