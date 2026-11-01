import { defineConfig } from 'vitest/config'
import path from 'node:path'
export default defineConfig({ resolve: { alias: { '@': path.resolve(__dirname, 'src'), 'server-only': path.resolve(__dirname, 'eval/server-only-shim.ts') } }, test: { environment: 'node', include: ['eval/live.test.ts', 'eval/fallback.test.ts'], testTimeout: 600_000, passWithNoTests: true } })
