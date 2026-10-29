import '@testing-library/jest-dom'

// Mock WebGL context
class WebGLRenderingContext {
  constructor() {}
  static VERTEX_SHADER = 35633
  static FRAGMENT_SHADER = 35632
  static ARRAY_BUFFER = 34962
  static ELEMENT_ARRAY_BUFFER = 34963
  static TRIANGLES = 4
}

// @ts-ignore
global.WebGLRenderingContext = WebGLRenderingContext

// Mock canvas getContext
HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === 'webgl' || contextId === 'webgl2') {
    return {
      getExtension: () => null,
      getParameter: () => null,
    } as any
  }
  return null
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
