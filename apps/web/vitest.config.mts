import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  // 'server-only' throws outside Next; tests run server modules in plain Node, so it is aliased to an empty module.
  resolve: { alias: { '@': path.resolve(__dirname, 'src'), 'server-only': path.resolve(__dirname, 'eval/server-only-shim.ts') } },
  test: { environment: 'node', include: ['src/**/*.test.ts', 'tests/integration/**/*.test.ts'] },
})
