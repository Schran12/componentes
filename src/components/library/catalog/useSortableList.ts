import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react'

type UseSortableListOptions<T> = {
  items: readonly T[]
  onReorder: (next: T[]) => void
  /** Retorne false para bloquear a troca entre dois índices. */
  canMove?: (from: number, to: number, items: readonly T[]) => boolean
  /** Chamado uma vez ao soltar, se a ordem final mudou em relação ao início do arraste. */
  onReorderCommit?: (previous: T[], next: T[]) => void
}

/**
 * Reordenação por arrastar com a API nativa de drag-and-drop.
 * Atualiza a lista em tempo real no `dragEnter` e confirma no `dragEnd`.
 */
export function useSortableList<T>({
  items,
  onReorder,
  canMove,
  onReorderCommit,
}: UseSortableListOptions<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const dragIndexRef = useRef<number | null>(null)
  const snapshotRef = useRef<T[] | null>(null)
  const itemsRef = useRef(items)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    dragIndexRef.current = dragIndex
  }, [dragIndex])

  const finish = useCallback(() => {
    const previous = snapshotRef.current
    const next = [...itemsRef.current]
    snapshotRef.current = null
    setDragIndex(null)
    if (!previous) return
    if (previous.length === next.length && previous.every((item, index) => item === next[index])) {
      return
    }
    onReorderCommit?.(previous, next)
  }, [onReorderCommit])

  const getItemProps = useCallback(
    (index: number) => ({
      draggable: true,
      onDragStart: (event: DragEvent) => {
        snapshotRef.current = [...itemsRef.current]
        setDragIndex(index)
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(index))
        if (event.currentTarget instanceof HTMLElement) {
          event.currentTarget.style.opacity = '0.55'
        }
      },
      onDragOver: (event: DragEvent) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
      },
      onDragEnter: (event: DragEvent) => {
        event.preventDefault()
        const from = dragIndexRef.current
        if (from === null || from === index) return
        const current = itemsRef.current
        if (canMove && !canMove(from, index, current)) return
        const next = [...current]
        const [moved] = next.splice(from, 1)
        next.splice(index, 0, moved)
        setDragIndex(index)
        onReorder(next)
      },
      onDragEnd: (event: DragEvent) => {
        if (event.currentTarget instanceof HTMLElement) {
          event.currentTarget.style.opacity = ''
        }
        finish()
      },
      onDrop: (event: DragEvent) => {
        event.preventDefault()
      },
    }),
    [canMove, finish, onReorder],
  )

  return { dragIndex, getItemProps }
}
