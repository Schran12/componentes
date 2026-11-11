import type { ButtonHTMLAttributes, ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type HoverButtonEffect = 'lift' | 'shine' | 'slide' | 'glow' | 'underline' | 'expand-icon'

export interface HoverButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: ReactNode
  href?: string
  effect?: HoverButtonEffect
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const effectClasses: Record<HoverButtonEffect, string> = {
  lift: 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0',
  shine:
    'relative overflow-hidden before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-12 before:bg-white/30 before:blur-sm before:transition-all before:duration-500 hover:before:left-[120%]',
  slide:
    'relative overflow-hidden border-primary bg-transparent text-primary before:absolute before:inset-0 before:-translate-x-full before:bg-primary before:transition-transform before:duration-300 hover:text-primary-foreground hover:before:translate-x-0',
  glow: 'transition-all duration-300 hover:shadow-[0_0_28px_hsl(var(--primary)/0.45)]',
  underline:
    'relative rounded-none bg-transparent text-foreground after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:bg-transparent hover:after:left-0 hover:after:w-full',
  'expand-icon': 'group transition-all duration-300 hover:pr-6',
}

export function HoverButton({
  children,
  href,
  effect = 'lift',
  variant = 'default',
  size = 'default',
  icon,
  iconPosition = 'right',
  className,
  type = 'button',
  ...props
}: HoverButtonProps) {
  const trailingIcon =
    effect === 'expand-icon' && !icon ? <ArrowRight className="h-4 w-4" aria-hidden /> : icon

  const content = (
    <>
      {iconPosition === 'left' ? trailingIcon : null}
      <span className="relative z-10">{children}</span>
      {iconPosition === 'right' ? trailingIcon : null}
    </>
  )

  const classes = cn(
    'gap-2',
    effectClasses[effect],
    effect === 'expand-icon' &&
      '[&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-1',
    className,
  )

  if (href) {
    return (
      <Button asChild variant={variant} size={size} className={classes}>
        <Link href={href}>{content}</Link>
      </Button>
    )
  }

  return (
    <Button type={type} variant={variant} size={size} className={classes} {...props}>
      {content}
    </Button>
  )
}
