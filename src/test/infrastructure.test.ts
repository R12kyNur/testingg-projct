/**
 * Test to verify the testing infrastructure is working correctly
 * This validates that Vitest, jsdom, and WebGL mocks are properly configured
 */

import { describe, expect, it } from 'vitest'

describe('Testing Infrastructure', () => {
  it('should have jsdom environment available', () => {
    // Check that we're in a browser-like environment
    expect(window).toBeDefined()
    expect(document).toBeDefined()
  })

  it('should have WebGL mock available', () => {
    // Create a canvas and get WebGL context
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')

    expect(gl).not.toBeNull()
  })

  it('should have WebGL2 mock available', () => {
    const canvas = document.createElement('canvas')
    const gl2 = canvas.getContext('webgl2')

    expect(gl2).not.toBeNull()
  })

  it('should have requestAnimationFrame mocked', () => {
    expect(typeof requestAnimationFrame).toBe('function')
    expect(typeof cancelAnimationFrame).toBe('function')
  })

  it('should have ResizeObserver mocked', () => {
    expect(typeof ResizeObserver).toBe('function')
    const observer = new ResizeObserver()
    expect(observer).toBeDefined()
  })

  it('should have IntersectionObserver mocked', () => {
    expect(typeof IntersectionObserver).toBe('function')
    const observer = new IntersectionObserver(() => {})
    expect(observer).toBeDefined()
  })

  it('should support ES modules', () => {
    // Test that ES module syntax works
    const fn = () => import('vitest')
    expect(fn).toBeDefined()
  })
})
