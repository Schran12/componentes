import type { HTMLAttributes, ReactNode } from 'react'
import { Check, Minus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ComparisonValue = ReactNode | boolean | null
export type ComparisonColumn = { key: string; label: string; highlighted?: boolean }
export type ComparisonRow = { label: string; values: Record<string, ComparisonValue> }

export interface ComparisonTableProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  caption: string
  description?: string
  columns: readonly ComparisonColumn[]
  rows: readonly ComparisonRow[]
  firstColumnLabel?: string
  emptyMessage?: string
}

function Value({ value }: { value: ComparisonValue }) {
  if (value === true)
    return <Check className="mx-auto h-5 w-5 text-emerald-600" aria-label="Incluído" />
  if (value === false)
    return <X className="mx-auto h-5 w-5 text-muted-foreground" aria-label="Não incluído" />
  if (value == null)
    return <Minus className="mx-auto h-5 w-5 text-muted-foreground" aria-label="Não informado" />
  return <>{value}</>
}

export function ComparisonTable({
  caption,
  description,
  columns,
  rows,
  firstColumnLabel = 'Recurso',
  emptyMessage = 'Nenhum item para comparar.',
  className,
  ...props
}: ComparisonTableProps) {
  return (
    <section className={cn('w-full', className)} {...props}>
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{caption}</h2>
        {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
      </div>
      {!columns.length || !rows.length ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="bg-muted/60">
              <tr>
                <th scope="col" className="p-4 font-semibold">
                  {firstColumnLabel}
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn(
                      'p-4 text-center font-semibold',
                      column.highlighted && 'bg-primary/10 text-primary',
                    )}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t transition-colors hover:bg-muted/30">
                  <th scope="row" className="p-4 font-medium">
                    {row.label}
                  </th>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'p-4 text-center text-muted-foreground',
                        column.highlighted && 'bg-primary/5',
                      )}
                    >
                      <Value value={row.values[column.key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
