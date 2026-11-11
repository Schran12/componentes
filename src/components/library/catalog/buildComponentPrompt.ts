import { getInstallCommand, getRegistryUrl } from '@/lib/siteConfig'
import { categoryLabels, type CatalogComponent } from './manifest'

/** Prompt colável para IA implementar/adicionar o componente no projeto. */
export function buildComponentAiPrompt(component: CatalogComponent) {
  const installCommand = getInstallCommand(component.id)
  const registryUrl = getRegistryUrl()
  const importSnippet = `import { ${component.name} } from '${component.importPath}'`
  const deps = component.dependencies.length
    ? component.dependencies.map((dep) => `- ${dep}`).join('\n')
    : '- (nenhuma além do que o CLI já resolve)'

  return [
    `# Prompt — componente ${component.name}`,
    '',
    `Quero que você adicione o componente **${component.name}** (\`${component.id}\`) da biblioteca Componentes Bloomin no meu projeto Next.js (App Router + TypeScript + Tailwind).`,
    '',
    '## Contexto',
    '',
    `- Categoria: ${categoryLabels[component.category]}`,
    `- Descrição: ${component.description}`,
    component.client ? '- Requer `"use client"`.' : '- Pode ser Server Component.',
    component.tags.length ? `- Tags: ${component.tags.join(', ')}` : null,
    component.variants.length ? `- Variantes: ${component.variants.join(', ')}` : null,
    '',
    '## Instalação',
    '',
    '```bash',
    installCommand,
    '```',
    '',
    '## Import',
    '',
    '```tsx',
    importSnippet,
    '```',
    '',
    '## Dependências',
    '',
    deps,
    '',
    '## Exemplo de uso',
    '',
    '```tsx',
    component.example.trim(),
    '```',
    '',
    '## Regras',
    '',
    '1. Não invente props, variantes ou caminhos de import.',
    '2. Use o `importPath` e o exemplo acima como referência.',
    '3. Preserve acessibilidade e responsividade do componente.',
    '4. Se precisar de mais contexto, consulte:',
    `   - ${registryUrl}/llms.txt`,
    `   - ${registryUrl}/registry/ai-context.json`,
    `   - ${registryUrl}/componentes/${component.id}`,
    '5. Ao final, diga quais arquivos criou ou alterou.',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n')
}
