import Image from 'next/image'

import { cn } from '@/lib/utils'

export type AccentTestimonial = {
  name: string
  content: string
  role?: string
  avatar?: string
  rating?: number
}

export function TestimonialAvatar({
  name,
  src,
  className,
}: {
  name: string
  src?: string
  className?: string
}) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <span
      className={cn(
        'relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden text-sm font-semibold',
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes="48px" className="object-cover" />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </span>
  )
}
