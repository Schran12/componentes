import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const mediaFrameVariants = cva('relative w-full overflow-hidden', {
  variants: {
    ratio: {
      auto: '',
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
      wide: 'aspect-[21/9]',
    },
    radius: {
      none: 'rounded-none',
      sm: 'rounded-md',
      md: 'rounded-xl',
      lg: 'rounded-2xl',
      full: 'rounded-full',
    },
    elevation: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-xl',
    },
  },
  defaultVariants: {
    ratio: 'video',
    radius: 'md',
    elevation: 'none',
  },
})

export interface MediaFrameProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof mediaFrameVariants> {
  caption?: React.ReactNode
  mediaClassName?: string
}

export const MediaFrame = React.forwardRef<HTMLElement, MediaFrameProps>(
  ({ children, caption, className, mediaClassName, ratio, radius, elevation, ...props }, ref) => (
    <figure ref={ref} className={className} {...props}>
      <div className={cn(mediaFrameVariants({ ratio, radius, elevation }), mediaClassName)}>
        {children}
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm leading-6 text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  ),
)

MediaFrame.displayName = 'MediaFrame'

export { mediaFrameVariants }
