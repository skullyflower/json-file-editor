import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['browser']
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/renderer/src/test/setup.ts'],
    include: ['src/renderer/src/**/*.{test,spec}.ts'],
    restoreMocks: true,
    coverage: {
      include: ['src/renderer/src/**'],
      exclude: ['src/renderer/src/test/**', 'src/renderer/src/**/*.{test,spec}.ts']
    }
  }
})
