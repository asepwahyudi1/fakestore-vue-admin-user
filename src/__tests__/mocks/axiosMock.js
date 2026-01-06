import { vi } from 'vitest'

export const createAxiosMock = () => {
  const mockGet = vi.fn()
  const mockPost = vi.fn()
  const mockPut = vi.fn()
  const mockDelete = vi.fn()

  const axiosMock = {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  }

  return {
    axiosMock,
    mockGet,
    mockPost,
    mockPut,
    mockDelete,
  }
}

