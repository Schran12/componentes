'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastMessage = {
  title: string
  description?: string
  variant?: 'default' | 'success' | 'destructive'
  duration?: number
}
type ToastRecord = ToastMessage & { id: number }
type ToastContextValue = { toast: (message: ToastMessage) => void }
const ToastContext = createContext<ToastContextValue | null>(null)

export type ToastProviderProps = { children: ReactNode; defaultDuration?: number }

export function ToastProvider({ children, defaultDuration = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const toast = useCallback((message: ToastMessage) => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { ...message, id }])
  }, [])
  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider duration={defaultDuration} swipeDirection="right">
        {children}
        {toasts.map((item) => (
          <ToastPrimitive.Root
            key={item.id}
            duration={item.duration}
            defaultOpen
            onOpenChange={(open) => {
              if (!open)
                setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id))
            }}
            className={cn(
              'relative grid w-full gap-1 rounded-xl border bg-background p-4 pr-10 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out',
              item.variant === 'success' && 'border-emerald-500/40',
              item.variant === 'destructive' && 'border-destructive/40',
            )}
          >
            <ToastPrimitive.Title className="text-sm font-semibold">
              {item.title}
            </ToastPrimitive.Title>
            {item.description ? (
              <ToastPrimitive.Description className="text-sm text-muted-foreground">
                {item.description}
              </ToastPrimitive.Description>
            ) : null}
            <ToastPrimitive.Close
              className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Fechar notificação"
            >
              <X className="h-4 w-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-sm" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider.')
  return context
}
