import { contentComponents } from './content'
import { dataDisplayComponents } from './data-display'
import { feedbackComponents } from './feedback'
import { formsComponents } from './forms'
import { marketingComponents } from './marketing'
import { motionComponents } from './motion'
import { navigationComponents } from './navigation'
import { primitivesComponents } from './primitives'

export {
  catalogCategories,
  categoryLabels,
  type CatalogCategory,
  type CatalogComponent,
  type CatalogProp,
} from './schema'

export const componentManifest = [
  ...primitivesComponents,
  ...navigationComponents,
  ...marketingComponents,
  ...contentComponents,
  ...dataDisplayComponents,
  ...formsComponents,
  ...feedbackComponents,
  ...motionComponents,
]
