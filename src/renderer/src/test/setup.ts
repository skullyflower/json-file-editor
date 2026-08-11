import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/svelte'
import { createMockApi } from './mock-api'

beforeEach(() => {
  window.api = createMockApi()
  vi.stubGlobal('alert', vi.fn())
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
})
