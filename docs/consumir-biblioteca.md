# Como puxar os componentes do catálogo Bloomin

Documento para o time: o colega cola **um JSON** no projeto Next.js e roda **um comando**. Sem login.

- Catálogo: https://componentes-indol.vercel.app/componentes
- Guia no site: https://componentes-indol.vercel.app/como-utilizar
- PDF: [`consumir-biblioteca.pdf`](consumir-biblioteca.pdf)

---

## O que você precisa mandar ao colega

1. Este arquivo (`docs/consumir-biblioteca.md`) **ou** o PDF
2. O JSON pronto: [`componentes-bloomin.json`](componentes-bloomin.json)

Ele só precisa dos requisitos abaixo + colar o JSON + rodar o mirror.

---

## Requisitos do projeto dele

- Next.js (App Router) + TypeScript
- pasta `src/` com alias `@/*`
- Tailwind CSS **3**

---

## Passo a passo (no projeto do colega)

### 1. Colar o JSON na raiz

Crie `componentes-bloomin.json` **na raiz** (ao lado do `package.json`):

```json
{
  "registry": "https://componentes-indol.vercel.app",
  "apiKey": "cb_live_eyJuYW1lIjoiY29tcG9uZW50ZXMtYmxvb21pbiIsImlhdCI6MTc5MzcxOTAwOSwianRpIjoiMjFiY2ZiMmQwZjNkNGVlMmI2YjA5NmMzMzQyYjk5YWMifQ.N2JBB_hQt7d2rgNa3_IKtBZhZx0YB9_tR0C3hls9LI8",
  "syncMode": "mirror"
}
```

| Campo | Valor |
| ----- | ----- |
| `registry` | `https://componentes-indol.vercel.app` |
| `apiKey` | a key `cb_live_…` do JSON acima |
| `syncMode` | `mirror` |

### 2. Baixar / espelhar a biblioteca

```bash
npx componentes-bloomin@latest mirror
```

Isso autentica com a key, aplica o tema e copia os componentes para `src/components/library`.

### 3. Usar no código

```tsx
import { TeamSection } from '@/components/library/data-display/TeamSection'

export default function Page() {
  return <TeamSection title="Nossa equipe" members={membros} />
}
```

Exemplo do Polaroid Line Carousel:

```tsx
import PolaroidLineCarousel from '@/components/library/content/PolaroidLineCarousel'

export default function Page() {
  return <PolaroidLineCarousel height="100svh" />
}
```

---

## Comandos úteis depois

| Precisa | Comando |
| ------- | ------- |
| Continuar atualizando em tempo real | `npx componentes-bloomin@latest watch` |
| Atualizar agora / CI | `npx componentes-bloomin@latest sync` |
| Só um componente | `npx componentes-bloomin@latest add polaroid-line-carousel` |
| Listar o que tem no catálogo | `npx componentes-bloomin@latest list` |

---

## Resumo (mensagem curta para colar no chat)

```text
1. Projeto: Next.js App Router + TS + src/@ + Tailwind 3
2. Cola este JSON na raiz como componentes-bloomin.json
   (registry + apiKey + syncMode: mirror)
3. Roda: npx componentes-bloomin@latest mirror
4. Importa de @/components/library/...
Catálogo: https://componentes-indol.vercel.app/componentes
```

---

## Consumir por API em outra aplicação (sem CLI)

Para uma aplicação própria (ex.: o wizard do boilerplate) listar **todos** os componentes e perceber sozinha
quando entra um novo. Todas as rotas usam `Authorization: Bearer <apiKey>`.

| Rota | O que devolve |
| ---- | ------------- |
| `GET /api/v1/feed` | Lista de **todos** os itens (233 componentes + receitas) com metadados: `stage`, `category`, `role`, `topics`, `tags`, `importPath`, `dependencies` (npm), `hash`, `metaHash`. Traz também `libraryHash`, `counts` e `stages` (etapa → quantidade) |
| `GET /api/v1/item/:name` | Um item completo: `meta` (props, variantes, exemplo), `dependencies` e `files` (inclui os arquivos de UI/lib de que ele depende) |
| `GET /api/v1/bundle?names=a,b,c` ou `?stage=faq` | Vários itens numa só resposta. O que passar de ~3,5 MB volta em `remaining`: peça de novo só esses nomes |
| `GET /api/v1/registry/componentes-bloomin` | A biblioteca inteira numa resposta (arquivos sem duplicar, ~2,5 MB) |
| `GET /api/v1/theme` | `tailwind.config.js` e `globals.css` do tema |

**Etapas (`stage`):** `topbar`, `header`, `hero`, `sobre`, `servicos`, `diferenciais`, `equipe`, `depoimentos`,
`faq`, `cta`, `contato`, `footer`, `breadcrumbs`, `blog`, `flutuantes`, `cards`, `galeria`. Componentes sem etapa
(`stage: null`) são primitivos, efeitos e peças de interface.

**Atualizar sozinho:** consulte o `feed` de tempos em tempos mandando `If-None-Match` com o `ETag` anterior. A
API responde `304` (sem corpo) enquanto nada mudou. Quando vier `200`, compare `hash` (arquivos) e `metaHash`
(metadados) de cada item com os que você guardou: item novo, alterado ou removido aparece na diferença. Um
componente novo entra no feed assim que o deploy da biblioteca termina (o registry é gerado no `npm run build`).

```js
const registry = 'https://componentes-indol.vercel.app'
const headers = { Authorization: `Bearer ${process.env.COMPONENTES_BLOOMIN_API_KEY}` }

let etag = null
let known = new Map() // name -> `${hash}:${metaHash}`

async function poll() {
  const res = await fetch(`${registry}/api/v1/feed`, {
    headers: { ...headers, ...(etag ? { 'If-None-Match': etag } : {}) },
  })
  if (res.status === 304) return // nada mudou
  if (!res.ok) throw new Error(`feed: HTTP ${res.status}`)
  etag = res.headers.get('etag')
  const feed = await res.json()

  const changed = feed.items.filter((i) => known.get(i.name) !== `${i.hash}:${i.metaHash}`)
  const removed = [...known.keys()].filter((n) => !feed.items.some((i) => i.name === n))
  if (changed.length) {
    const names = changed.filter((i) => i.kind === 'component').map((i) => i.name)
    const bundle = await fetch(`${registry}/api/v1/bundle?names=${names.join(',')}`, { headers }).then((r) => r.json())
    // bundle.items -> [{ name, meta, dependencies, files }]; bundle.remaining -> nomes que não couberam
  }
  known = new Map(feed.items.map((i) => [i.name, `${i.hash}:${i.metaHash}`]))
}
```

---

## Atenção

- O modo `mirror` **sobrescreve** `src/components/library` — customize por **props**, não editando o código espelhado.
- Não precisa de login: a `apiKey` no JSON já autentica a API (`Authorization: Bearer …`).
- A key abaixo é a key oficial do time para consumo do catálogo.
