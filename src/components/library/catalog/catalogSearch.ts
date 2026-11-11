import { categoryLabels, type CatalogComponent } from './manifest'

export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
}

function fuzzyIncludes(value: string, token: string) {
  if (value.includes(token)) return true
  if (token.length < 3) return false

  let tokenIndex = 0
  for (const character of value) {
    if (character === token[tokenIndex]) tokenIndex += 1
    if (tokenIndex === token.length) return true
  }
  return false
}

export function componentSearchScore(component: CatalogComponent, tokens: string[]) {
  if (!tokens.length) return 0

  const weightedFields = [
    { value: component.name, weight: 12 },
    { value: component.id, weight: 12 },
    ...component.tags.map((value) => ({ value, weight: 9 })),
    ...component.variants.map((value) => ({ value, weight: 7 })),
    ...component.props.flatMap((item) => [
      { value: item.name, weight: 8 },
      { value: item.type, weight: 5 },
      { value: item.description, weight: 4 },
    ]),
    { value: component.description, weight: 6 },
    { value: categoryLabels[component.category], weight: 4 },
    ...component.dependencies.map((value) => ({ value, weight: 3 })),
  ].map((field) => ({ ...field, normalized: normalizeSearch(field.value) }))

  let total = 0
  for (const token of tokens) {
    let best = 0
    for (const field of weightedFields) {
      if (field.normalized === token) best = Math.max(best, field.weight + 8)
      else if (field.normalized.startsWith(token)) best = Math.max(best, field.weight + 5)
      else if (field.normalized.includes(token)) best = Math.max(best, field.weight + 3)
      else if (fuzzyIncludes(field.normalized, token)) best = Math.max(best, field.weight)
    }
    if (!best) return -1
    total += best
  }
  return total
}
