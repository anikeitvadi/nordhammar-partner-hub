import { defineConfig } from 'vitest/config'
import { workflow } from '@workflow/vitest'
import path from 'node:path'
// In-process workflow runs against a fresh Local World per worker. No dev server, no deploy.
export default defineConfig({ plugins: [workflow()], resolve: { alias: { '@': path.resolve(__dirname, 'src') } }, test: { environment: 'node', include: ['tests/workflow/**/*.workflow.test.ts'], testTimeout: 60_000 } })
