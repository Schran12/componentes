import type { HTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ProgressStep = {
  label: string
  description?: string
  icon?: ReactNode
}

export interface ProgressStepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  steps: readonly ProgressStep[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  variant?: 'numbered' | 'compact'
  label?: string
}

export function ProgressSteps({
  steps,
  currentStep,
  orientation = 'horizontal',
  variant = 'numbered',
  label = 'Progresso',
  className,
  ...props
}: ProgressStepsProps) {
  return (
    <ol
      aria-label={label}
      className={cn(
        'flex',
        orientation === 'horizontal'
          ? 'w-full flex-col gap-4 sm:flex-row sm:gap-0'
          : 'flex-col gap-0',
        className,
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const position = index + 1
        const completed = position < currentStep
        const current = position === currentStep
        return (
          <li
            key={`${step.label}-${index}`}
            aria-current={current ? 'step' : undefined}
            className={cn(
              'relative flex min-w-0',
              orientation === 'horizontal' ? 'flex-1 items-start' : 'min-h-20',
            )}
          >
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bg-border',
                  orientation === 'horizontal'
                    ? 'left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] sm:block'
                    : 'bottom-0 left-5 top-10 w-px',
                  completed && 'bg-primary',
                )}
              />
            ) : null}
            <div
              className={cn(
                'relative z-10 flex min-w-0',
                orientation === 'horizontal'
                  ? 'w-full flex-col items-center text-center sm:pr-4'
                  : 'items-start gap-4',
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold transition-colors',
                  completed && 'border-primary bg-primary text-primary-foreground',
                  current && 'border-primary text-primary ring-4 ring-primary/10',
                )}
              >
                {completed ? (
                  <Check className="h-5 w-5" aria-label="Concluído" />
                ) : (
                  (step.icon ?? (variant === 'numbered' ? position : null))
                )}
              </span>
              <div className={cn(orientation === 'horizontal' && 'mt-3')}>
                <span
                  className={cn(
                    'block font-medium',
                    !completed && !current && 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
                {step.description && variant !== 'compact' ? (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {step.description}
                  </span>
                ) : null}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
