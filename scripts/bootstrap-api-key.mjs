#!/usr/bin/env node

import { randomBytes } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { issueApiKey } from '../server/keys.mjs'

const root = resolve(import.meta.dirname, '..')
const signing = randomBytes(32).toString('hex')
const admin = randomBytes(32).toString('hex')

process.env.API_SIGNING_SECRET = signing
process.env.API_ADMIN_SECRET = admin

const issued = issueApiKey({ name: 'componentes-bloomin' })
if (!issued.ok) {
  console.error(issued.error)
  process.exit(1)
}

const env = `# Catálogo público
VITE_SITE_URL=https://componentes-indol.vercel.app
VITE_REGISTRY_URL=https://componentes-indol.vercel.app
NEXT_PUBLIC_SITE_URL=https://componentes-indol.vercel.app
NEXT_PUBLIC_REGISTRY_URL=https://componentes-indol.vercel.app

# API — mantenha iguais no deploy da VPS
API_SIGNING_SECRET=${signing}
API_ADMIN_SECRET=${admin}

# Key oficial da biblioteca (projetos consumidores)
COMPONENTES_BLOOMIN_API_KEY=${issued.key}
`

writeFileSync(resolve(root, '.env'), env)

const meta = {
  name: issued.name,
  id: issued.id,
  createdAt: issued.createdAt,
  expiresAt: issued.expiresAt,
  registry: 'https://componentes-indol.vercel.app',
  key: issued.key,
  usage: {
    header: `Authorization: Bearer ${issued.key}`,
    cli: `npx componentes-bloomin login --api-key ${issued.key} --registry https://componentes-indol.vercel.app`,
    env: `COMPONENTES_BLOOMIN_API_KEY=${issued.key}`,
  },
}

writeFileSync(
  resolve(root, 'componentes-bloomin.api-key.json'),
  `${JSON.stringify(meta, null, 2)}\n`,
)

console.log('✓ .env criado com API_SIGNING_SECRET e API_ADMIN_SECRET')
console.log('✓ componentes-bloomin.api-key.json criado com a key oficial')
console.log('')
console.log(issued.key)
