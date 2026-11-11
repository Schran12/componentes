#!/usr/bin/env node

/**
 * Emite uma API key localmente (sem HTTP), usando as envs do servidor.
 *
 * Uso:
 *   API_SIGNING_SECRET=... npm run api:key -- --name "projeto-cliente"
 *   npm run api:key -- --name "projeto" --ttl-days 365
 */

import { issueApiKey, isApiConfigured } from '../server/keys.mjs'
import { loadEnv } from '../server/load-env.mjs'

loadEnv()

const args = process.argv.slice(2)
let name = 'local-dev'
let ttlDays

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--name') {
    name = args[i + 1] ?? name
    i += 1
  } else if (args[i] === '--ttl-days') {
    ttlDays = Number(args[i + 1])
    i += 1
  }
}

if (!isApiConfigured()) {
  console.error('Defina API_SIGNING_SECRET no ambiente (ou em .env carregado pelo shell).')
  process.exit(1)
}

const issued = issueApiKey({ name, ttlDays })
if (!issued.ok) {
  console.error(issued.error)
  process.exit(1)
}

console.log(JSON.stringify(issued, null, 2))
console.log('\nNo projeto consumidor:')
console.log(`  npx componentes-bloomin login --api-key ${issued.key}`)
console.log(`  # ou COMPONENTES_BLOOMIN_API_KEY=${issued.key}`)
