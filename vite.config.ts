import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { componentesApiPlugin } from './server/vite-plugin.mjs'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [react(), componentesApiPlugin()],
  resolve: {
    alias: [
      { find: /^next\/link$/, replacement: fromRoot('./src/site/next/link.tsx') },
      { find: /^next\/image$/, replacement: fromRoot('./src/site/next/image.tsx') },
      { find: /^next\/navigation$/, replacement: fromRoot('./src/site/next/navigation.ts') },
      { find: '@', replacement: fromRoot('./src') },
    ],
  },
  server: {
    port: 2004,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 2004,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
    },
  },
})
