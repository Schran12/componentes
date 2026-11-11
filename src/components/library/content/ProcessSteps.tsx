import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ProcessStepsProps = {
  title: string
  description?: string
  steps: Array<{ title: string; description: string }>
  className?: string
}

export function ProcessSteps({ title, description, steps, className }: ProcessStepsProps) {
  return (
    <section
      className={cn('bg-muted/30 py-16 md:py-24', className)}
      aria-labelledby="process-title"
    >
      <div className="container">
        <div className="max-w-2xl">
          <h2 id="process-title" className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          {description ? <p className="mt-4 text-lg text-muted-foreground">{description}</p> : null}
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border bg-background p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              {index === steps.length - 1 ? (
                <Check className="absolute right-5 top-5 h-5 w-5 text-primary" aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
