import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const sectionShellVariants = cva('w-full', {
  variants: {
    spacing: {
      none: '',
      sm: 'py-8 md:py-12',
      md: 'py-12 md:py-16',
      lg: 'py-16 md:py-24',
      xl: 'py-20 md:py-32',
    },
    tone: {
      default: 'bg-background text-foreground',
      muted: 'bg-muted/50 text-foreground',
      primary: 'bg-primary text-primary-foreground',
      transparent: 'bg-transparent text-foreground',
    },
  },
  defaultVariants: {
    spacing: 'lg',
    tone: 'default',
  },
})

export interface SectionShellProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionShellVariants> {
  containerClassName?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'full'
}

const containerSizes: Record<NonNullable<SectionShellProps['containerSize']>, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  full: 'max-w-none',
}

export const SectionShell = React.forwardRef<HTMLElement, SectionShellProps>(
  (
    { children, className, containerClassName, containerSize = 'lg', spacing, tone, ...props },
    ref,
  ) => (
    <section
      ref={ref}
      className={cn(sectionShellVariants({ spacing, tone }), className)}
      {...props}
    >
      <div
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          containerSizes[containerSize],
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  ),
)

SectionShell.displayName = 'SectionShell'

export { sectionShellVariants }
