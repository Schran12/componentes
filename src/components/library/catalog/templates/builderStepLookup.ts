import { builderSteps, stepIdForComponent } from '../builder/builderSteps'

export { stepIdForComponent }

export const stepsByIdSafe = new Map(builderSteps.map((step) => [step.id, step]))
