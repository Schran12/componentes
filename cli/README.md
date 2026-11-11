# componentes-bloomin

CLI oficial — consome a biblioteca via **API + key**, sem login.

## No outro projeto

1. Copie `docs/componentes-bloomin.json` para a raiz (já inclui a key).
2. Rode:

```bash
npx componentes-bloomin mirror
```

A CLI lê `apiKey` do JSON e chama:

- `GET /api/v1/feed`
- `GET /api/v1/registry/:id`
- `GET /api/v1/theme`

## Outros comandos

```bash
npx componentes-bloomin watch
npx componentes-bloomin sync
npx componentes-bloomin list
npx componentes-bloomin recipes
npx componentes-bloomin add faq-search
```

Guia: `docs/consumir-biblioteca.md`

Requer Node.js 18+ e Next.js (App Router) com Tailwind CSS 3.
