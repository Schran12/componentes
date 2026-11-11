import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const headingVariants = cva('text-balance font-semibold tracking-tight', {
  variants: {
    size: {
      sm: 'text-2xl md:text-3xl',
      md: 'text-3xl md:text-4xl',
      lg: 'text-4xl md:text-5xl lg:text-6xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface SectionHeadingProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof headingVariants> {
  title: React.ReactNode
  eyebrow?: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  titleAs?: 'h1' | 'h2' | 'h3'
}

const alignments: Record<NonNullable<SectionHeadingProps['align']>, string> = {
  left: 'items-start text-left',
  center: 'mx-auto items-center text-center',
  right: 'ml-auto items-end text-right',
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = 'left',
  titleAs: Title = 'h2',
  size,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn('flex max-w-3xl flex-col', alignments[align], className)} {...props}>
      {eyebrow ? (
        <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </div>
      ) : null}
      <Title className={headingVariants({ size })}>{title}</Title>
      {description ? (
        <div className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </div>
      ) : null}
    </div>
  )
}

export { headingVariants }
