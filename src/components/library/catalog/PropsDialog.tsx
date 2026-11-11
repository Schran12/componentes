'use client'

import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import type { CatalogProp } from './manifest'

export type PropsDialogProps = {
  title: string
  props: readonly CatalogProp[]
  variants: readonly string[]
  triggerLabel?: string
  triggerClassName?: string
}

export function PropsDialog({
  title,
  props,
  variants,
  triggerLabel = 'Props',
  triggerClassName,
}: PropsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline" className={triggerClassName}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[88vh] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-5 py-4 pr-12">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Props aceitas pelo componente. Itens com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="pb-2 pr-4 font-medium">Prop</th>
                <th className="pb-2 pr-4 font-medium">Tipo</th>
                <th className="pb-2 font-medium">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {props.map((item) => (
                <tr className="border-b align-top last:border-0" key={item.name}>
                  <td className="py-3 pr-4 font-mono text-xs">
                    {item.name}
                    {item.required ? <span className="text-destructive">*</span> : null}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{item.type}</td>
                  <td className="py-3 text-muted-foreground">
                    {item.description}
                    {item.default ? (
                      <span className="mt-1 block font-mono text-xs">Padrão: {item.default}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {variants.length ? (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-semibold">Variantes</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {variants.map((variant) => (
                  <span
                    key={variant}
                    className="rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
