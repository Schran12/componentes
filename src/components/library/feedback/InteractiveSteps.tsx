'use client'

import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type InteractiveStep = {
  title: string
  description: string
  content?: ReactNode
  icon?: ReactNode
}

export type InteractiveStepsProps = {
  title?: string
  description?: string
  steps: InteractiveStep[]
  nextLabel?: string
  previousLabel?: string
  restartLabel?: string
  className?: string
  onComplete?: () => void
}

export function InteractiveSteps({
  title,
  description,
  steps,
  nextLabel = 'Continuar',
  previousLabel = 'Voltar',
  restartLabel = 'Recomeçar',
  className,
  onComplete,
}: InteractiveStepsProps) {
  const [current, setCurrent] = useState(0)
  const reduceMotion = useReducedMotion()
  const active = steps[current]
  const complete = current === steps.length - 1

  if (!active) return null

  function advance() {
    if (complete) {
      onComplete?.()
      setCurrent(0)
      return
    }
    setCurrent((value) => Math.min(value + 1, steps.length - 1))
  }

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-xl shadow-black/5">
          <div className="border-b p-6 md:p-8">
            {title ? (
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
            ) : null}
            {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
            <div className="mt-7 flex items-center gap-2" aria-label="Progresso">
              {steps.map((step, index) => (
                <button
                  type="button"
                  key={step.title}
                  onClick={() => setCurrent(index)}
                  aria-label={`Ir para etapa ${index + 1}: ${step.title}`}
                  aria-current={index === current ? 'step' : undefined}
                  className="group flex min-w-0 flex-1 items-center gap-2 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition',
                      index < current && 'border-primary bg-primary text-primary-foreground',
                      index === current && 'border-foreground bg-foreground text-background',
                      index > current && 'bg-background text-muted-foreground',
                    )}
                  >
                    {index < current ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      'hidden truncate text-left text-xs font-medium md:block',
                      index === current ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 ? (
                    <span className="h-px min-w-3 flex-1 bg-border" aria-hidden="true" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="grid min-h-72 md:grid-cols-[0.7fr_1.3fr]">
            <div className="flex items-center justify-center bg-muted/50 p-8">
              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border bg-background text-primary shadow-lg">
                {active.icon ?? (
                  <span className="text-4xl font-bold">{String(current + 1).padStart(2, '0')}</span>
                )}
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-between p-6 md:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current}
                  initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                    Etapa {current + 1} de {steps.length}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight">{active.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{active.description}</p>
                  {active.content ? <div className="mt-5">{active.content}</div> : null}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                  disabled={current === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {previousLabel}
                </Button>
                <Button type="button" onClick={advance}>
                  {complete ? restartLabel : nextLabel}
                  {complete ? null : <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
