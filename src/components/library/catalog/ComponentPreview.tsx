import { componentPreviews } from './previews'

/** Preview sempre em superfície clara — o catálogo dark não altera o fundo do componente. */
export function ComponentPreview({ id }: { id: string }) {
  return (
    <div className="preview-light min-w-0 rounded-[inherit]">
      {componentPreviews[id]?.() ?? null}
    </div>
  )
}
