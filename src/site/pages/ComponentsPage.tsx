import { ComponentCatalog } from '@/components/library/catalog/ComponentCatalog'
import { usePageTitle } from '../usePageTitle'

export function ComponentsPage() {
  usePageTitle('Componentes')
  return <ComponentCatalog />
}
