import { vi, beforeEach } from 'vitest'
import { config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// Mock fetch globally
global.fetch = vi.fn()

// Setup Pinia for tests
beforeEach(() => {
  setActivePinia(createPinia())
})

// Configure Vue Test Utils
config.global.plugins = [createPinia()]

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
}
