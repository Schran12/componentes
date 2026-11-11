import { contentPreviews } from './content'
import { dataDisplayPreviews } from './data-display'
import { feedbackPreviews } from './feedback'
import { formsPreviews } from './forms'
import { marketingPreviews } from './marketing'
import { motionPreviews } from './motion'
import { navigationPreviews } from './navigation'
import { primitivesPreviews } from './primitives'
import type { PreviewMap } from './types'

export type { PreviewMap } from './types'

export const componentPreviews: PreviewMap = {
  ...primitivesPreviews,
  ...navigationPreviews,
  ...marketingPreviews,
  ...contentPreviews,
  ...dataDisplayPreviews,
  ...formsPreviews,
  ...feedbackPreviews,
  ...motionPreviews,
}
