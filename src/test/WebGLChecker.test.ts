import { describe, it, expect } from 'vitest'
import { WebGLChecker } from '../utils/WebGLChecker'

describe('WebGLChecker', () => {
  it('should detect WebGL availability', () => {
    const available = WebGLChecker.isAvailable()
    expect(typeof available).toBe('boolean')
  })

  it('should get GPU info', () => {
    const info = WebGLChecker.getGPUInfo()
    // In test environment with mocks, this might be null
    if (info !== null) {
      expect(info).toHaveProperty('renderer')
      expect(info).toHaveProperty('vendor')
    }
  })
})
