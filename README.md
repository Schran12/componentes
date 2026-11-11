# Componentes Bloomin

Biblioteca com componentes React, TypeScript e Tailwind, distribuídos por CLI próprio — no modelo
copy-into-project (como o shadcn/ui).

## Executar o catálogo

```bash
npm install
npm run dev
```

Catálogo público: https://componentes-indol.vercel.app/componentes  
Local: http://localhost:2004/componentes · Montar: `/montar-pagina` · Assistente: `/assistente`

O site do catálogo roda em **Vite**. Os componentes instalados no seu projeto são pensados para
**Next.js (App Router)** + Tailwind CSS 3. Requisito: Node 22.

### Assistente do catálogo

Abra `/assistente`. Responde no navegador com base nos templates e componentes do projeto —
sem API key.

## Usar em outro projeto

Guia do consumidor (mirror + API key):
[`docs/consumir-biblioteca.md`](docs/consumir-biblioteca.md) ·
[PDF](docs/consumir-biblioteca.pdf).

**1. Crie o projeto** sem Tailwind (ele é adicionado na versão 3):

```bash
npx create-next-app@latest meu-site --ts --eslint --app --src-dir --import-alias "@/*" --no-tailwind
cd meu-site
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

**2. Inicialize o tema (sem URL do catálogo):**

```bash
npx componentes-bloomin init
```

O `init` cria `componentes-bloomin.json` e copia `tailwind.config.js` + `src/app/globals.css`.
`--registry` é opcional (pasta local ou URL) só se você quiser apontar para outra fonte.

**3. Instale um template ou componentes:**

```bash
npx componentes-bloomin recipes                         # templates disponíveis
npx componentes-bloomin add recipe:institutional          # site institucional
npx componentes-bloomin add recipe:industrial             # site industrial
npx componentes-bloomin add recipe:institutional-corporate
npx componentes-bloomin add recipe:industrial-services
npx componentes-bloomin add navbar-accent faq-bordered    # avulsos
npx componentes-bloomin add all                           # biblioteca completa
npx componentes-bloomin list
```

No catálogo web, use **Baixar ZIP** em qualquer componente/template para levar os arquivos
sem CLI e sem vincular à URL do site.

Se o CLI ainda não estiver publicado no npm, registre o bin local uma vez:

```bash
cd cli && npm link
```

Depois use `componentes-bloomin` no lugar de `npx componentes-bloomin@latest`.

**4. Use:**

```tsx
import { TeamSection } from '@/components/library/data-display/TeamSection'

export default function Page() {
  return <TeamSection title="Nossa equipe" members={membros} />
}
```

Componentes marcados como `client` no catálogo já têm `'use client'`.

**Imagens externas:** libere o domínio em `next.config`:

```ts
images: {
  remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }]
}
```

**Atualizar:** rode `add` de novo. Arquivos alterados são mantidos; use `--overwrite` para
substituir. Outras opções: `--skip-install`, `--skip-theme` (no init) e `--package-manager pnpm`.

### Consumir no outro projeto (API + key, sem login)

1. Copie [`docs/componentes-bloomin.json`](docs/componentes-bloomin.json) para a raiz do outro projeto (já traz a key).
2. Rode:

```bash
npx componentes-bloomin mirror
```

Consome `https://componentes-indol.vercel.app/api/v1/*` com a key do JSON e atualiza sozinho.

Guia: [`docs/consumir-biblioteca.md`](docs/consumir-biblioteca.md) · [PDF](docs/consumir-biblioteca.pdf).

## Templates

| ID                               | Uso                                    |
| -------------------------------- | -------------------------------------- |
| `recipe:institutional`           | Empresa / serviços profissionais       |
| `recipe:institutional-corporate` | Corporativo com equipe, FAQ e CTA      |
| `recipe:industrial`              | Indústria / manufatura B2B             |
| `recipe:industrial-services`     | Tratamento de superfície (modelo Axis) |
| `recipe:saas`                    | Produto SaaS                           |
| `recipe:ecommerce`               | Loja / vitrine                         |
| `recipe:agency`                  | Agência ou portfólio                   |
| `recipe:landing-page`            | Landing curta                          |

No catálogo, **Templates** leva ao montador (`/montar-pagina?recipe=<id>`) com as seções
pré-selecionadas. Também dá para montar do zero em `/montar-pagina`.

## Montar uma página

Em `/montar-pagina`:

1. Escolha componentes em cada etapa (header, hero, conteúdo…).
2. Ajuste a ordem das seções.
3. Veja o **preview ao vivo**.
4. Gere o Markdown com a página, arquivos e instruções para a IA.

## Estrutura

```text
src/components/library/
├── primitives/ navigation/ marketing/ content/
├── data-display/ forms/ feedback/ motion/
├── index.ts
└── catalog/
    ├── ComponentCatalog.tsx
    ├── layoutRecipes.ts          # templates institucionais, industriais, etc.
    ├── manifest/<categoria>.ts
    ├── previews/<categoria>.tsx
    └── builder/                  # /montar-pagina
```

## Adicionar um componente

```bash
npm run component:add -- AlertCard feedback --description "Alerta com ícone e ação."
npm run format
npm run registry:build
npm run lint
```

Confira em http://localhost:2004/componentes. Com `watch --mirror` no outro projeto,
o componente novo entra automaticamente após o deploy do catálogo.

## Comandos

```bash
npm run dev               # catálogo (Vite, porta 2004)
npm run component:add     # cria e registra um componente
npm run registry:build    # gera public/registry (+ recipes)
npm run validate          # formatação, lint, tipos e build
```

## Documentação

- Catálogo: https://componentes-indol.vercel.app/componentes
- Guia: https://componentes-indol.vercel.app/como-utilizar
- Receitas: https://componentes-indol.vercel.app/registry/recipes.json
- Consumir no outro projeto: [`docs/consumir-biblioteca.md`](docs/consumir-biblioteca.md) · [PDF](docs/consumir-biblioteca.pdf)

`VITE_REGISTRY_URL` / `VITE_SITE_URL` padrão: `https://componentes-indol.vercel.app`
