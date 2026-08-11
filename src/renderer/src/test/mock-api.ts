import { vi } from 'vitest'

export const createMockApi = (): Window['api'] => ({
  selectDir: vi.fn(),
  getJsonList: vi.fn(),
  readJson: vi.fn(),
  writeJson: vi.fn()
})
