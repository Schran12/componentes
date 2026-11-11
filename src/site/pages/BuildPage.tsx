import { PageBuilder } from '@/components/library/catalog/builder/PageBuilder'
import { usePageTitle } from '../usePageTitle'

export function BuildPage() {
  usePageTitle('Montar página')
  return <PageBuilder />
}
