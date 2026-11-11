import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type CTAInlineProps = {
  title: string
  description?: string
  action: { label: string; href: string }
  className?: string
}

export function CTAInline({ title, description, action, className }: CTAInlineProps) {
  return (
    <aside
      className={cn(
        'flex flex-col gap-5 rounded-2xl border bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8',
        className,
      )}
      aria-label={title}
    >
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <Button asChild className="shrink-0">
        <Link href={action.href}>
          {action.label}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </aside>
  )
}
